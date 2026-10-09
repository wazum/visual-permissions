<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Functional\Write;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use Psr\Http\Message\ResponseInterface;
use TYPO3\CMS\Core\Http\ServerRequest;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;
use Wazum\VisualPermissions\AllowValues\AllowFileOperationsController;
use Wazum\VisualPermissions\AllowValues\AllowPageTypesController;
use Wazum\VisualPermissions\AllowValues\AllowValuesController;
use Wazum\VisualPermissions\GrantFields\GrantFieldsController;
use Wazum\VisualPermissions\GrantModules\GrantModulesController;
use Wazum\VisualPermissions\GrantTables\GrantTablesController;
use Wazum\VisualPermissions\MountBranches\Folders\MountFoldersController;
use Wazum\VisualPermissions\MountBranches\Pages\MountPagesController;
use Wazum\VisualPermissions\Tests\Functional\Fixtures\VetoTheWrite;
use Wazum\VisualPermissions\Write\GroupWriteController;

final class GroupWriteControllerTest extends FunctionalTestCase
{
    protected array $coreExtensionsToLoad = ['beuser'];

    protected array $testExtensionsToLoad = ['wazum/visual-permissions'];

    /**
     * @return array<string, array{
     *     class-string,
     *     string,
     *     int,
     *     string,
     *     array<string, mixed>,
     *     string
     * }>
     */
    public static function controllers(): array
    {
        return [
            'fields' => [GrantFieldsController::class, 'group_fields', 10, 'non_exclude_fields', ['field' => 'tt_content:subheader', 'grant' => true], 'grant'],
            'modules' => [GrantModulesController::class, 'group_chain', 10, 'groupMods', ['module' => 'about', 'grant' => true], 'grant'],
            'tables' => [GrantTablesController::class, 'group_tables', 20, 'tables_modify', ['table' => 'sys_file_reference', 'grant' => true], 'grant'],
            'page mounts' => [MountPagesController::class, 'group_mounts', 20, 'db_mountpoints', ['page' => 7, 'mount' => true], 'mount'],
            'file mounts' => [MountFoldersController::class, 'group_file_mounts', 20, 'file_mountpoints', ['folder' => '1:/archive/', 'mount' => true], 'mount'],
            'field values' => [AllowValuesController::class, 'group_values', 10, 'explicit_allowdeny', ['value' => 'tt_content:CType:header', 'grant' => true], 'grant'],
            'page types' => [AllowPageTypesController::class, 'group_values', 10, 'pagetypes_select', ['value' => '254', 'grant' => true], 'grant'],
            'file operations' => [AllowFileOperationsController::class, 'group_values', 10, 'file_permissions', ['value' => 'deleteFile', 'grant' => true], 'grant'],
        ];
    }

    /**
     * @param class-string         $controller
     * @param array<string, mixed> $operation
     */
    #[Test]
    #[DataProvider('controllers')]
    public function refusesAGroupThatIsNotThere(string $controller, string $fixture, int $groupId, string $column, array $operation, string $direction): void
    {
        $this->arrange($fixture);

        $response = $this->write($controller, ['group' => 99, 'operations' => [$operation]]);

        self::assertSame(404, $response->getStatusCode());
    }

    /**
     * @param class-string         $controller
     * @param array<string, mixed> $operation
     */
    #[Test]
    #[DataProvider('controllers')]
    public function refusesAGroupNamedWithAFraction(string $controller, string $fixture, int $groupId, string $column, array $operation, string $direction): void
    {
        $this->arrange($fixture);
        $before = $this->columnOf($column, $groupId);

        $response = $this->write($controller, ['group' => $groupId . '.9', 'operations' => [$operation]]);

        self::assertSame(404, $response->getStatusCode());
        self::assertSame($before, $this->columnOf($column, $groupId));
    }

    /**
     * @param class-string         $controller
     * @param array<string, mixed> $operation
     */
    #[Test]
    #[DataProvider('controllers')]
    public function refusesARequestThatSentNoList(string $controller, string $fixture, int $groupId, string $column, array $operation, string $direction): void
    {
        $this->arrange($fixture);
        $before = $this->columnOf($column, $groupId);

        $response = $this->write($controller, ['group' => $groupId]);

        self::assertSame(400, $response->getStatusCode());
        self::assertSame($before, $this->columnOf($column, $groupId));
    }

    /**
     * @param class-string         $controller
     * @param array<string, mixed> $operation
     */
    #[Test]
    #[DataProvider('controllers')]
    public function refusesTheWholeRequestWhenOneOperationIsNoOperation(string $controller, string $fixture, int $groupId, string $column, array $operation, string $direction): void
    {
        $this->arrange($fixture);
        $before = $this->columnOf($column, $groupId);

        $response = $this->write($controller, ['group' => $groupId, 'operations' => [$operation, ['nonsense' => 1]]]);

        self::assertSame(400, $response->getStatusCode());
        self::assertSame($before, $this->columnOf($column, $groupId));
    }

    /**
     * @param class-string         $controller
     * @param array<string, mixed> $operation
     */
    #[Test]
    #[DataProvider('controllers')]
    public function refusesAnOperationThatSaysNothingAboutTheDirection(string $controller, string $fixture, int $groupId, string $column, array $operation, string $direction): void
    {
        $this->arrange($fixture);
        $before = $this->columnOf($column, $groupId);
        unset($operation[$direction]);

        $response = $this->write($controller, ['group' => $groupId, 'operations' => [$operation]]);

        self::assertSame(400, $response->getStatusCode());
        self::assertSame($before, $this->columnOf($column, $groupId));
    }

    /**
     * @param class-string         $controller
     * @param array<string, mixed> $operation
     */
    #[Test]
    #[DataProvider('controllers')]
    public function refusesAnOperationWhoseDirectionItCannotRead(string $controller, string $fixture, int $groupId, string $column, array $operation, string $direction): void
    {
        $this->arrange($fixture);
        $before = $this->columnOf($column, $groupId);

        $response = $this->write($controller, ['group' => $groupId, 'operations' => [[$direction => 'perhaps'] + $operation]]);

        self::assertSame(400, $response->getStatusCode());
        self::assertSame($before, $this->columnOf($column, $groupId));
    }

    /**
     * @param class-string         $controller
     * @param array<string, mixed> $operation
     */
    #[Test]
    #[DataProvider('controllers')]
    public function readsAFlagThatArrivedAsText(string $controller, string $fixture, int $groupId, string $column, array $operation, string $direction): void
    {
        $this->arrange($fixture);
        $before = $this->columnOf($column, $groupId);

        $response = $this->write($controller, ['group' => $groupId, 'operations' => [[$direction => 'true'] + $operation]]);

        self::assertSame(204, $response->getStatusCode());
        self::assertNotSame($before, $this->columnOf($column, $groupId));
    }

    /**
     * @param class-string         $controller
     * @param array<string, mixed> $operation
     */
    #[Test]
    #[DataProvider('controllers')]
    public function saysSoWhenTheBackendRefusedTheWrite(string $controller, string $fixture, int $groupId, string $column, array $operation, string $direction): void
    {
        $this->arrange($fixture);
        $before = $this->columnOf($column, $groupId);
        VetoTheWrite::register();

        $response = $this->write($controller, ['group' => $groupId, 'operations' => [$operation]]);

        self::assertSame(409, $response->getStatusCode());
        self::assertSame($before, $this->columnOf($column, $groupId));
    }

    private function arrange(string $fixture): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/' . $fixture . '.csv');
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_users.csv');
        $this->setUpBackendUser(1);
    }

    /**
     * @param class-string         $controller
     * @param array<string, mixed> $body
     */
    private function write(string $controller, array $body): ResponseInterface
    {
        $writer = $this->get($controller);
        self::assertInstanceOf(GroupWriteController::class, $writer);

        return $writer->write(
            (new ServerRequest('https://example.com/typo3/ajax/visual-permissions', 'POST'))->withParsedBody($body),
        );
    }

    private function columnOf(string $column, int $groupId): mixed
    {
        return $this->getConnectionPool()
            ->getConnectionForTable('be_groups')
            ->fetchOne('SELECT ' . $column . ' FROM be_groups WHERE uid = ?', [$groupId]);
    }
}
