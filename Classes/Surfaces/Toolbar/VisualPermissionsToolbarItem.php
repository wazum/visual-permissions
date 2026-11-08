<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Surfaces\Toolbar;

use Psr\Http\Message\ServerRequestInterface;
use Psr\Log\LoggerInterface;
use TYPO3\CMS\Backend\Routing\UriBuilder;
use TYPO3\CMS\Backend\Toolbar\RequestAwareToolbarItemInterface;
use TYPO3\CMS\Backend\Toolbar\ToolbarItemInterface;
use TYPO3\CMS\Core\Authentication\BackendUserAuthentication;
use TYPO3\CMS\Core\Page\PageRenderer;
use Wazum\VisualPermissions\BackendGroups\GroupCatalogue;
use Wazum\VisualPermissions\Compatibility\BackendViewFactory;

final class VisualPermissionsToolbarItem implements ToolbarItemInterface, RequestAwareToolbarItemInterface
{
    private ServerRequestInterface $request;

    public function __construct(
        private readonly BackendViewFactory $viewFactory,
        private readonly GroupCatalogue $catalogue,
        private readonly PageRenderer $pageRenderer,
        private readonly LoggerInterface $logger,
        private readonly UriBuilder $uriBuilder,
    ) {
    }

    public function setRequest(ServerRequestInterface $request): void
    {
        $this->request = $request;
    }

    public function checkAccess(): bool
    {
        $backendUser = $GLOBALS['BE_USER'] ?? null;

        return $backendUser instanceof BackendUserAuthentication && $backendUser->isAdmin();
    }

    public function getItem(): string
    {
        try {
            $groups = $this->catalogue->all();
        } catch (\Doctrine\DBAL\Exception $exception) {
            $this->logger->error($exception->getMessage());

            return '';
        }

        $this->pageRenderer->addInlineLanguageLabelFile('EXT:visual_permissions/Resources/Private/Language/locallang.xlf');
        $this->pageRenderer->addInlineLanguageLabelFile('EXT:core/Resources/Private/Language/locallang_core.xlf', 'rm.saveDoc');
        $this->pageRenderer->addInlineLanguageLabelFile(
            'EXT:backend/Resources/Private/Language/locallang_alt_doc.xlf',
            'notification.record_saved.title.singular',
        );
        $this->pageRenderer->addInlineLanguageLabelFile(
            'EXT:core/Resources/Private/Language/locallang_tca.xlf',
            'be_groups.tables_modify.permissions.',
        );

        $view = $this->viewFactory->create($this->request);
        $view->assign('groups', $groups);
        $view->assign('newGroup', $this->newRecord('be_groups'));
        $view->assign('newUser', $this->newRecord('be_users'));

        return $view->render('ToolbarItems/VisualPermissionsToolbarItem');
    }

    public function hasDropDown(): bool
    {
        return false;
    }

    public function getDropDown(): string
    {
        return '';
    }

    /**
     * @return array<string, string>
     */
    public function getAdditionalAttributes(): array
    {
        return ['class' => 'vperm-toolbar-item'];
    }

    public function getIndex(): int
    {
        return 85;
    }

    private function newRecord(string $table): string
    {
        return (string) $this->uriBuilder->buildUriFromRoute('record_edit', ['edit' => [$table => [0 => 'new']]]);
    }
}
