<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\EditOtherPermissions;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Backend\Form\Exception\DatabaseRecordException;
use TYPO3\CMS\Backend\Form\FormDataCompiler;
use TYPO3\CMS\Backend\Form\FormDataGroup\TcaDatabaseRecord;
use TYPO3\CMS\Backend\Form\NodeFactory;
use TYPO3\CMS\Backend\Routing\UriBuilder;
use TYPO3\CMS\Core\Http\JsonResponse;
use TYPO3\CMS\Core\Http\Response;
use TYPO3\CMS\Core\Page\JavaScriptItems;
use TYPO3\CMS\Core\Page\JavaScriptModuleInstruction;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use Wazum\VisualPermissions\Authorization\Scope;
use Wazum\VisualPermissions\BackendGroups\BackendGroups;
use Wazum\VisualPermissions\DataHandling\Records;

final readonly class OtherPermissionsController
{
    private const COLUMNS = [
        'hidden',
        'subgroup',
        'allowed_languages',
        'category_perms',
        'mfa_providers',
        'workspace_perms',
        'availableWidgets',
        'custom_options',
        'TSconfig',
        'tsconfig_includes',
    ];

    private const NOT_PERMISSIONS = ['title', 'description'];

    private const FORM_NAME = 'editform';

    public function __construct(
        private FormDataCompiler $formDataCompiler,
        private NodeFactory $nodeFactory,
        private UriBuilder $uriBuilder,
        private BackendGroups $groups,
        private Records $records,
    ) {
    }

    /**
     * @throws \TYPO3\CMS\Backend\Form\Exception
     * @throws \TYPO3\CMS\Backend\Routing\Exception\RouteNotFoundException
     * @throws \UnexpectedValueException
     */
    public function form(ServerRequestInterface $request): ResponseInterface
    {
        $requested = $request->getQueryParams()['group'] ?? null;

        try {
            $formData = $this->formDataOf($request, is_numeric($requested) ? (int) $requested : 0);
        } catch (DatabaseRecordException) {
            return new Response(null, 404);
        }

        $formData['fieldListToRender'] = implode(',', $this->columnsOf($formData));
        $formData['renderType'] = 'listOfFieldsContainer';

        /** @var array{html: string, javaScriptModules: list<JavaScriptModuleInstruction>} $form */
        $form = $this->nodeFactory->create($formData)->render();

        $items = new JavaScriptItems();
        $items->addGlobalAssignment(['TYPO3' => ['settings' => ['FormEngine' => ['formName' => self::FORM_NAME]]]]);

        foreach ($form['javaScriptModules'] as $module) {
            $items->addJavaScriptModuleInstruction($module);
        }

        $items->addJavaScriptModuleInstruction(
            JavaScriptModuleInstruction::create('@typo3/backend/form-engine.js')
                ->invoke('initialize', (string) $this->uriBuilder->buildUriFromRoute('wizard_element_browser')),
        );

        return new JsonResponse(['html' => $form['html'], 'scriptItems' => $items]);
    }

    /**
     * @throws \Doctrine\DBAL\Exception
     * @throws \InvalidArgumentException
     * @throws \UnexpectedValueException
     */
    public function write(ServerRequestInterface $request): ResponseInterface
    {
        $body = $request->getParsedBody();
        $params = is_array($body) ? $body : [];
        $groupId = $this->groups->existing($params['group'] ?? null);
        if (null === $groupId) {
            return new Response(null, 404);
        }

        $values = array_intersect_key(
            $this->fieldsOf($params['data'] ?? null, $groupId),
            array_flip($this->columnsOf($this->formDataOf($request, $groupId))),
        );
        if ([] === $values) {
            return new Response(null, 400);
        }

        if (!$this->records->update(BackendGroups::TABLE, $groupId, $values)) {
            return new Response(null, 409);
        }

        return new Response(null, 204);
    }

    /**
     * @return array<mixed>
     *
     * @throws \InvalidArgumentException
     * @throws \UnexpectedValueException
     */
    private function formDataOf(ServerRequestInterface $request, int $groupId): array
    {
        return $this->formDataCompiler->compile([
            'request' => $request,
            'tableName' => BackendGroups::TABLE,
            'vanillaUid' => $groupId,
            'command' => 'edit',
        ], GeneralUtility::makeInstance(TcaDatabaseRecord::class));
    }

    /**
     * @param array<mixed> $formData
     *
     * @return list<string>
     */
    private function columnsOf(array $formData): array
    {
        /** @var list<string> $shown */
        $shown = $formData['columnsToProcess'];

        return [
            ...self::COLUMNS,
            ...array_diff($shown, self::COLUMNS, self::NOT_PERMISSIONS, array_map($this->groups->columnFor(...), Scope::cases())),
        ];
    }

    /**
     * @return array<mixed>
     */
    private function fieldsOf(mixed $data, int $groupId): array
    {
        $table = is_array($data) ? $data[BackendGroups::TABLE] ?? null : null;
        $fields = is_array($table) ? $table[(string) $groupId] ?? null : null;

        return is_array($fields) ? $fields : [];
    }
}
