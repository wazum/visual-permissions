<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Unit\BackendGroups;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Wazum\VisualPermissions\BackendGroups\InheritanceChain;

final class InheritanceChainTest extends TestCase
{
    #[Test]
    public function reportsEachGroupWithItsTitleAndDistanceDepthFirst(): void
    {
        $chain = InheritanceChain::startingAt(10, [
            10 => ['title' => 'Editors', 'subgroups' => [11, 12]],
            11 => ['title' => 'Base Editors', 'subgroups' => [13]],
            12 => ['title' => 'Reviewers', 'subgroups' => [13]],
            13 => ['title' => 'Everyone', 'subgroups' => []],
        ]);

        self::assertSame([
            ['groupId' => 10, 'title' => 'Editors', 'depth' => 0],
            ['groupId' => 11, 'title' => 'Base Editors', 'depth' => 1],
            ['groupId' => 13, 'title' => 'Everyone', 'depth' => 2],
            ['groupId' => 12, 'title' => 'Reviewers', 'depth' => 1],
        ], $chain->steps);
    }

    #[Test]
    public function endsWhenTwoGroupsIncludeEachOther(): void
    {
        $chain = InheritanceChain::startingAt(20, [
            20 => ['title' => 'First', 'subgroups' => [21]],
            21 => ['title' => 'Second', 'subgroups' => [20]],
        ]);

        self::assertSame([
            ['groupId' => 20, 'title' => 'First', 'depth' => 0],
            ['groupId' => 21, 'title' => 'Second', 'depth' => 1],
        ], $chain->steps);
    }

    #[Test]
    public function leavesOutADisabledSubgroupAndWhatOnlyItLeadsTo(): void
    {
        $chain = InheritanceChain::startingAt(40, [
            40 => ['title' => 'Editors', 'subgroups' => [41, 43], 'disabled' => true],
            41 => ['title' => 'Retired', 'subgroups' => [42], 'disabled' => true],
            42 => ['title' => 'Archive', 'subgroups' => [], 'disabled' => false],
            43 => ['title' => 'Everyone', 'subgroups' => [], 'disabled' => false],
        ]);

        self::assertSame([
            ['groupId' => 40, 'title' => 'Editors', 'depth' => 0],
            ['groupId' => 43, 'title' => 'Everyone', 'depth' => 1],
        ], $chain->steps);
    }

    #[Test]
    public function skipsASubgroupThatIsNotThere(): void
    {
        $chain = InheritanceChain::startingAt(30, [
            30 => ['title' => 'Editors', 'subgroups' => [31, 32]],
            32 => ['title' => 'Everyone', 'subgroups' => []],
        ]);

        self::assertSame([
            ['groupId' => 30, 'title' => 'Editors', 'depth' => 0],
            ['groupId' => 32, 'title' => 'Everyone', 'depth' => 1],
        ], $chain->steps);
    }
}
