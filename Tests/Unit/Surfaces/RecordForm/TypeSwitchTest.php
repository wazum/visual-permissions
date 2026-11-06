<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Unit\Surfaces\RecordForm;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Wazum\VisualPermissions\Surfaces\RecordForm\TypeSwitch;

final class TypeSwitchTest extends TestCase
{
    /**
     * @return array<string, array{array{ctrl?: array{type?: string}, columns?: array<string, array{onChange?: string}>}, string, bool}>
     */
    public static function fields(): array
    {
        return [
            'the type field of the table' => [['ctrl' => ['type' => 'CType']], 'CType', true],
            'the local half of a type read from another table' => [['ctrl' => ['type' => 'uid_local:type']], 'uid_local', true],
            'a field that reloads the form' => [['columns' => ['driver' => ['onChange' => 'reload']]], 'driver', true],
            'a field that does nothing on change' => [['ctrl' => ['type' => 'CType'], 'columns' => ['header' => []]], 'header', false],
            'a field of a table without types' => [['columns' => ['title' => []]], 'title', false],
        ];
    }

    /**
     * @param array{ctrl?: array{type?: string}, columns?: array<string, array{onChange?: string}>} $processedTca
     */
    #[Test]
    #[DataProvider('fields')]
    public function tellsWhetherAFieldSwitchesTheForm(array $processedTca, string $fieldName, bool $switches): void
    {
        self::assertSame($switches, TypeSwitch::is($processedTca, $fieldName));
    }
}
