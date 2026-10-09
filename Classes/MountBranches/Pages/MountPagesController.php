<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\MountBranches\Pages;

use Wazum\VisualPermissions\Authorization\Scope;
use Wazum\VisualPermissions\Write\GroupWriteController;

/**
 * @extends GroupWriteController<array{target: string, grant: bool}>
 */
final readonly class MountPagesController extends GroupWriteController
{
    protected function operationsFrom(mixed $sent): ?array
    {
        if (!is_array($sent)) {
            return null;
        }

        $operations = [];
        foreach ($sent as $operation) {
            $page = is_array($operation) ? filter_var($operation['page'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]) : false;
            if (false === $page) {
                return null;
            }

            if (!array_key_exists('mount', $operation)) {
                return null;
            }

            $mount = filter_var($operation['mount'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            if (null === $mount) {
                return null;
            }

            $operations[] = ['target' => (string) $page, 'grant' => $mount];
        }

        return $operations;
    }

    /**
     * @throws \Doctrine\DBAL\Exception
     */
    protected function writeOperations(int $groupId, array $operations): bool
    {
        return $this->groups->grant($groupId, Scope::PageMounts, $operations);
    }
}
