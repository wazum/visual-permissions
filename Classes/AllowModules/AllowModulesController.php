<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\AllowModules;

use Wazum\VisualPermissions\Authorization\AllowOperations;
use Wazum\VisualPermissions\Authorization\Scope;
use Wazum\VisualPermissions\Authorization\TargetKind;
use Wazum\VisualPermissions\BackendGroups\BackendGroups;
use Wazum\VisualPermissions\Write\GroupWriteController;

/**
 * @extends GroupWriteController<array{target: string, add: bool}>
 */
final readonly class AllowModulesController extends GroupWriteController
{
    public function __construct(
        BackendGroups $groups,
        private ModuleCatalogue $catalogue,
    ) {
        parent::__construct($groups);
    }

    protected function operationsFrom(mixed $sent): ?array
    {
        return AllowOperations::from($sent, 'module', $this->allowable(...));
    }

    /**
     * @throws \Doctrine\DBAL\Exception
     */
    protected function writeOperations(int $groupId, array $operations): bool
    {
        return $this->groups->change($groupId, Scope::Modules, $operations);
    }

    private function allowable(string $module): bool
    {
        return TargetKind::Allowable === ($this->catalogue->all()[$module] ?? null);
    }
}
