<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Inspect;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Backend\Routing\UriBuilder;
use TYPO3\CMS\Core\Authentication\BackendUserAuthentication;
use TYPO3\CMS\Core\Http\JsonResponse;
use TYPO3\CMS\Core\Http\Response;
use TYPO3\CMS\Core\Localization\LanguageServiceFactory;
use Wazum\VisualPermissions\BackendGroups\BackendGroups;
use Wazum\VisualPermissions\GrantTables\TableCatalogue;
use Wazum\VisualPermissions\MountBranches\Pages\MountOrder;
use Wazum\VisualPermissions\MountBranches\Pages\PageVisibility;

final readonly class InspectController
{
    public function __construct(
        private BackendGroups $groups,
        private PermissionStateComposer $composer,
        private MountOrder $mountOrder,
        private PageVisibility $pageVisibility,
        private TableCatalogue $tables,
        private LanguageServiceFactory $languageServiceFactory,
        private UriBuilder $uriBuilder,
    ) {
    }

    /**
     * @throws \Doctrine\DBAL\Exception
     */
    public function inspect(ServerRequestInterface $request): ResponseInterface
    {
        $groupId = $this->groups->existing($request->getQueryParams()['group'] ?? null);
        if (null === $groupId) {
            return new Response(null, 404);
        }

        $requestedTables = $request->getQueryParams()['tables'] ?? [];
        $tables = is_array($requestedTables) ? array_values(array_filter($requestedTables, is_string(...))) : [];

        $state = $this->composer->compose($groupId, $this->groups->all(), $tables);
        $state['scopes']['pageMounts']['order'] = $this->mountOrder
            ->inTreeOrder(array_keys($state['scopes']['pageMounts']['targets']));
        $state['scopes']['pageMounts']['unseen'] = array_map(
            fn(array $unseen): array => $unseen + ['link' => (string) $this->uriBuilder
                ->buildUriFromRoute('permissions_pages', ['id' => $unseen['page']])],
            $this->pageVisibility->unseen(
                array_column($state['chain'], 'groupId'),
                array_keys($state['scopes']['pageMounts']['targets']),
            ),
        );
        $state['scopes']['fileMounts']['named'] = $this->groups->folderTitles();

        /** @var BackendUserAuthentication|null $backendUser */
        $backendUser = $request->getAttribute('backend.user');
        $language = $this->languageServiceFactory->createFromUserPreferences($backendUser);
        $state['scopes']['tablesModify']['named'] = array_map(
            $language->sL(...),
            $this->tables->titles($tables),
        );

        return new JsonResponse($state);
    }
}
