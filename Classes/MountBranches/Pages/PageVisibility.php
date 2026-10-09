<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\MountBranches\Pages;

use TYPO3\CMS\Core\Database\Connection;
use TYPO3\CMS\Core\Database\ConnectionPool;
use TYPO3\CMS\Core\Database\Query\Restriction\DeletedRestriction;
use TYPO3\CMS\Core\Type\Bitmask\Permission;

final readonly class PageVisibility
{
    private const TABLE = 'pages';

    public function __construct(private ConnectionPool $pool)
    {
    }

    /**
     * @param list<int> $chain group ids, nearest first
     * @param list<int> $pages
     *
     * @return list<array{page: int, title: string}>
     *
     * @throws \Doctrine\DBAL\Exception
     */
    public function unseen(array $chain, array $pages): array
    {
        $unseen = [];
        foreach ($this->permissionsOf($pages) as $row) {
            if ($this->shows($row['perms_everybody'])
                || (in_array((int) $row['perms_groupid'], $chain, true) && $this->shows($row['perms_group']))) {
                continue;
            }

            $unseen[] = ['page' => (int) $row['uid'], 'title' => $row['title']];
        }

        return $unseen;
    }

    /**
     * @param list<int> $pages
     *
     * @return list<array{uid: int|string, title: string, perms_groupid: int|string, perms_group: int|string, perms_everybody: int|string}>
     *
     * @throws \Doctrine\DBAL\Exception
     */
    private function permissionsOf(array $pages): array
    {
        $builder = $this->pool->getQueryBuilderForTable(self::TABLE);
        $builder->getRestrictions()->removeAll()->add(new DeletedRestriction());

        /** @var list<array{uid: int|string, title: string, perms_groupid: int|string, perms_group: int|string, perms_everybody: int|string}> $rows */
        $rows = $builder
            ->select('uid', 'title', 'perms_groupid', 'perms_group', 'perms_everybody')
            ->from(self::TABLE)
            ->where($builder->expr()->in('uid', $builder->createNamedParameter($pages, Connection::PARAM_INT_ARRAY)))
            ->executeQuery()
            ->fetchAllAssociative();

        return $rows;
    }

    private function shows(int|string $permissions): bool
    {
        return ((int) $permissions & Permission::PAGE_SHOW) === Permission::PAGE_SHOW;
    }
}
