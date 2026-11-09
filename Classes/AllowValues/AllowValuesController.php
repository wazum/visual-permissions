<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\AllowValues;

use Wazum\VisualPermissions\Authorization\AllowOperations;
use Wazum\VisualPermissions\Authorization\Scope;
use Wazum\VisualPermissions\Surfaces\RecordForm\ValueChoices;
use Wazum\VisualPermissions\Write\GroupWriteController;

/**
 * @extends GroupWriteController<array{target: string, add: bool}>
 */
final readonly class AllowValuesController extends GroupWriteController
{
    protected function operationsFrom(mixed $sent): ?array
    {
        return AllowOperations::from($sent, 'value', $this->allowable(...));
    }

    /**
     * @throws \Doctrine\DBAL\Exception
     */
    protected function writeOperations(int $groupId, array $operations): bool
    {
        return $this->groups->change($groupId, Scope::FieldValues, $operations);
    }

    private function allowable(string $token): bool
    {
        [$table, $field, $value] = explode(':', $token, 3) + ['', '', ''];
        /** @var array<string, array{columns?: array<string, array{config?: array{authMode?: string, items?: list<array{value?: string|int}>}}>}> $tableConfigurations */
        $tableConfigurations = $GLOBALS['TCA'];
        $configuration = $tableConfigurations[$table]['columns'][$field]['config'] ?? [];
        $offered = array_map(strval(...), array_column($configuration['items'] ?? [], 'value'));

        return 'explicitAllow' === ($configuration['authMode'] ?? null) && ValueChoices::DIVIDER !== $value && in_array($value, $offered, true);
    }
}
