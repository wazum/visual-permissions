<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Functional\DataHandling;

use PHPUnit\Framework\Attributes\Test;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;
use Wazum\VisualPermissions\DataHandling\Records;
use Wazum\VisualPermissions\Tests\Functional\Fixtures\VetoTheWrite;

final class RecordsTest extends FunctionalTestCase
{
    protected array $coreExtensionsToLoad = ['beuser'];

    protected array $testExtensionsToLoad = ['wazum/visual-permissions'];

    #[Test]
    public function givesTheIdOfTheRecordItMade(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/group_file_mounts.csv');
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_users.csv');
        $this->setUpBackendUser(1);

        $made = $this->get(Records::class)->create('sys_filemounts', [
            'pid' => 0,
            'title' => 'Library',
            'identifier' => '1:/library/',
        ]);

        self::assertSame(
            '1:/library/',
            $this->getConnectionPool()
                ->getConnectionForTable('sys_filemounts')
                ->fetchOne('SELECT identifier FROM sys_filemounts WHERE uid = ?', [$made]),
        );
    }

    #[Test]
    public function givesNoIdForARecordTheBackendRefused(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/group_file_mounts.csv');
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_users.csv');
        $this->setUpBackendUser(2);

        $made = $this->get(Records::class)->create('sys_filemounts', [
            'pid' => 0,
            'title' => 'Library',
            'identifier' => '1:/library/',
        ]);

        self::assertNull($made);
    }

    #[Test]
    public function saysTheUpdateWasTaken(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/group_file_mounts.csv');
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_users.csv');
        $this->setUpBackendUser(1);

        $taken = $this->get(Records::class)->update('be_groups', 20, ['TSconfig' => 'options.saveDocNew = 1']);

        self::assertTrue($taken);
        self::assertSame('options.saveDocNew = 1', $this->typoScriptOf(20));
    }

    #[Test]
    public function saysTheUpdateWasRefused(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/group_file_mounts.csv');
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_users.csv');
        $this->setUpBackendUser(1);
        VetoTheWrite::register();

        $taken = $this->get(Records::class)->update('be_groups', 20, ['TSconfig' => 'options.saveDocNew = 1']);

        self::assertFalse($taken);
        self::assertNull($this->typoScriptOf(20));
    }

    private function typoScriptOf(int $groupId): mixed
    {
        return $this->getConnectionPool()
            ->getConnectionForTable('be_groups')
            ->fetchOne('SELECT TSconfig FROM be_groups WHERE uid = ?', [$groupId]);
    }
}
