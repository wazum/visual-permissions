<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\AllowTables;

use Wazum\VisualPermissions\Authorization\Scope;
use Wazum\VisualPermissions\Authorization\TargetKind;
use Wazum\VisualPermissions\BackendGroups\BackendGroups;
use Wazum\VisualPermissions\Write\GroupWriteController;

/**
 * @extends GroupWriteController<array{target: string, select: bool, modify: bool}>
 */
final readonly class AllowTablesController extends GroupWriteController
{
    public function __construct(
        BackendGroups $groups,
        private TableCatalogue $catalogue,
    ) {
        parent::__construct($groups);
    }

    protected function operationsFrom(mixed $sent): ?array
    {
        if (!is_array($sent)) {
            return null;
        }

        $read = [];
        foreach ($sent as $operation) {
            if (!is_array($operation) || !array_key_exists('select', $operation) || !array_key_exists('modify', $operation)) {
                return null;
            }

            $table = $operation['table'] ?? null;
            $select = filter_var($operation['select'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            $modify = filter_var($operation['modify'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            if (!is_string($table) || null === $select || null === $modify || ($modify && !$select) || ($select && !$this->allowable($table))) {
                return null;
            }

            $read[] = ['target' => $table, 'select' => $select, 'modify' => $modify];
        }

        return $read;
    }

    /**
     * @throws \Doctrine\DBAL\Exception
     */
    protected function writeOperations(int $groupId, array $operations): bool
    {
        return $this->groups->changeTogether($groupId, [
            [Scope::TablesSelect, array_map(static fn(array $operation): array => ['target' => $operation['target'], 'add' => $operation['select']], $operations)],
            [Scope::TablesModify, array_map(static fn(array $operation): array => ['target' => $operation['target'], 'add' => $operation['modify']], $operations)],
        ]);
    }

    private function allowable(string $table): bool
    {
        return TargetKind::Allowable === ($this->catalogue->all()[$table] ?? null);
    }
}
