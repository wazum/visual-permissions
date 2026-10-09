<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\BackendGroups;

/**
 * @phpstan-type ChainStep array{groupId: int, title: string, depth: int}
 */
final readonly class InheritanceChain
{
    /**
     * @param list<ChainStep> $steps nearest first, deduplicated
     */
    public function __construct(public array $steps)
    {
    }

    /**
     * @param array<int, array{title: string, subgroups: list<int>, disabled?: bool}> $groups
     */
    public static function startingAt(int $groupId, array $groups): self
    {
        $steps = [];
        self::walk($groupId, 0, $groups, $steps);

        return new self(array_values($steps));
    }

    /**
     * @param array<int, array{title: string, subgroups: list<int>, disabled?: bool}> $groups
     * @param array<int, ChainStep>                                                   $steps
     */
    private static function walk(int $groupId, int $depth, array $groups, array &$steps): void
    {
        if (!isset($groups[$groupId]) || isset($steps[$groupId])) {
            return;
        }

        // Core ignores a disabled subgroup and every group below it
        if ($depth > 0 && ($groups[$groupId]['disabled'] ?? false)) {
            return;
        }

        $steps[$groupId] = ['groupId' => $groupId, 'title' => $groups[$groupId]['title'], 'depth' => $depth];

        foreach ($groups[$groupId]['subgroups'] as $subgroupId) {
            self::walk($subgroupId, $depth + 1, $groups, $steps);
        }
    }
}
