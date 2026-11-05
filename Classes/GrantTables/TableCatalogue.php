<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\GrantTables;

use Wazum\VisualPermissions\Authorization\TargetKind;

final readonly class TableCatalogue
{
    /**
     * @return array<string, TargetKind>
     */
    public function all(): array
    {
        /** @var array<string, array{ctrl?: array{adminOnly?: bool|int}}> $tableConfigurations */
        $tableConfigurations = $GLOBALS['TCA'];

        return array_map(
            static fn(array $table): TargetKind => ($table['ctrl']['adminOnly'] ?? false)
                ? TargetKind::AdminOnly
                : TargetKind::Grantable,
            $tableConfigurations,
        );
    }

    /**
     * @param list<string> $tables
     *
     * @return array<string, string>
     */
    public function titles(array $tables): array
    {
        /** @var array<string, array{ctrl?: array{title?: string}}> $tableConfigurations */
        $tableConfigurations = $GLOBALS['TCA'];

        $titles = [];
        foreach ($tables as $table) {
            $titles[$table] = $tableConfigurations[$table]['ctrl']['title'] ?? '';
        }

        return $titles;
    }
}
