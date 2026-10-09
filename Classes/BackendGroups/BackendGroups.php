<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\BackendGroups;

use TYPO3\CMS\Core\Database\Connection;
use TYPO3\CMS\Core\Database\ConnectionPool;
use TYPO3\CMS\Core\Database\Query\Restriction\HiddenRestriction;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Core\Utility\StringUtility;
use Wazum\VisualPermissions\Authorization\Scope;
use Wazum\VisualPermissions\DataHandling\Records;

/**
 * @phpstan-type GroupRecord array{
 *     title: string,
 *     disabled: bool,
 *     subgroups: list<int>,
 *     fields: list<string>,
 *     modules: list<string>,
 *     pageMounts: list<int>,
 *     fileMounts: list<string>,
 *     tablesModify: list<string>,
 *     tablesSelect: list<string>,
 *     fieldValues: list<string>,
 *     pageTypes: list<string>,
 *     fileOperations: list<string>
 * }
 */
final readonly class BackendGroups
{
    public const TABLE = 'be_groups';

    private const FILE_MOUNTS = 'sys_filemounts';

    public function __construct(
        private ConnectionPool $connectionPool,
        private Records $records,
    ) {
    }

    /**
     * @return array<int, GroupRecord>
     *
     * @throws \Doctrine\DBAL\Exception
     */
    public function all(): array
    {
        $queryBuilder = $this->connectionPool->getQueryBuilderForTable(self::TABLE);
        $queryBuilder->getRestrictions()->removeByType(HiddenRestriction::class);

        /** @var list<array<string, string|int|null>> $rows */
        $rows = $queryBuilder
            ->select('uid', 'title', 'hidden', 'subgroup', ...array_map($this->columnFor(...), Scope::cases()))
            ->from(self::TABLE)
            ->orderBy('title')
            ->executeQuery()
            ->fetchAllAssociative();

        $folders = $this->foldersByMount();

        $groups = [];
        foreach ($rows as $row) {
            $values = [];
            foreach (Scope::cases() as $scope) {
                $column = (string) $row[$this->columnFor($scope)];
                $values[$scope->value] = match ($scope) {
                    Scope::PageMounts => GeneralUtility::intExplode(',', StringUtility::uniqueList($column), true),
                    Scope::FileMounts => $this->foldersOf($column, $folders),
                    default => $this->valuesFrom($column),
                };
            }

            /**
             * @var GroupRecord $group
             */
            $group = [
                'title' => (string) $row['title'],
                'disabled' => (bool) $row['hidden'],
                'subgroups' => GeneralUtility::intExplode(',', (string) $row['subgroup'], true),
                ...$values,
            ];
            $groups[(int) $row['uid']] = $group;
        }

        return $groups;
    }

    /**
     * @throws \Doctrine\DBAL\Exception
     */
    public function existing(mixed $id): ?int
    {
        $groupId = filter_var($id, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
        if (false === $groupId) {
            return null;
        }

        $queryBuilder = $this->connectionPool->getQueryBuilderForTable(self::TABLE);
        $queryBuilder->getRestrictions()->removeByType(HiddenRestriction::class);

        $found = $queryBuilder
            ->select('uid')
            ->from(self::TABLE)
            ->where($queryBuilder->expr()->eq('uid', $queryBuilder->createNamedParameter($groupId, Connection::PARAM_INT)))
            ->executeQuery()
            ->fetchOne();

        return false === $found ? null : $groupId;
    }

    /**
     * @return array<string, string>
     *
     * @throws \Doctrine\DBAL\Exception
     */
    public function folderTitles(): array
    {
        $rows = $this->connectionPool
            ->getQueryBuilderForTable(self::FILE_MOUNTS)
            ->select('identifier', 'title')
            ->from(self::FILE_MOUNTS)
            ->executeQuery()
            ->fetchAllAssociative();

        /** @var array<string, string> $titles */
        $titles = array_column($rows, 'title', 'identifier');

        return $titles;
    }

    /**
     * @return list<string>
     *
     * @throws \Doctrine\DBAL\Exception
     */
    public function mountedFolders(int $groupId): array
    {
        return $this->foldersOf(implode(',', $this->listOf($groupId, Scope::FileMounts)), $this->foldersByMount());
    }

    /**
     * @return list<string>
     *
     * @throws \Doctrine\DBAL\Exception
     */
    public function listOf(int $groupId, Scope $scope): array
    {
        $queryBuilder = $this->connectionPool->getQueryBuilderForTable(self::TABLE);
        $queryBuilder->getRestrictions()->removeByType(HiddenRestriction::class);

        $list = $queryBuilder
            ->select($this->columnFor($scope))
            ->from(self::TABLE)
            ->where($queryBuilder->expr()->eq('uid', $queryBuilder->createNamedParameter($groupId, Connection::PARAM_INT)))
            ->executeQuery()
            ->fetchOne();

        return $this->valuesFrom(is_string($list) ? $list : '');
    }

    /**
     * @param list<array{target: string, grant: bool}> $operations
     *
     * @return bool whether the backend took the write
     *
     * @throws \Doctrine\DBAL\Exception
     */
    public function grant(int $groupId, Scope $scope, array $operations): bool
    {
        $list = $this->listOf($groupId, $scope);

        foreach ($operations as $operation) {
            $list = $operation['grant']
                ? [...$list, $operation['target']]
                : array_values(array_diff($list, [$operation['target']]));
        }

        return $this->update($groupId, $scope, $list);
    }

    /**
     * @param list<string|int> $values
     *
     * @return bool whether the backend took the write
     */
    public function update(int $groupId, Scope $scope, array $values): bool
    {
        return $this->records->update(self::TABLE, $groupId, [
            $this->columnFor($scope) => StringUtility::uniqueList(implode(',', $values)),
        ]);
    }

    private function columnFor(Scope $scope): string
    {
        return match ($scope) {
            Scope::Fields => 'non_exclude_fields',
            Scope::FieldValues => 'explicit_allowdeny',
            Scope::Modules => 'groupMods',
            Scope::PageMounts => 'db_mountpoints',
            Scope::FileMounts => 'file_mountpoints',
            Scope::FileOperations => 'file_permissions',
            Scope::PageTypes => 'pagetypes_select',
            Scope::TablesModify => 'tables_modify',
            Scope::TablesSelect => 'tables_select',
        };
    }

    /**
     * @return array<int, string>
     *
     * @throws \Doctrine\DBAL\Exception
     */
    private function foldersByMount(): array
    {
        /** @var list<array{uid: int, identifier: string}> $rows */
        $rows = $this->connectionPool
            ->getQueryBuilderForTable(self::FILE_MOUNTS)
            ->select('uid', 'identifier')
            ->from(self::FILE_MOUNTS)
            ->executeQuery()
            ->fetchAllAssociative();

        return array_column($rows, 'identifier', 'uid');
    }

    /**
     * @param array<int, string> $folders
     *
     * @return list<string>
     */
    private function foldersOf(string $mounts, array $folders): array
    {
        $named = array_map(
            static fn(int $mount): string => $folders[$mount] ?? '',
            GeneralUtility::intExplode(',', StringUtility::uniqueList($mounts), true),
        );

        return array_values(array_filter($named, static fn(string $folder): bool => '' !== $folder));
    }

    /**
     * @return list<string>
     */
    private function valuesFrom(string $column): array
    {
        return GeneralUtility::trimExplode(',', StringUtility::uniqueList($column), true);
    }
}
