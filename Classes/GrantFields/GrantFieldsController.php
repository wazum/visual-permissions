<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\GrantFields;

use Wazum\VisualPermissions\Authorization\GrantOperations;
use Wazum\VisualPermissions\Authorization\Scope;
use Wazum\VisualPermissions\Authorization\TargetKind;
use Wazum\VisualPermissions\BackendGroups\BackendGroups;
use Wazum\VisualPermissions\Write\GroupWriteController;

/**
 * @extends GroupWriteController<array{target: string, grant: bool}>
 */
final readonly class GrantFieldsController extends GroupWriteController
{
    public function __construct(
        BackendGroups $groups,
        private FieldCatalogue $catalogue,
    ) {
        parent::__construct($groups);
    }

    protected function operationsFrom(mixed $sent): ?array
    {
        return GrantOperations::from($sent, 'field', $this->grantable(...));
    }

    /**
     * @throws \Doctrine\DBAL\Exception
     */
    protected function writeOperations(int $groupId, array $operations): bool
    {
        return $this->groups->grant($groupId, Scope::Fields, $operations);
    }

    private function grantable(string $field): bool
    {
        $table = explode(':', $field)[0];

        return TargetKind::Grantable === ($this->catalogue->of($table)[$field] ?? null);
    }
}
