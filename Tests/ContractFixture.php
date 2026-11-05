<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests;

final class ContractFixture
{
    /**
     * @return array<string, mixed>
     */
    public static function read(string $name): array
    {
        /** @var array<string, mixed> $decoded */
        $decoded = json_decode(self::contents($name), true, flags: JSON_THROW_ON_ERROR);
        unset($decoded['comment']);

        return $decoded;
    }

    /**
     * @return list<string>
     */
    public static function readList(string $name, string $key): array
    {
        $value = self::read($name)[$key] ?? throw new \RuntimeException(sprintf('Fixture "%s" has no "%s"', $name, $key));
        if (!is_array($value)) {
            throw new \RuntimeException(sprintf('Fixture "%s" key "%s" is not a list', $name, $key));
        }

        $list = [];
        foreach ($value as $item) {
            $list[] = is_string($item)
                ? $item
                : throw new \RuntimeException(sprintf('Fixture "%s" key "%s" holds a non-string', $name, $key));
        }

        return $list;
    }

    /**
     * @return array<string, string>
     */
    public static function readMap(string $name, string $key): array
    {
        $value = self::read($name)[$key] ?? throw new \RuntimeException(sprintf('Fixture "%s" has no "%s"', $name, $key));
        if (!is_array($value)) {
            throw new \RuntimeException(sprintf('Fixture "%s" key "%s" is not a map', $name, $key));
        }

        $map = [];
        foreach ($value as $entry => $entryValue) {
            $map[(string) $entry] = is_string($entryValue)
                ? $entryValue
                : throw new \RuntimeException(sprintf('Fixture "%s" key "%s" holds a non-string', $name, $key));
        }

        return $map;
    }

    private static function contents(string $name): string
    {
        $path = __DIR__ . '/../Contract/' . $name . '.json';
        if (!is_file($path)) {
            throw new \RuntimeException(sprintf('No contract fixture at %s', $path));
        }

        return (string) file_get_contents($path);
    }
}
