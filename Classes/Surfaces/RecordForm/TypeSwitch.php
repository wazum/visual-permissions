<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Surfaces\RecordForm;

final class TypeSwitch
{
    /**
     * @param array{ctrl?: array{type?: string}, columns?: array<string, array{onChange?: string}>} $processedTca
     */
    public static function is(array $processedTca, string $fieldName): bool
    {
        return $fieldName === strtok($processedTca['ctrl']['type'] ?? '', ':')
            || 'reload' === ($processedTca['columns'][$fieldName]['onChange'] ?? null);
    }
}
