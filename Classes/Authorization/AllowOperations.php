<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Authorization;

final readonly class AllowOperations
{
    /**
     * @param \Closure(string): bool $allowable
     *
     * @return list<array{target: string, add: bool}>|null
     */
    public static function from(mixed $operations, string $targetKey, \Closure $allowable): ?array
    {
        if (!is_array($operations)) {
            return null;
        }

        $read = [];
        foreach ($operations as $sent) {
            $operation = self::one($sent, $targetKey, $allowable);
            if (null === $operation) {
                return null;
            }
            $read[] = $operation;
        }

        return $read;
    }

    /**
     * @param \Closure(string): bool $allowable
     *
     * @return array{target: string, add: bool}|null
     */
    private static function one(mixed $operation, string $targetKey, \Closure $allowable): ?array
    {
        if (!is_array($operation) || !array_key_exists('allow', $operation)) {
            return null;
        }

        $target = $operation[$targetKey] ?? null;
        $allow = filter_var($operation['allow'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
        if (!is_string($target) || null === $allow || ($allow && !$allowable($target))) {
            return null;
        }

        return ['target' => $target, 'add' => $allow];
    }
}
