<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Functional\MountBranches\Pages;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use TYPO3\CMS\Core\Http\ServerRequest;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;
use Wazum\VisualPermissions\Authorization\Scope;
use Wazum\VisualPermissions\BackendGroups\BackendGroups;
use Wazum\VisualPermissions\MountBranches\Pages\MountPagesController;

final class MountPagesControllerTest extends FunctionalTestCase
{
    protected array $coreExtensionsToLoad = ['beuser'];

    protected array $testExtensionsToLoad = ['wazum/visual-permissions'];

    #[Test]
    public function appliesWhatWasCollected(): void
    {
        $this->arrange();

        $response = $this->get(MountPagesController::class)->write($this->asked([
            'group' => 20,
            'operations' => [
                ['page' => 7, 'mount' => true],
                ['page' => 3, 'mount' => false],
            ],
        ]));

        self::assertSame(204, $response->getStatusCode());
        self::assertSame(['5', '7'], $this->get(BackendGroups::class)->listOf(20, Scope::PageMounts));
    }

    /**
     * @return array<string, array{string}>
     */
    public static function pagesThatAreNoPage(): array
    {
        return [
            'words after the number' => ['7 and the rest'],
            'a fraction' => ['7.5'],
            'the root, which no page record is' => ['0'],
            'below the root' => ['-1'],
        ];
    }

    #[Test]
    #[DataProvider('pagesThatAreNoPage')]
    public function refusesAnOperationWhosePageIsNoPage(string $page): void
    {
        $this->arrange();

        $response = $this->get(MountPagesController::class)->write($this->asked([
            'group' => 20,
            'operations' => [['page' => $page, 'mount' => true]],
        ]));

        self::assertSame(400, $response->getStatusCode());
        self::assertSame(
            '3,5',
            $this->getConnectionPool()
                ->getConnectionForTable('be_groups')
                ->fetchOne('SELECT db_mountpoints FROM be_groups WHERE uid = 20'),
        );
    }

    private function arrange(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/group_mounts.csv');
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/be_users.csv');
        $this->setUpBackendUser(1);
    }

    /**
     * @param array<string, mixed> $body
     */
    private function asked(array $body): ServerRequest
    {
        return (new ServerRequest('https://example.com/typo3/ajax/visual-permissions/mount-pages', 'POST'))
            ->withParsedBody($body);
    }
}
