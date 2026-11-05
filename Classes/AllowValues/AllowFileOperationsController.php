<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\AllowValues;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Core\Authentication\BackendUserAuthentication;
use TYPO3\CMS\Core\Http\JsonResponse;
use TYPO3\CMS\Core\Localization\LanguageServiceFactory;
use Wazum\VisualPermissions\Authorization\GrantOperations;
use Wazum\VisualPermissions\Authorization\Scope;
use Wazum\VisualPermissions\BackendGroups\BackendGroups;
use Wazum\VisualPermissions\Write\GroupWriteController;

/**
 * @phpstan-import-type SelectConfiguration from ValueChoices
 *
 * @extends GroupWriteController<array{target: string, grant: bool}>
 */
final readonly class AllowFileOperationsController extends GroupWriteController
{
    public function __construct(BackendGroups $groups, private LanguageServiceFactory $languages)
    {
        parent::__construct($groups);
    }

    public function choices(ServerRequestInterface $request): ResponseInterface
    {
        /**
         * @var BackendUserAuthentication $administrator
         */
        $administrator = $request->getAttribute('backend.user');
        $language = $this->languages->createFromUserPreferences($administrator);

        return new JsonResponse(
            (new ValueChoices($language))->of('fileOperations', $this->filePermissionsConfiguration()),
        );
    }

    protected function operationsFrom(mixed $sent): ?array
    {
        return GrantOperations::from($sent, 'value', $this->grantable(...));
    }

    /**
     * @throws \Doctrine\DBAL\Exception
     */
    protected function writeOperations(int $groupId, array $operations): bool
    {
        return $this->groups->grant($groupId, Scope::FileOperations, $operations);
    }

    /**
     * @return SelectConfiguration
     */
    private function filePermissionsConfiguration(): array
    {
        /**
         * @var array{be_groups: array{columns: array{file_permissions: array{config: SelectConfiguration}}}} $tableConfigurations
         */
        $tableConfigurations = $GLOBALS['TCA'];

        return $tableConfigurations['be_groups']['columns']['file_permissions']['config'];
    }

    private function grantable(string $fileOperation): bool
    {
        $offered = array_map(strval(...), array_column($this->filePermissionsConfiguration()['items'] ?? [], 'value'));

        return ValueChoices::DIVIDER !== $fileOperation && in_array($fileOperation, $offered, true);
    }
}
