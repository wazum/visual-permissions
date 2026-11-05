<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Compatibility;

use TYPO3\CMS\Backend\Tree\FileStorageTreeProvider as CoreFileStorageTreeProvider;
use TYPO3\CMS\Core\Information\Typo3Version;
use TYPO3\CMS\Core\Resource\Folder;

final readonly class FileStorageTreeProvider
{
    public function __construct(
        private CoreFileStorageTreeProvider $coreProvider,
        private Typo3Version $typo3Version,
    ) {
    }

    /**
     * @param array<array-key, Folder>|null $children
     *
     * @return array<string, mixed>
     */
    public function prepareFolderInformation(Folder $folder, ?string $alternativeName = null, ?Folder $parentFolder = null, ?array $children = null): array
    {
        /** @var array<string, mixed> $information */
        $information = $this->coreProvider->prepareFolderInformation($folder, $alternativeName, $parentFolder, $children);

        return $information;
    }

    /**
     * @return list<array<string, mixed>>
     */
    public function getSubfolders(Folder $folderObject, int $currentDepth): array
    {
        /** @var list<array<string, mixed>> $subfolders */
        $subfolders = $this->typo3Version->getMajorVersion() < 14
            ? $this->coreProvider->getSubfoldersRecursively($folderObject, $currentDepth)
            : $this->coreProvider->getSubfolders($folderObject, $currentDepth);

        return $subfolders;
    }
}
