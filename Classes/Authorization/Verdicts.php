<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Authorization;

final readonly class Verdicts
{
    /**
     * @template Target of array-key
     *
     * @param list<int>                 $chain     group ids, nearest first
     * @param array<int, list<Target>>  $grants    group id to the targets it grants
     * @param array<Target, TargetKind> $catalogue
     *
     * @return array<Target, AccessVerdict>
     */
    public function resolve(array $chain, array $grants, array $catalogue = []): array
    {
        $verdicts = array_map(static fn(TargetKind $kind): AccessVerdict => match ($kind) {
            TargetKind::AdminOnly => AccessVerdict::AdminOnly,
            TargetKind::NotApplicable => AccessVerdict::NotApplicable,
            TargetKind::NeverEditable => AccessVerdict::NeverEditable,
            TargetKind::Grantable => AccessVerdict::Denied,
        }, $catalogue);

        foreach ($chain as $depth => $groupId) {
            foreach ($grants[$groupId] ?? [] as $target) {
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
     * @param list<int>                $chain  group ids, nearest first
     * @param array<int, list<Target>> $grants group id to the targets it grants
     *
     * @return array<Target, list<int>>
     */
    public function givenBy(array $chain, array $grants): array
    {
        $givenBy = [];
        foreach (array_slice($chain, 1) as $groupId) {
            foreach ($grants[$groupId] ?? [] as $target) {
                $givenBy[$target][] = $groupId;
            }
        }

        return $givenBy;
    }
}
