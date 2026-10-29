<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\MountBranches\Folders;

use TYPO3\CMS\Core\Resource\Exception;
use TYPO3\CMS\Core\Resource\ResourceFactory;
use Wazum\VisualPermissions\BackendGroups\BackendGroups;
use Wazum\VisualPermissions\Write\GroupWriteController;

/**
 * @extends GroupWriteController<array{folder: string, mount: bool, title: string}>
 */
final readonly class MountFoldersController extends GroupWriteController
{
    public function __construct(
        BackendGroups $groups,
        private FileMounts $mounts,
        private ResourceFactory $resources,
    ) {
        parent::__construct($groups);
    }

    protected function operationsFrom(mixed $sent): ?array
    {
        if (!is_array($sent)) {
            return null;
        }

        $operations = [];
        foreach ($sent as $operation) {
            if (!is_array($operation) || !array_key_exists('mount', $operation)) {
                return null;
            }

            $folder = $operation['folder'] ?? null;
            if (!is_string($folder) || 1 !== preg_match('#^\d+:/#', $folder)) {
                return null;
            }

            $mount = filter_var($operation['mount'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            if (null === $mount) {
                return null;
            }

            // Removing a mount leaves the reader with no access, so a mount on a whole storage is exclusive
            if ($mount && (1 === preg_match('#^\d+:/$#', $folder) || !$this->exists($folder))) {
                return null;
            }

            $title = $operation['title'] ?? '';

            $operations[] = [
                'folder' => $folder,
                'mount' => $mount,
                'title' => is_string($title) ? $title : '',
            ];
        }

        return $operations;
    }

    /**
     * @throws \Doctrine\DBAL\Exception
     */
    protected function writeOperations(int $groupId, array $operations): bool
    {
        return $this->mounts->write($groupId, $operations);
    }

    private function exists(string $folder): bool
    {
        try {
            $this->resources->getFolderObjectFromCombinedIdentifier($folder);
        } catch (Exception) {
            return false;
        }

        return true;
    }
}
