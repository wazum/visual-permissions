<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Functional\DataHandling;

use PHPUnit\Framework\Attributes\Test;
use TYPO3\CMS\Core\DataHandling\DataHandler;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;
use Wazum\VisualPermissions\DataHandling\Records;

final class WriteGuardTest extends FunctionalTestCase
{
    protected array $coreExtensionsToLoad = ['beuser'];

    protected array $testExtensionsToLoad = ['wazum/visual-permissions'];

    #[Test]
    public function turnsDownARecordWriteWhileThePermissionsAreShown(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_users.csv');
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/pages.csv');
        $backendUser = $this->setUpBackendUser(1);
        $backendUser->uc = ['vperm' => ['session' => ['active' => 'true']]];

        $dataHandler = GeneralUtility::makeInstance(DataHandler::class);
        $dataHandler->start(['pages' => [1 => ['title' => 'Changed']]], []);
        $dataHandler->process_datamap();

        self::assertSame(
            'Root',
            $this->getConnectionPool()
                ->getConnectionForTable('pages')
                ->fetchOne('SELECT title FROM pages WHERE uid = 1'),
        );
    }

    #[Test]
    public function turnsDownARecordCommandWhileThePermissionsAreShown(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_users.csv');
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/pages.csv');
        $backendUser = $this->setUpBackendUser(1);
        $backendUser->uc = ['vperm' => ['session' => ['active' => 'true']]];

        $dataHandler = GeneralUtility::makeInstance(DataHandler::class);
        $dataHandler->start([], ['pages' => [1 => ['delete' => 1]]]);
        $dataHandler->process_cmdmap();

        self::assertSame(
            0,
            $this->getConnectionPool()
                ->getConnectionForTable('pages')
                ->fetchOne('SELECT deleted FROM pages WHERE uid = 1'),
        );
    }

    #[Test]
    public function saysWhyTheWriteWasTurnedDown(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_users.csv');
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/pages.csv');
        $backendUser = $this->setUpBackendUser(1);
        $backendUser->uc = ['vperm' => ['session' => ['active' => 'true']]];

        $dataHandler = GeneralUtility::makeInstance(DataHandler::class);
        $dataHandler->start(['pages' => [1 => ['title' => 'Changed']]], []);
        $dataHandler->process_datamap();

        self::assertSame(
            'Solange Berechtigungen bearbeitet werden, werden keine Datensätze gespeichert',
            $this->getConnectionPool()
                ->getConnectionForTable('sys_log')
                ->fetchOne('SELECT details FROM sys_log WHERE error = 1'),
        );
    }

    #[Test]
    public function saysWhyTheCommandWasTurnedDown(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_users.csv');
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/pages.csv');
        $backendUser = $this->setUpBackendUser(1);
        $backendUser->uc = ['vperm' => ['session' => ['active' => 'true']]];

        $dataHandler = GeneralUtility::makeInstance(DataHandler::class);
        $dataHandler->start([], ['pages' => [1 => ['delete' => 1]]]);
        $dataHandler->process_cmdmap();

        self::assertSame(
            'Solange Berechtigungen bearbeitet werden, werden keine Datensätze gespeichert',
            $this->getConnectionPool()
                ->getConnectionForTable('sys_log')
                ->fetchOne('SELECT details FROM sys_log WHERE error = 1'),
        );
    }

    #[Test]
    public function saysOnceWhyARecordWriteWasTurnedDown(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_users.csv');
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/pages.csv');
        $backendUser = $this->setUpBackendUser(1);
        $backendUser->uc = ['vperm' => ['session' => ['active' => 'true']]];

        $dataHandler = GeneralUtility::makeInstance(DataHandler::class);
        $dataHandler->start(['pages' => [1 => ['title' => 'Changed']]], []);
        $dataHandler->process_datamap();
        $dataHandler->process_cmdmap();

        self::assertSame(
            1,
            $this->getConnectionPool()
                ->getConnectionForTable('sys_log')
                ->count('*', 'sys_log', ['error' => 1]),
        );
    }

    #[Test]
    public function saysNothingWhenACacheFlushSavesNoRecord(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_users.csv');
        $backendUser = $this->setUpBackendUser(1);
        $backendUser->uc = ['vperm' => ['session' => ['active' => 'true']]];

        $dataHandler = GeneralUtility::makeInstance(DataHandler::class);
        $dataHandler->start([], []);
        $dataHandler->process_datamap();
        $dataHandler->clear_cacheCmd('all');

        self::assertSame(
            0,
            $this->getConnectionPool()
                ->getConnectionForTable('sys_log')
                ->count('*', 'sys_log', ['error' => 1]),
        );
    }

    #[Test]
    public function letsThePermissionWritesThroughWhileThePermissionsAreShown(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_users.csv');
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/group_file_mounts.csv');
        $backendUser = $this->setUpBackendUser(1);
        $backendUser->uc = ['vperm' => ['session' => ['active' => 'true']]];

        $taken = $this->get(Records::class)->update('be_groups', 20, ['tables_modify' => 'pages']);

        self::assertTrue($taken);
        self::assertSame(
            'pages',
            $this->getConnectionPool()
                ->getConnectionForTable('be_groups')
                ->fetchOne('SELECT tables_modify FROM be_groups WHERE uid = 20'),
        );
    }

    #[Test]
    public function letsTheFileMountsForPermissionsBeMadeWhileThePermissionsAreShown(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_users.csv');
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/group_file_mounts.csv');
        $backendUser = $this->setUpBackendUser(1);
        $backendUser->uc = ['vperm' => ['session' => ['active' => 'true']]];

        $made = $this->get(Records::class)->create('sys_filemounts', [
            'pid' => 0,
            'title' => 'Library',
            'identifier' => '1:/library/',
        ]);

        self::assertNotNull($made);
    }
}
