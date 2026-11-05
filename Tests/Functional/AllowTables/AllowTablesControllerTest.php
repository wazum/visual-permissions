<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Functional\AllowTables;

use PHPUnit\Framework\Attributes\Test;
use TYPO3\CMS\Core\Http\ServerRequest;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;
use Wazum\VisualPermissions\AllowTables\AllowTablesController;
use Wazum\VisualPermissions\Authorization\Scope;
use Wazum\VisualPermissions\BackendGroups\BackendGroups;

final class AllowTablesControllerTest extends FunctionalTestCase
{
    protected array $coreExtensionsToLoad = ['beuser'];

    protected array $testExtensionsToLoad = ['wazum/visual-permissions'];

    protected function setUp(): void
    {
        parent::setUp();
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/group_tables.csv');
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_users.csv');
        $this->setUpBackendUser(1);
    }

    #[Test]
    public function appliesWhatWasCollected(): void
    {
        $response = $this->get(AllowTablesController::class)->write($this->asked([
            'group' => 20,
            'operations' => [
                ['table' => 'sys_file_reference', 'allow' => true],
                ['table' => 'pages', 'allow' => false],
            ],
        ]));

        self::assertSame(204, $response->getStatusCode());
        self::assertSame(['tt_content', 'sys_file_reference'], $this->get(BackendGroups::class)->listOf(20, Scope::TablesModify));
    }

    #[Test]
    public function refusesToGrantWhatCannotBeGranted(): void
    {
        $response = $this->get(AllowTablesController::class)->write($this->asked([
            'group' => 20,
            'operations' => [['table' => 'no_such_table', 'allow' => true]],
        ]));

        self::assertSame(400, $response->getStatusCode());
        self::assertSame('tt_content,pages', $this->tablesOfTwenty());
    }

    #[Test]
    public function takesAwayWhatCanNoLongerBeGranted(): void
    {
        $response = $this->get(AllowTablesController::class)->write($this->asked([
            'group' => 20,
            'operations' => [['table' => 'no_such_table', 'allow' => false]],
        ]));

        self::assertSame(204, $response->getStatusCode());
    }

    private function tablesOfTwenty(): string
    {
        $tables = $this->getConnectionPool()
            ->getConnectionForTable('be_groups')
            ->fetchOne('SELECT tables_modify FROM be_groups WHERE uid = 20');

        return is_string($tables) ? $tables : '';
    }

    /**
     * @param array<string, mixed> $body
     */
    private function asked(array $body): ServerRequest
    {
        return (new ServerRequest('https://example.com/typo3/ajax/visual-permissions/allow-tables', 'POST'))
            ->withParsedBody($body);
    }
}
