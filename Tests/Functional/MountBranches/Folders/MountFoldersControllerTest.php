<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Functional\MountBranches\Folders;

use PHPUnit\Framework\Attributes\Test;
use TYPO3\CMS\Core\Http\ServerRequest;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;
use Wazum\VisualPermissions\BackendGroups\BackendGroups;
use Wazum\VisualPermissions\MountBranches\Folders\MountFoldersController;

final class MountFoldersControllerTest extends FunctionalTestCase
{
    protected array $coreExtensionsToLoad = ['beuser'];

    protected array $testExtensionsToLoad = ['wazum/visual-permissions'];

    #[Test]
    public function appliesWhatWasCollected(): void
    {
        $this->arrange();

        $response = $this->get(MountFoldersController::class)->write($this->asked([
            'group' => 20,
            'operations' => [
                ['folder' => '1:/archive/', 'mount' => true],
                ['folder' => '1:/campaign/', 'mount' => false],
            ],
        ]));

        self::assertSame(204, $response->getStatusCode());
        self::assertSame(['1:/press/', '1:/archive/'], $this->get(BackendGroups::class)->mountedFolders(20));
    }

    #[Test]
    public function refusesAnOperationWhoseFolderIsNoFolder(): void
    {
        $this->arrange();

        $response = $this->get(MountFoldersController::class)->write($this->asked([
            'group' => 20,
            'operations' => [['folder' => '/etc/', 'mount' => true]],
        ]));

        self::assertSame(400, $response->getStatusCode());
        self::assertSame('1,2', $this->mountsOf(20));
    }

    #[Test]
    public function refusesToMountAWholeStorage(): void
    {
        $this->arrange();

        $response = $this->get(MountFoldersController::class)->write($this->asked([
            'group' => 20,
            'operations' => [['folder' => '1:/', 'mount' => true]],
        ]));

        self::assertSame(400, $response->getStatusCode());
        self::assertSame('1,2', $this->mountsOf(20));
    }

    #[Test]
    public function takesAMountedWholeStorageAwayAllTheSame(): void
    {
        $this->arrange();
        $this->getConnectionPool()->getConnectionForTable('sys_filemounts')
            ->update('sys_filemounts', ['identifier' => '1:/'], ['uid' => 1]);

        $response = $this->get(MountFoldersController::class)->write($this->asked([
            'group' => 20,
            'operations' => [['folder' => '1:/', 'mount' => false]],
        ]));

        self::assertSame(204, $response->getStatusCode());
        self::assertSame('2', $this->mountsOf(20));
    }

    #[Test]
    public function takesAwayAFolderNoFileMountNamesWithoutATitle(): void
    {
        $this->arrange();

        $response = $this->get(MountFoldersController::class)->write($this->asked([
            'group' => 20,
            'operations' => [['folder' => '1:/library/', 'mount' => false]],
        ]));

        self::assertSame(204, $response->getStatusCode());
        self::assertSame('1,2', $this->mountsOf(20));
    }

    #[Test]
    public function carriesTheTitleForAFolderThatNeedsANewFileMount(): void
    {
        $this->arrange();

        $this->get(MountFoldersController::class)->write($this->asked([
            'group' => 20,
            'operations' => [['folder' => '1:/library/', 'mount' => true, 'title' => 'Shared library']],
        ]));

        self::assertSame('Shared library', $this->getConnectionPool()
            ->getConnectionForTable('sys_filemounts')
            ->fetchOne('SELECT title FROM sys_filemounts WHERE identifier = ?', ['1:/library/']));
    }

    private function mountsOf(int $groupId): string
    {
        $mounts = $this->getConnectionPool()
            ->getConnectionForTable('be_groups')
            ->fetchOne('SELECT file_mountpoints FROM be_groups WHERE uid = ?', [$groupId]);

        return is_string($mounts) ? $mounts : '';
    }

    private function arrange(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/group_file_mounts.csv');
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/be_users.csv');
        $this->setUpBackendUser(1);
    }

    /**
     * @param array<string, mixed> $body
     */
    private function asked(array $body): ServerRequest
    {
        return (new ServerRequest('https://example.com/typo3/ajax/visual-permissions/mount-folders', 'POST'))
            ->withParsedBody($body);
    }
}
