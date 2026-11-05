<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Unit\Authorization;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Wazum\VisualPermissions\Authorization\AllowOperations;

final class AllowOperationsTest extends TestCase
{
    #[Test]
    public function readsAGrantAndARevoke(): void
    {
        self::assertSame(
            [['target' => 'web_list', 'add' => true], ['target' => 'web_layout', 'add' => false]],
            AllowOperations::from(
                [['module' => 'web_list', 'allow' => true], ['module' => 'web_layout', 'allow' => false]],
                'module',
                static fn(string $target): bool => true,
            ),
        );
    }

    #[Test]
    public function readsAFlagThatArrivedAsText(): void
    {
        self::assertSame(
            [['target' => 'web_list', 'add' => true], ['target' => 'web_layout', 'add' => false]],
            AllowOperations::from(
                [['module' => 'web_list', 'allow' => 'true'], ['module' => 'web_layout', 'allow' => 'false']],
                'module',
                static fn(string $target): bool => true,
            ),
        );
    }

    #[Test]
    public function refusesToGrantWhatCannotBeGranted(): void
    {
        self::assertNull(AllowOperations::from(
            [['module' => 'web_list', 'allow' => true]],
            'module',
            static fn(string $target): bool => false,
        ));
    }

    #[Test]
    public function takesAwayWhatCanNoLongerBeGranted(): void
    {
        self::assertSame(
            [['target' => 'web_list', 'add' => false]],
            AllowOperations::from(
                [['module' => 'web_list', 'allow' => false]],
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
            [['module' => 'web_list', 'allow' => true], ['module' => 7, 'allow' => true]],
            'module',
            static fn(string $target): bool => true,
        ));
    }

    #[Test]
    public function refusesAnOperationThatSaysNothingAboutTheDirection(): void
    {
        self::assertNull(AllowOperations::from(
            [['module' => 'web_list']],
            'module',
            static fn(string $target): bool => true,
        ));
    }

    #[Test]
    public function refusesAnOperationWhoseDirectionItCannotRead(): void
    {
        self::assertNull(AllowOperations::from(
            [['module' => 'web_list', 'allow' => 'perhaps']],
            'module',
            static fn(string $target): bool => true,
        ));
    }
}
