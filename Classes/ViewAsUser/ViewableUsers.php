<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\ViewAsUser;

use TYPO3\CMS\Backend\Utility\BackendUtility;
use TYPO3\CMS\Core\Database\ConnectionPool;
use TYPO3\CMS\Core\Database\Query\QueryHelper;
use TYPO3\CMS\Core\Utility\GeneralUtility;

final readonly class ViewableUsers
{
    private const TABLE = 'be_users';

    public function __construct(private ConnectionPool $connectionPool)
    {
    }

    /**
     * @throws \Doctrine\DBAL\Exception
     */
    public function version(): string
    {
        $queryBuilder = $this->connectionPool->getQueryBuilderForTable(self::TABLE);

        /** @var array{newest: int|string|null, howMany: int|string}|false $answer */
        $answer = $queryBuilder
            ->selectLiteral('MAX(tstamp) AS newest', 'COUNT(uid) AS howMany')
            ->from(self::TABLE)
            ->executeQuery()
            ->fetchAssociative();
        if (false === $answer) {
            return '0-0';
        }

        return sprintf('%d-%d', (int) $answer['newest'], (int) $answer['howMany']);
    }

    /**
     * @return array<int, array{username: string, realName: string, groups: list<int>}>
     *
     * @throws \Doctrine\DBAL\Exception
     */
    public function all(): array
    {
        $queryBuilder = $this->connectionPool->getQueryBuilderForTable(self::TABLE);

        /** @var list<array{uid: int|string, username: string, realName: string|null, usergroup: string|null}> $rows */
        $rows = $queryBuilder
            ->select('uid', 'username', 'realName', 'usergroup')
            ->from(self::TABLE)
            ->where(
                $queryBuilder->expr()->eq('admin', 0),
                QueryHelper::stripLogicalOperatorPrefix(BackendUtility::BEenableFields(self::TABLE)),
            )
            ->orderBy('username')
            ->executeQuery()
            ->fetchAllAssociative();

        $users = [];
        foreach ($rows as $row) {
            $users[(int) $row['uid']] = [
                'username' => $row['username'],
                'realName' => $row['realName'] ?? '',
                'groups' => GeneralUtility::intExplode(',', $row['usergroup'] ?? '', true),
            ];
        }

        return $users;
    }
}
