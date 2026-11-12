<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\AllowFields;

use Wazum\VisualPermissions\Authorization\TargetKind;

final readonly class FieldCatalogue
{
    /**
     * @return array<string, TargetKind>
     */
    public function of(string $table): array
    {
        /**
         * @var array<string, array{
         *     ctrl?: array{
         *         adminOnly?: bool|int,
         *         rootLevel?: int,
         *         security?: array{ignoreRootLevelRestriction?: bool|int}
         *     },
         *     columns?: array<string, array{
         *         exclude?: bool|int,
         *         displayCond?: mixed,
         *         config?: array{readOnly?: bool|int}
         *     }>
         * }> $tableConfigurations
         */
        $tableConfigurations = $GLOBALS['TCA'];
        $columns = $tableConfigurations[$table]['columns'] ?? [];
        $control = $tableConfigurations[$table]['ctrl'] ?? [];
        $forAdministrators = ($control['adminOnly'] ?? false)
            || (1 === ($control['rootLevel'] ?? null) && !($control['security']['ignoreRootLevelRestriction'] ?? false));

        $targets = [];
        foreach ($columns as $fieldName => $configuration) {
            $kind = $this->kindOf($configuration);
            $targets[$table . ':' . $fieldName] = $forAdministrators && TargetKind::Allowable === $kind
                ? TargetKind::AdminOnly
                : $kind;
        }

        return $targets;
    }

    /**
     * @param array{
     *     exclude?: bool|int,
     *     displayCond?: mixed,
     *     config?: array{readOnly?: bool|int}
     * } $configuration
     */
    private function kindOf(array $configuration): TargetKind
    {
        if ($configuration['config']['readOnly'] ?? false) {
            return TargetKind::NeverEditable;
        }

        if ('HIDE_FOR_NON_ADMINS' === ($configuration['displayCond'] ?? null)) {
            return TargetKind::AdminOnly;
        }

        return ($configuration['exclude'] ?? false)
            ? TargetKind::Allowable
            : TargetKind::NotApplicable;
    }
}
