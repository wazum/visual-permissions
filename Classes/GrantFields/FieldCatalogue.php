<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\GrantFields;

use Wazum\VisualPermissions\Authorization\TargetKind;

final readonly class FieldCatalogue
{
    /**
     * @return array<string, TargetKind>
     */
    public function of(string $table): array
    {
        /**
         * @var array<string, array{columns?: array<string, array{
         *     exclude?: bool|int,
         *     displayCond?: mixed,
         *     config?: array{readOnly?: bool|int}
         * }>}> $tableConfigurations
         */
        $tableConfigurations = $GLOBALS['TCA'];
        $columns = $tableConfigurations[$table]['columns'] ?? [];

        $targets = [];
        foreach ($columns as $fieldName => $configuration) {
            $targets[$table . ':' . $fieldName] = $this->kindOf($configuration);
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
            ? TargetKind::Grantable
            : TargetKind::NotApplicable;
    }
}
