<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\AllowValues;

use Wazum\VisualPermissions\Authorization\AllowOperations;
use Wazum\VisualPermissions\Authorization\Scope;
use Wazum\VisualPermissions\Write\GroupWriteController;

/**
 * @extends GroupWriteController<array{target: string, add: bool}>
 */
final readonly class AllowPageTypesController extends GroupWriteController
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
        return $this->groups->change($groupId, Scope::PageTypes, $operations);
    }

    private function allowable(string $pageType): bool
    {
        /** @var array{pages?: array{columns?: array{doktype?: array{config?: array{items?: list<array{value?: string|int}>}}}}} $tableConfigurations */
        $tableConfigurations = $GLOBALS['TCA'];
        $offered = array_column($tableConfigurations['pages']['columns']['doktype']['config']['items'] ?? [], 'value');

        return ValueChoices::DIVIDER !== $pageType && in_array($pageType, array_map(strval(...), $offered), true);
    }
}
