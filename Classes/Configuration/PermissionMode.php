<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Configuration;

final class PermissionMode
{
    /**
     * @param array<array-key, mixed> $settings
     */
    public static function isOn(array $settings): bool
    {
        /** @var array{vperm?: array{session?: array{active?: mixed}}} $kept */
        $kept = $settings;

        return 'true' === ($kept['vperm']['session']['active'] ?? null);
    }
}
