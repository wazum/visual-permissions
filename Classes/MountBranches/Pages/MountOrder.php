<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\MountBranches\Pages;

use TYPO3\CMS\Backend\Utility\BackendUtility;

final readonly class MountOrder
{
    /**
     * @param list<int> $pages
     *
     * @return list<int>
     */
    public function inTreeOrder(array $pages): array
    {
        $paths = [];
        foreach ($pages as $page) {
            $path = $this->pathOf($page);
            if (null !== $path) {
                $paths[$page] = $path;
            }
        }

        $ordered = array_keys($paths);
        usort($ordered, static fn(int $one, int $other): int => self::compare($paths[$one], $paths[$other]));

        return $ordered;
    }

    /**
     * @return list<array{int, int}>|null
     */
    private function pathOf(int $page): ?array
    {
        /** @var array<int, array{uid: int|string|null, sorting: int|string|null}> $rootline */
        $rootline = BackendUtility::BEgetRootLine($page, '', false, ['sorting']);
        ksort($rootline);

        $root = array_shift($rootline);
        if (0 !== ($root['uid'] ?? null) || [] === $rootline) {
            return null;
        }

        return array_map(
            static fn(array $step): array => [(int) $step['sorting'], (int) $step['uid']],
            array_values($rootline),
        );
    }

    /**
     * @param list<array{int, int}> $one
     * @param list<array{int, int}> $other
     */
    private static function compare(array $one, array $other): int
    {
        foreach ($one as $step => $part) {
            if (!isset($other[$step])) {
                return 1;
            }

            $order = $part <=> $other[$step];
            if (0 !== $order) {
                return $order;
            }
        }

        return count($one) <=> count($other);
    }
}
