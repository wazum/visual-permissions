<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\AllowValues;

use Wazum\VisualPermissions\Authorization\GrantOperations;
use Wazum\VisualPermissions\Authorization\Scope;
use Wazum\VisualPermissions\Write\GroupWriteController;

/**
 * @extends GroupWriteController<array{target: string, grant: bool}>
 */
final readonly class AllowValuesController extends GroupWriteController
{
    protected function operationsFrom(mixed $sent): ?array
    {
        return GrantOperations::from($sent, 'value', $this->grantable(...));
    }

    /**
     * @throws \Doctrine\DBAL\Exception
     */
    protected function writeOperations(int $groupId, array $operations): bool
    {
        return $this->groups->grant($groupId, Scope::FieldValues, $operations);
    }

    private function grantable(string $token): bool
    {
        [$table, $field, $value] = explode(':', $token, 3) + ['', '', ''];
        /** @var array<string, array{columns?: array<string, array{config?: array{authMode?: string, items?: list<array{value?: string|int}>}}>}> $tableConfigurations */
        $tableConfigurations = $GLOBALS['TCA'];
        $configuration = $tableConfigurations[$table]['columns'][$field]['config'] ?? [];
        $offered = array_map(strval(...), array_column($configuration['items'] ?? [], 'value'));

        return 'explicitAllow' === ($configuration['authMode'] ?? null) && ValueChoices::DIVIDER !== $value && in_array($value, $offered, true);
    }
}
