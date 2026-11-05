<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Functional\BackendGroups;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;
use Wazum\VisualPermissions\BackendGroups\BackendGroups;
use Wazum\VisualPermissions\BackendGroups\InheritanceChain;

final class InheritanceChainTest extends FunctionalTestCase
{
    protected array $coreExtensionsToLoad = ['beuser'];

    protected array $testExtensionsToLoad = ['wazum/visual-permissions'];

    #[Test]
    public function holdsEveryGroupCoreResolvesForAMemberOfTheGroup(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/group_chain.csv');
        $backendUser = $this->setUpBackendUser(3);

        $chain = InheritanceChain::startingAt(10, $this->get(BackendGroups::class)->all());

        $ours = array_column($chain->steps, 'groupId');
        /** @var list<int> $theirs */
        $theirs = $backendUser->userGroupsUID;
        sort($ours);
        sort($theirs);

        self::assertSame($theirs, $ours);
    }

    /**
     * @return array<string, array{list<int>}>
     */
    public static function disabledSubgroups(): array
    {
        return [
            'one of two ways to a shared subgroup' => [[11]],
            'both ways to a shared subgroup' => [[11, 12]],
        ];
    }

    /**
     * @param list<int> $disabled
     */
    #[Test]
    #[DataProvider('disabledSubgroups')]
    public function leavesOutWhatCoreLeavesOutBehindADisabledSubgroup(array $disabled): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/group_chain.csv');
        foreach ($disabled as $groupId) {
            $this->getConnectionPool()->getConnectionForTable('be_groups')
                ->update('be_groups', ['hidden' => 1], ['uid' => $groupId]);
        }
        $backendUser = $this->setUpBackendUser(3);

        $chain = InheritanceChain::startingAt(10, $this->get(BackendGroups::class)->all());

        $ours = array_column($chain->steps, 'groupId');
        /** @var list<int> $theirs */
        $theirs = $backendUser->userGroupsUID;
        sort($ours);
        sort($theirs);

        self::assertSame($theirs, $ours);
    }
}
