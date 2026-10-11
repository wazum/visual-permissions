<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Authorization;

final readonly class Verdicts
{
    /**
     * @template Target of array-key
     *
     * @param list<int>                 $chain     group ids, nearest first
     * @param array<int, list<Target>>  $held      group id to the targets it holds
     * @param array<Target, TargetKind> $catalogue
     *
     * @return array<Target, AccessVerdict>
     */
    public function resolve(array $chain, array $held, array $catalogue = []): array
    {
        $verdicts = array_map(static fn(TargetKind $kind): AccessVerdict => match ($kind) {
            TargetKind::AdminOnly => AccessVerdict::AdminOnly,
            TargetKind::NotApplicable => AccessVerdict::NotApplicable,
            TargetKind::NeverEditable => AccessVerdict::NeverEditable,
            TargetKind::Allowable => AccessVerdict::Denied,
        }, $catalogue);

        foreach ($chain as $depth => $groupId) {
            foreach ($held[$groupId] ?? [] as $target) {
                if (AccessVerdict::Allowed === ($verdicts[$target] ?? null)) {
                    $verdicts[$target] = 0 === $depth ? AccessVerdict::Allowed : AccessVerdict::AllowedAndInherited;

                    continue;
                }

                if (AccessVerdict::Denied !== ($verdicts[$target] ?? AccessVerdict::Denied)) {
                    continue;
                }

                $verdicts[$target] = 0 === $depth ? AccessVerdict::Allowed : AccessVerdict::Inherited;
            }
        }

        return $verdicts;
    }

    /**
     * @template Target of array-key
     *
     * @param list<int>                $chain group ids, nearest first
     * @param array<int, list<Target>> $held  group id to the targets it holds
     *
     * @return array<Target, list<int>>
     */
    public function allowedBy(array $chain, array $held): array
    {
        $allowedBy = [];
        foreach (array_slice($chain, 1) as $groupId) {
            foreach ($held[$groupId] ?? [] as $target) {
                $allowedBy[$target][] = $groupId;
            }
        }

        return $allowedBy;
    }
}
