<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Surfaces\RecordForm;

final readonly class FormFields
{
    /**
     * @param list<string> $types
     *
     * @return list<string>
     */
    public function shownOnlyByTypesOtherThan(string $table, array $types): array
    {
        /**
         * @var array<string, array{
         *     columns?: array<string, mixed>,
         *     types?: array<string|int, array{showitem?: string}>,
         *     palettes?: array<string, array{showitem?: string, isHiddenPalette?: bool}>
         * }> $tableConfigurations
         */
        $tableConfigurations = $GLOBALS['TCA'];
        $configuration = $tableConfigurations[$table] ?? [];
        $palettes = $configuration['palettes'] ?? [];

        $shown = [];
        $held = [];
        foreach ($configuration['types'] ?? [] as $typeValue => $type) {
            $fields = $this->fieldsIn($type['showitem'] ?? '', $palettes);
            $shown = [...$shown, ...$fields];
            if (\in_array((string) $typeValue, $types, true)) {
                $held = [...$held, ...$fields];
            }
        }

        return array_values(array_unique(array_filter(
            array_diff($shown, $held),
            static fn(string $field): bool => isset($configuration['columns'][$field]),
        )));
    }

    /**
     * @param array<string, array{showitem?: string, isHiddenPalette?: bool}> $palettes
     *
     * @return list<string>
     */
    private function fieldsIn(string $showItem, array $palettes): array
    {
        $fields = [];
        foreach (explode(',', $showItem) as $item) {
            $parts = array_map(trim(...), explode(';', $item));
            $palette = $palettes[$parts[2] ?? ''] ?? [];
            $fields = [...$fields, ...match ($parts[0]) {
                '--palette--' => ($palette['isHiddenPalette'] ?? false) ? [] : $this->fieldsIn($palette['showitem'] ?? '', $palettes),
                default => [$parts[0]],
            }];
        }

        return $fields;
    }
}
