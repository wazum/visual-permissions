<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Surfaces\ContextMenu;

use TYPO3\CMS\Backend\ContextMenu\ItemProviders\ProviderInterface;
use TYPO3\CMS\Core\Authentication\BackendUserAuthentication;
use Wazum\VisualPermissions\Configuration\PermissionMode;

final class RecordMenu implements ProviderInterface
{
    /**
     * @param array<string, mixed> $items
     *
     * @return array<string, mixed>
     */
    public function addItems(array $items): array
    {
        if (!PermissionMode::isOn($this->getBackendUser()->uc)) {
            return $items;
        }

        return array_intersect_key($items, array_flip(['view', 'edit', 'info']));
    }

    public function getPriority(): int
    {
        return 1;
    }

    public function canHandle(): bool
    {
        return true;
    }

    public function setContext(string $table, string $identifier, string $context = ''): void
    {
    }

    private function getBackendUser(): BackendUserAuthentication
    {
        /**
         * @var BackendUserAuthentication $backendUser
         */
        $backendUser = $GLOBALS['BE_USER'];

        return $backendUser;
    }
}
