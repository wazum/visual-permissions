<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Functional\MountBranches\Pages;

use PHPUnit\Framework\Attributes\Test;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;
use Wazum\VisualPermissions\MountBranches\Pages\MountOrder;

final class MountOrderTest extends FunctionalTestCase
{
    protected array $coreExtensionsToLoad = ['beuser'];

    protected array $testExtensionsToLoad = ['wazum/visual-permissions'];

    // Page tree sorts by sorting field, not by page number
    #[Test]
    public function putsTheMountsWhereTheTreePutsThem(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/group_mounts.csv');

        self::assertSame([3, 7, 5], $this->get(MountOrder::class)->inTreeOrder([3, 5, 7]));
    }

    #[Test]
    public function putsAPageDeepInAnEarlierBranchAboveAShallowerOneAfterIt(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/deep_mounts.csv');

        self::assertSame([12, 20], $this->get(MountOrder::class)->inTreeOrder([20, 12]));
    }

    #[Test]
    public function leavesAPageTheTreeCannotReachOutOfTheOrder(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/orphan_mounts.csv');

        self::assertSame([10], $this->get(MountOrder::class)->inTreeOrder([30, 10]));
    }

    #[Test]
    public function keepsAPageThatIsGoneOutOfTheOrder(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/group_mounts.csv');

        self::assertSame([5], $this->get(MountOrder::class)->inTreeOrder([404, 5]));
    }
}
