<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Functional\MountBranches\Pages;

use PHPUnit\Framework\Attributes\Test;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;
use Wazum\VisualPermissions\MountBranches\Pages\PageVisibility;

final class PageVisibilityTest extends FunctionalTestCase
{
    protected array $coreExtensionsToLoad = ['beuser'];

    protected array $testExtensionsToLoad = ['wazum/visual-permissions'];

    #[Test]
    public function findsAPageNeitherItsGroupNorEverybodyMaySee(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/unseen_mounts.csv');

        self::assertSame([7], array_column($this->get(PageVisibility::class)->unseen([20, 21], [7]), 'page'));
    }

    #[Test]
    public function leavesOutAPageEverybodyMaySee(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/unseen_mounts.csv');

        self::assertSame([], array_column($this->get(PageVisibility::class)->unseen([20, 21], [3]), 'page'));
    }

    #[Test]
    public function leavesOutAPageAGroupInTheChainMaySee(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/unseen_mounts.csv');

        self::assertSame([], array_column($this->get(PageVisibility::class)->unseen([20, 21], [5]), 'page'));
    }

    #[Test]
    public function findsAPageOnlyAGroupOutsideTheChainMaySee(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/unseen_mounts.csv');

        self::assertSame([5], array_column($this->get(PageVisibility::class)->unseen([20], [5]), 'page'));
    }

    #[Test]
    public function readsWhatEachPageShowsFromItsPermissions(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/unseen_mounts.csv');

        self::assertSame([9], array_column($this->get(PageVisibility::class)->unseen([20, 21], [9, 11]), 'page'));
    }
}
