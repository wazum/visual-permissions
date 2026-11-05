<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\AllowFields;

use Wazum\VisualPermissions\Authorization\AllowOperations;
use Wazum\VisualPermissions\Authorization\Scope;
use Wazum\VisualPermissions\Authorization\TargetKind;
use Wazum\VisualPermissions\BackendGroups\BackendGroups;
use Wazum\VisualPermissions\Write\GroupWriteController;

/**
 * @extends GroupWriteController<array{target: string, add: bool}>
 */
final readonly class AllowFieldsController extends GroupWriteController
{
    public function __construct(
        BackendGroups $groups,
        private FieldCatalogue $catalogue,
    ) {
        parent::__construct($groups);
    }

    protected function operationsFrom(mixed $sent): ?array
    {
        return AllowOperations::from($sent, 'field', $this->allowable(...));
    }

    /**
     * @throws \Doctrine\DBAL\Exception
     */
    protected function writeOperations(int $groupId, array $operations): bool
    {
        return $this->groups->change($groupId, Scope::Fields, $operations);
    }

    private function allowable(string $field): bool
    {
        $table = explode(':', $field)[0];

        return TargetKind::Allowable === ($this->catalogue->of($table)[$field] ?? null);
    }
}
