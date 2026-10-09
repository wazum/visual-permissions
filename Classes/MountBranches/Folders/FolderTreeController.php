<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\MountBranches\Folders;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Backend\Dto\Tree\FileTreeItem;
use TYPO3\CMS\Backend\Dto\Tree\TreeItem;
use TYPO3\CMS\Core\Http\JsonResponse;
use TYPO3\CMS\Core\Http\Response;
use TYPO3\CMS\Core\Imaging\IconFactory;
use TYPO3\CMS\Core\Imaging\IconSize;
use TYPO3\CMS\Core\Resource\Folder;
use TYPO3\CMS\Core\Resource\ResourceFactory;
use Wazum\VisualPermissions\BackendGroups\BackendGroups;
use Wazum\VisualPermissions\Compatibility\FileStorageTreeProvider;

/**
 * @phpstan-type PreparedFolder array{
 *     resource: Folder,
 *     identifier: string,
 *     name: string,
 *     storage: int,
 *     pathIdentifier: string,
 *     hasChildren: bool,
 *     parentIdentifier: string|null,
 *     recordType: string,
 *     depth?: int,
 *     loaded?: bool
 * }
 */
final readonly class FolderTreeController
{
    public function __construct(
        private BackendGroups $groups,
        private FileStorageTreeProvider $folders,
        private ResourceFactory $resources,
        private IconFactory $icons,
    ) {
    }

    /**
     * @throws \Doctrine\DBAL\Exception
     */
    public function tree(ServerRequestInterface $request): ResponseInterface
    {
        $parent = $request->getQueryParams()['parent'] ?? null;
        if (is_string($parent) && '' !== $parent) {
            return new JsonResponse($this->subfoldersOf($parent, $request->getQueryParams()['depth'] ?? 1));
        }

        $groupId = $this->groups->existing($request->getQueryParams()['group'] ?? null);
        if (null === $groupId) {
            return new Response(null, 404);
        }

        $mounted = $this->groups->mountedFolders($groupId);

        $rows = [];

        foreach ($this->pathsTo($mounted) as $folder => $depth) {
            $rows[] = $this->rootItem($folder, $depth, !in_array($folder, $mounted, true));
        }

        return new JsonResponse($rows);
    }

    /**
     * @return list<FileTreeItem>
     */
    private function subfoldersOf(string $folder, mixed $depth): array
    {
        /** @var list<PreparedFolder> $children */
        $children = $this->folders->getSubfolders(
            $this->resources->getFolderObjectFromCombinedIdentifier(rawurldecode($folder)),
            (is_numeric($depth) ? (int) $depth : 1) + 1,
        );

        return array_map($this->treeItem(...), $children);
    }

    /**
     * @param PreparedFolder $prepared
     */
    private function treeItem(array $prepared): FileTreeItem
    {
        $icon = $this->icons->getIconForResource($prepared['resource'], IconSize::SMALL);

        return new FileTreeItem(
            item: new TreeItem(
                identifier: $prepared['identifier'],
                parentIdentifier: $prepared['parentIdentifier'] ?? '',
                recordType: $prepared['recordType'],
                name: $prepared['name'],
                prefix: '',
                suffix: '',
                tooltip: rawurldecode($prepared['identifier']),
                depth: $prepared['depth'] ?? 0,
                hasChildren: $prepared['hasChildren'],
                loaded: $prepared['loaded'] ?? false,
                icon: $icon->getIdentifier(),
                overlayIcon: $icon->getOverlayIcon()?->getIdentifier() ?? '',
            ),
            pathIdentifier: $prepared['pathIdentifier'],
            storage: $prepared['storage'],
            resourceType: 'folder',
        );
    }

    /**
     * @param list<string> $mounted
     *
     * @return array<string, int>
     */
    private function pathsTo(array $mounted): array
    {
        $depths = [];

        foreach ($mounted as $folder) {
            [$storage, $path] = explode(':', $folder, 2);
            $prefix = '';
            $depths["{$storage}:/"] = 0;

            foreach (array_values(array_filter(explode('/', $path))) as $depth => $segment) {
                $prefix .= "/{$segment}";
                $depths["{$storage}:{$prefix}/"] = $depth + 1;
            }
        }

        return $depths;
    }

    private function rootItem(string $folder, int $depth, bool $loaded): FileTreeItem
    {
        $resource = $this->resources->getFolderObjectFromCombinedIdentifier($folder);

        /** @var PreparedFolder $prepared */
        $prepared = $this->folders->prepareFolderInformation(
            $resource,
            // A storage's root folder has no name; a row with none is a blank line
            '' === $resource->getName() ? $resource->getStorage()->getName() : null,
        );
        $prepared['depth'] = $depth;
        $prepared['loaded'] = $loaded;

        return $this->treeItem($prepared);
    }
}
