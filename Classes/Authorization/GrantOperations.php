<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Authorization;

final readonly class GrantOperations
{
    /**
     * @param \Closure(string): bool $grantable
     *
     * @return list<array{target: string, grant: bool}>|null
     */
    public static function from(mixed $operations, string $targetKey, \Closure $grantable): ?array
    {
        if (!is_array($operations)) {
            return null;
        }

        $read = [];
        foreach ($operations as $sent) {
            $operation = self::one($sent, $targetKey, $grantable);
            if (null === $operation) {
                return null;
            }
            $read[] = $operation;
        }

        return $read;
    }

    /**
     * @param \Closure(string): bool $grantable
     *
     * @return array{target: string, grant: bool}|null
     */
    private static function one(mixed $operation, string $targetKey, \Closure $grantable): ?array
    {
        if (!is_array($operation) || !array_key_exists('grant', $operation)) {
            return null;
        }

        $target = $operation[$targetKey] ?? null;
        $grant = filter_var($operation['grant'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
        if (!is_string($target) || null === $grant || ($grant && !$grantable($target))) {
            return null;
        }

        return ['target' => $target, 'grant' => $grant];
    }
}
