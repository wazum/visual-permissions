<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\GrantTables;

use Wazum\VisualPermissions\Authorization\GrantOperations;
use Wazum\VisualPermissions\Authorization\Scope;
use Wazum\VisualPermissions\Authorization\TargetKind;
use Wazum\VisualPermissions\BackendGroups\BackendGroups;
use Wazum\VisualPermissions\Write\GroupWriteController;

/**
 * @extends GroupWriteController<array{target: string, grant: bool}>
 */
final readonly class GrantTablesController extends GroupWriteController
{
    public function __construct(
        BackendGroups $groups,
        private TableCatalogue $catalogue,
    ) {
        parent::__construct($groups);
    }

    protected function operationsFrom(mixed $sent): ?array
    {
        return GrantOperations::from($sent, 'table', $this->grantable(...));
    }

    /**
     * @throws \Doctrine\DBAL\Exception
     */
    protected function writeOperations(int $groupId, array $operations): bool
    {
        return $this->groups->grant($groupId, Scope::TablesModify, $operations);
    }

    private function grantable(string $table): bool
    {
        return TargetKind::Grantable === ($this->catalogue->all()[$table] ?? null);
    }
}
