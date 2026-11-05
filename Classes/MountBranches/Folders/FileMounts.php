<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\MountBranches\Folders;

use Doctrine\DBAL\ArrayParameterType;
use TYPO3\CMS\Core\Database\ConnectionPool;
use Wazum\VisualPermissions\Authorization\Scope;
use Wazum\VisualPermissions\BackendGroups\BackendGroups;
use Wazum\VisualPermissions\DataHandling\Records;

final readonly class FileMounts
{
    private const FILE_MOUNTS = 'sys_filemounts';

    public function __construct(
        private ConnectionPool $pool,
        private BackendGroups $groups,
        private Records $records,
    ) {
    }

    /**
     * @param list<array{folder: string, mount: bool, title?: string}> $operations
     *
     * @return bool whether the backend took the write
     *
     * @throws \Doctrine\DBAL\Exception
     */
    public function write(int $groupId, array $operations): bool
    {
        foreach ($operations as $operation) {
            if ($operation['mount'] && null === $this->existingMountOf($operation['folder']) && '' === trim($operation['title'] ?? '')) {
                return false;
            }
        }

        $mounts = $this->mountsOf($groupId);

        foreach ($operations as $operation) {
            if (!$operation['mount']) {
                $mounts = array_values(array_diff($mounts, $this->mountsOfFolder($mounts, $operation['folder'])));

                continue;
            }

            $mount = $this->mountFor($operation['folder'], $operation['title'] ?? '');
            if (null === $mount) {
                return false;
            }

            $mounts = [...$mounts, $mount];
        }

        return $this->groups->update($groupId, Scope::FileMounts, $mounts);
    }

    /**
     * @throws \Doctrine\DBAL\Exception
     */
    private function existingMountOf(string $folder): ?int
    {
        $builder = $this->pool->getQueryBuilderForTable(self::FILE_MOUNTS);

        $mount = $builder
            ->select('uid')
            ->from(self::FILE_MOUNTS)
            ->where($builder->expr()->eq('identifier', $builder->createNamedParameter($folder)))
            ->executeQuery()
            ->fetchOne();

        return is_numeric($mount) ? (int) $mount : null;
    }

    /**
     * @return list<int>
     *
     * @throws \Doctrine\DBAL\Exception
     */
    private function mountsOf(int $groupId): array
    {
        return array_map(intval(...), $this->groups->listOf($groupId, Scope::FileMounts));
    }

    /**
     * @param list<int> $mounts
     *
     * @return list<int>
     *
     * @throws \Doctrine\DBAL\Exception
     */
    private function mountsOfFolder(array $mounts, string $folder): array
    {
        $builder = $this->pool->getQueryBuilderForTable(self::FILE_MOUNTS);

        return array_map(static fn(mixed $uid): int => is_numeric($uid) ? (int) $uid : 0, $builder
            ->select('uid')
            ->from(self::FILE_MOUNTS)
            ->where(
                $builder->expr()->eq('identifier', $builder->createNamedParameter($folder)),
                $builder->expr()->in('uid', $builder->createNamedParameter($mounts, ArrayParameterType::INTEGER)),
            )
            ->executeQuery()
            ->fetchFirstColumn());
    }

    /**
     * @throws \Doctrine\DBAL\Exception
     */
    private function mountFor(string $folder, string $title): ?int
    {
        return $this->existingMountOf($folder) ?? $this->newMountOf($folder, trim($title));
    }

    private function newMountOf(string $folder, string $title): ?int
    {
        return $this->records->create(self::FILE_MOUNTS, ['pid' => 0, 'title' => $title, 'identifier' => $folder]);
    }
}
