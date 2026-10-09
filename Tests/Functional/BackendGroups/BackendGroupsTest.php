<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Functional\BackendGroups;

use PHPUnit\Framework\Attributes\Test;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;
use Wazum\VisualPermissions\Authorization\Scope;
use Wazum\VisualPermissions\BackendGroups\BackendGroups;

final class BackendGroupsTest extends FunctionalTestCase
{
    protected array $coreExtensionsToLoad = ['beuser'];

    protected array $testExtensionsToLoad = ['wazum/visual-permissions'];

    // A deleted group is gone for good; a disabled one can be re-enabled
    #[Test]
    public function listsEveryGroupThatIsStillThere(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_groups.csv');

        self::assertSame(
            [2 => 'Editors', 3 => 'Retired', 1 => 'Reviewers'],
            array_map(static fn(array $group): string => $group['title'], $this->get(BackendGroups::class)->all()),
        );
    }

    #[Test]
    public function namesAGroupThatIsThere(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_groups.csv');

        self::assertSame(2, $this->get(BackendGroups::class)->existing('2'));
    }

    #[Test]
    public function namesAGroupThatIsDisabled(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_groups.csv');

        self::assertSame(3, $this->get(BackendGroups::class)->existing('3'));
    }

    #[Test]
    public function namesNoGroupThatWasDeleted(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_groups.csv');

        self::assertNull($this->get(BackendGroups::class)->existing('4'));
    }

    #[Test]
    public function namesNoGroupThatIsNotThere(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_groups.csv');

        self::assertNull($this->get(BackendGroups::class)->existing('99'));
    }

    #[Test]
    public function saysWhichGroupIsDisabled(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_groups.csv');

        $groups = $this->get(BackendGroups::class)->all();

        self::assertTrue($groups[3]['disabled']);
        self::assertFalse($groups[2]['disabled']);
    }

    #[Test]
    public function readsThePagesAGroupMounts(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/group_mounts.csv');

        $groups = $this->get(BackendGroups::class)->all();

        self::assertSame([3, 5], $groups[20]['pageMounts']);
        self::assertSame([5, 7], $groups[21]['pageMounts']);
    }

    #[Test]
    public function readsTheTablesAGroupMayWriteAndTheOnesItMayRead(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/group_tables.csv');

        $groups = $this->get(BackendGroups::class)->all();

        self::assertSame(['tt_content', 'pages'], $groups[20]['tablesModify']);
        self::assertSame(['sys_category'], $groups[20]['tablesSelect']);
        self::assertSame([], $groups[21]['tablesModify']);
    }

    #[Test]
    public function readsTheFoldersAGroupMounts(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/group_file_mounts.csv');

        $groups = $this->get(BackendGroups::class)->all();

        self::assertSame(['1:/campaign/', '1:/press/'], $groups[20]['fileMounts']);
        self::assertSame(['1:/press/'], $groups[21]['fileMounts']);
    }

    #[Test]
    public function readsTheListOfOneScope(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/group_tables.csv');

        self::assertSame(
            ['tt_content', 'pages'],
            $this->get(BackendGroups::class)->listOf(20, Scope::TablesModify),
        );
    }

    #[Test]
    public function readsTheFoldersOneGroupMounts(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/group_file_mounts.csv');

        self::assertSame(['1:/campaign/', '1:/press/'], $this->get(BackendGroups::class)->mountedFolders(20));
    }

    #[Test]
    public function keepsAListTheBackendTook(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/group_tables.csv');
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_users.csv');
        $this->setUpBackendUser(1);

        $taken = $this->get(BackendGroups::class)
            ->update(20, Scope::TablesModify, ['pages', 'sys_file_reference']);

        self::assertTrue($taken);
        self::assertSame('pages,sys_file_reference', $this->tablesOfTwenty());
    }

    #[Test]
    public function grantsAndTakesBackInOneWrite(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/group_tables.csv');
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_users.csv');
        $this->setUpBackendUser(1);

        $this->get(BackendGroups::class)->grant(20, Scope::TablesModify, [
            ['target' => 'sys_category', 'grant' => true],
            ['target' => 'pages', 'grant' => false],
        ]);

        self::assertSame('tt_content,sys_category', $this->tablesOfTwenty());
    }

    #[Test]
    public function grantsWhatTheGroupHasOnlyOnce(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/group_tables.csv');
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_users.csv');
        $this->setUpBackendUser(1);

        $this->get(BackendGroups::class)->grant(20, Scope::TablesModify, [['target' => 'pages', 'grant' => true]]);

        self::assertSame('tt_content,pages', $this->tablesOfTwenty());
    }

    private function tablesOfTwenty(): string
    {
        $tables = $this->getConnectionPool()
            ->getConnectionForTable('be_groups')
            ->fetchOne('SELECT tables_modify FROM be_groups WHERE uid = 20');

        return is_string($tables) ? $tables : '';
    }
}
