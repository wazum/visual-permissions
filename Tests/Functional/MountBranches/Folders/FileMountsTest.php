<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Functional\MountBranches\Folders;

use PHPUnit\Framework\Attributes\Test;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;
use Wazum\VisualPermissions\BackendGroups\BackendGroups;
use Wazum\VisualPermissions\MountBranches\Folders\FileMounts;

final class FileMountsTest extends FunctionalTestCase
{
    protected array $coreExtensionsToLoad = ['beuser'];

    protected array $testExtensionsToLoad = ['wazum/visual-permissions'];

    #[Test]
    public function mountsAFolderOnTheGroupItself(): void
    {
        $this->arrange();

        $this->get(FileMounts::class)->write(20, [['folder' => '1:/archive/', 'mount' => true]]);

        self::assertSame('1,2,3', $this->mountsOf(20));
    }

    #[Test]
    public function takesAMountAwayFromTheGroupItself(): void
    {
        $this->arrange();

        $this->get(FileMounts::class)->write(20, [['folder' => '1:/campaign/', 'mount' => false]]);

        self::assertSame('2', $this->mountsOf(20));
    }

    #[Test]
    public function takesAwayTheMountTheGroupHoldsWhenAnotherRecordNamesTheSameFolder(): void
    {
        $this->arrange();
        $this->getConnectionPool()->getConnectionForTable('sys_filemounts')
            ->insert('sys_filemounts', ['uid' => 4, 'pid' => 0, 'title' => 'Campaign, read only', 'identifier' => '1:/campaign/', 'read_only' => 1]);
        $this->getConnectionPool()->getConnectionForTable('be_groups')
            ->update('be_groups', ['file_mountpoints' => '4,2'], ['uid' => 20]);

        $this->get(FileMounts::class)->write(20, [['folder' => '1:/campaign/', 'mount' => false]]);

        self::assertSame('2', $this->mountsOf(20));
    }

    #[Test]
    public function makesAFileMountForAFolderThatHasNone(): void
    {
        $this->arrange();

        $this->get(FileMounts::class)->write(20, [
            ['folder' => '1:/library/', 'mount' => true, 'title' => 'Library'],
        ]);

        self::assertSame(
            ['1:/campaign/', '1:/press/', '1:/library/'],
            $this->get(BackendGroups::class)->all()[20]['fileMounts'],
        );
    }

    #[Test]
    public function leavesTheSubgroupsAlone(): void
    {
        $this->arrange();

        $this->get(FileMounts::class)->write(20, [['folder' => '1:/press/', 'mount' => false]]);

        self::assertSame('1', $this->mountsOf(20));
        self::assertSame('2', $this->mountsOf(21));
    }

    #[Test]
    public function appliesAWholeBatchAtOnce(): void
    {
        $this->arrange();

        $this->get(FileMounts::class)->write(20, [
            ['folder' => '1:/archive/', 'mount' => true],
            ['folder' => '1:/campaign/', 'mount' => false],
        ]);

        self::assertSame('2,3', $this->mountsOf(20));
    }

    #[Test]
    public function mountsAFolderOnlyOnce(): void
    {
        $this->arrange();

        $this->get(FileMounts::class)->write(20, [['folder' => '1:/press/', 'mount' => true]]);

        self::assertSame('1,2', $this->mountsOf(20));
    }

    #[Test]
    public function saysTheWriteWasTaken(): void
    {
        $this->arrange();

        $taken = $this->get(FileMounts::class)->write(20, [['folder' => '1:/archive/', 'mount' => true]]);

        self::assertTrue($taken);
    }

    #[Test]
    public function saysTheWriteWasRefused(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/group_file_mounts.csv');
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/be_users.csv');
        // Only admins may write a group; this one's write is disabled
        $this->setUpBackendUser(2);

        $taken = $this->get(FileMounts::class)->write(20, [['folder' => '1:/archive/', 'mount' => true]]);

        self::assertFalse($taken);
        self::assertSame('1,2', $this->mountsOf(20));
    }

    #[Test]
    public function makesAFileMountUnderTheTitleItWasGiven(): void
    {
        $this->arrange();

        $this->get(FileMounts::class)->write(20, [
            ['folder' => '1:/library/', 'mount' => true, 'title' => 'Shared library'],
        ]);

        self::assertSame('Shared library', $this->titleOf('1:/library/'));
    }

    #[Test]
    public function refusesToMakeAFileMountWithNoTitle(): void
    {
        $this->arrange();

        $taken = $this->get(FileMounts::class)->write(20, [['folder' => '1:/library/', 'mount' => true]]);

        self::assertFalse($taken);
        self::assertSame('1,2', $this->mountsOf(20));
        self::assertSame('', $this->titleOf('1:/library/'));
    }

    #[Test]
    public function makesNoFileMountToTakeAwayFromAFolderThatHasNone(): void
    {
        $this->arrange();

        $this->get(FileMounts::class)->write(20, [
            ['folder' => '1:/library/', 'mount' => false, 'title' => 'Library'],
        ]);

        self::assertSame('', $this->titleOf('1:/library/'));
    }

    #[Test]
    public function makesNoFileMountForABatchItRefuses(): void
    {
        $this->arrange();

        $taken = $this->get(FileMounts::class)->write(20, [
            ['folder' => '1:/library/', 'mount' => true, 'title' => 'Library'],
            ['folder' => '1:/shared/', 'mount' => true],
        ]);

        self::assertFalse($taken);
        self::assertSame('', $this->titleOf('1:/library/'));
    }

    private function titleOf(string $folder): string
    {
        $title = $this->getConnectionPool()
            ->getConnectionForTable('sys_filemounts')
            ->fetchOne('SELECT title FROM sys_filemounts WHERE identifier = ?', [$folder]);

        return is_string($title) ? $title : '';
    }

    private function arrange(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/group_file_mounts.csv');
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/be_users.csv');
        $this->setUpBackendUser(1);
    }

    private function mountsOf(int $groupId): string
    {
        $mounts = $this->getConnectionPool()
            ->getConnectionForTable('be_groups')
            ->fetchOne('SELECT file_mountpoints FROM be_groups WHERE uid = ?', [$groupId]);

        return is_string($mounts) ? $mounts : '';
    }
}
