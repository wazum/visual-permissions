<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Unit\Authorization;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Wazum\VisualPermissions\Authorization\AllowOperations;

final class AllowOperationsTest extends TestCase
{
    #[Test]
    public function readsAnAllowAndADisallow(): void
    {
        self::assertSame(
            [['target' => 'records', 'add' => true], ['target' => 'web_layout', 'add' => false]],
            AllowOperations::from(
                [['module' => 'records', 'allow' => true], ['module' => 'web_layout', 'allow' => false]],
                'module',
                static fn(string $target): bool => true,
            ),
        );
    }

    #[Test]
    public function readsAFlagThatArrivedAsText(): void
    {
        self::assertSame(
            [['target' => 'records', 'add' => true], ['target' => 'web_layout', 'add' => false]],
            AllowOperations::from(
                [['module' => 'records', 'allow' => 'true'], ['module' => 'web_layout', 'allow' => 'false']],
                'module',
                static fn(string $target): bool => true,
            ),
        );
    }

    #[Test]
    public function refusesToAllowWhatCannotBeAllowed(): void
    {
        self::assertNull(AllowOperations::from(
            [['module' => 'records', 'allow' => true]],
            'module',
            static fn(string $target): bool => false,
        ));
    }

    #[Test]
    public function disallowsWhatCanNoLongerBeAllowed(): void
    {
        self::assertSame(
            [['target' => 'records', 'add' => false]],
            AllowOperations::from(
                [['module' => 'records', 'allow' => false]],
                'module',
                static fn(string $target): bool => false,
            ),
        );
    }

    #[Test]
    public function refusesARequestThatSentNoList(): void
    {
        self::assertNull(AllowOperations::from(null, 'module', static fn(string $target): bool => true));
    }

    #[Test]
    public function refusesTheWholeListWhenOneOperationNamesNoTarget(): void
    {
        self::assertNull(AllowOperations::from(
            [['module' => 'records', 'allow' => true], ['module' => 7, 'allow' => true]],
            'module',
            static fn(string $target): bool => true,
        ));
    }

    #[Test]
    public function refusesAnOperationThatSaysNothingAboutTheDirection(): void
    {
        self::assertNull(AllowOperations::from(
            [['module' => 'records']],
            'module',
            static fn(string $target): bool => true,
        ));
    }

    #[Test]
    public function refusesAnOperationWhoseDirectionItCannotRead(): void
    {
        self::assertNull(AllowOperations::from(
            [['module' => 'records', 'allow' => 'perhaps']],
            'module',
            static fn(string $target): bool => true,
        ));
    }
}
