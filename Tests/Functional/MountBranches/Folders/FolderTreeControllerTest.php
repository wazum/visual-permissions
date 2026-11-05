<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Functional\MountBranches\Folders;

use PHPUnit\Framework\Attributes\Test;
use TYPO3\CMS\Core\Http\ServerRequest;
use TYPO3\CMS\Core\Localization\LanguageServiceFactory;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;
use Wazum\VisualPermissions\MountBranches\Folders\FolderTreeController;

final class FolderTreeControllerTest extends FunctionalTestCase
{
    protected array $coreExtensionsToLoad = ['beuser'];

    protected array $testExtensionsToLoad = ['wazum/visual-permissions'];

    #[Test]
    public function standsEveryFolderAboveAMountInTheTree(): void
    {
        $this->arrange();

        $response = $this->get(FolderTreeController::class)->tree($this->asked(['group' => 20]));

        self::assertSame(
            ['1:/', '1:/campaign/', '1:/press/'],
            $this->foldersIn($response->getBody()->__toString()),
        );
    }

    #[Test]
    public function standsEachFolderAtTheDepthOfItsPlace(): void
    {
        $this->arrange();

        $response = $this->get(FolderTreeController::class)->tree($this->asked(['group' => 20]));

        /** @var list<array{depth: int}> $items */
        $items = json_decode($response->getBody()->__toString(), true);

        self::assertSame([0, 1, 1], array_column($items, 'depth'));
    }

    #[Test]
    public function handsOverEveryFolderAboveAMountAsLoaded(): void
    {
        $this->arrange();

        $response = $this->get(FolderTreeController::class)->tree($this->asked(['group' => 20]));

        /** @var list<array{loaded: bool}> $items */
        $items = json_decode($response->getBody()->__toString(), true);

        self::assertSame([true, false, false], array_column($items, 'loaded'));
    }

    #[Test]
    public function namesWhatIsInsideAFolderTheReaderOpened(): void
    {
        $this->arrange();
        GeneralUtility::mkdir_deep($this->instancePath . '/fileadmin/campaign/spring/');

        $response = $this->get(FolderTreeController::class)
            ->tree($this->asked(['parent' => rawurlencode('1:/campaign/'), 'depth' => 1]));

        self::assertSame(['1:/campaign/spring/'], $this->foldersIn($response->getBody()->__toString()));
    }

    #[Test]
    public function namesAMountedStorageRootAfterItsStorage(): void
    {
        $this->arrange();
        $this->getConnectionPool()->getConnectionForTable('sys_filemounts')
            ->update('sys_filemounts', ['identifier' => '1:/'], ['uid' => 1]);

        $response = $this->get(FolderTreeController::class)->tree($this->asked(['group' => 20]));

        /** @var list<array{name: string}> $items */
        $items = json_decode($response->getBody()->__toString(), true);

        self::assertSame('fileadmin', $items[0]['name']);
    }

    #[Test]
    public function reportsNothingForAGroupThatIsNotThere(): void
    {
        $this->arrange();

        $response = $this->get(FolderTreeController::class)->tree($this->asked(['group' => 999]));

        self::assertSame(404, $response->getStatusCode());
    }

    private function arrange(): void
    {
        GeneralUtility::mkdir_deep($this->instancePath . '/fileadmin/campaign/');
        GeneralUtility::mkdir_deep($this->instancePath . '/fileadmin/press/');
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/file_storage.csv');
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/group_file_mounts.csv');
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/be_users.csv');
        $GLOBALS['LANG'] = $this->get(LanguageServiceFactory::class)
            ->createFromUserPreferences($this->setUpBackendUser(1));
    }

    /**
     * @return list<string>
     */
    private function foldersIn(string $body): array
    {
        /** @var list<array{identifier: string}> $items */
        $items = json_decode($body, true);

        return array_map(static fn(array $item): string => rawurldecode($item['identifier']), $items);
    }

    /**
     * @param array<string, mixed> $query
     */
    private function asked(array $query): ServerRequest
    {
        return (new ServerRequest('https://example.com/typo3/ajax/visual-permissions/folder-tree'))
            ->withQueryParams($query);
    }
}
