<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Unit\Authorization;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Wazum\VisualPermissions\Authorization\GrantOperations;

final class GrantOperationsTest extends TestCase
{
    #[Test]
    public function readsAGrantAndARevoke(): void
    {
        self::assertSame(
            [['target' => 'web_list', 'grant' => true], ['target' => 'web_layout', 'grant' => false]],
            GrantOperations::from(
                [['module' => 'web_list', 'grant' => true], ['module' => 'web_layout', 'grant' => false]],
                'module',
                static fn(string $target): bool => true,
            ),
        );
    }

    #[Test]
    public function readsAFlagThatArrivedAsText(): void
    {
        self::assertSame(
            [['target' => 'web_list', 'grant' => true], ['target' => 'web_layout', 'grant' => false]],
            GrantOperations::from(
                [['module' => 'web_list', 'grant' => 'true'], ['module' => 'web_layout', 'grant' => 'false']],
                'module',
                static fn(string $target): bool => true,
            ),
        );
    }

    #[Test]
    public function refusesToGrantWhatCannotBeGranted(): void
    {
        self::assertNull(GrantOperations::from(
            [['module' => 'web_list', 'grant' => true]],
            'module',
            static fn(string $target): bool => false,
        ));
    }

    #[Test]
    public function takesAwayWhatCanNoLongerBeGranted(): void
    {
        self::assertSame(
            [['target' => 'web_list', 'grant' => false]],
            GrantOperations::from(
                [['module' => 'web_list', 'grant' => false]],
                'module',
                static fn(string $target): bool => false,
            ),
        );
    }

    #[Test]
    public function refusesARequestThatSentNoList(): void
    {
        self::assertNull(GrantOperations::from(null, 'module', static fn(string $target): bool => true));
    }

    #[Test]
    public function refusesTheWholeListWhenOneOperationNamesNoTarget(): void
    {
        self::assertNull(GrantOperations::from(
            [['module' => 'web_list', 'grant' => true], ['module' => 7, 'grant' => true]],
            'module',
            static fn(string $target): bool => true,
        ));
    }

    #[Test]
    public function refusesAnOperationThatSaysNothingAboutTheDirection(): void
    {
        self::assertNull(GrantOperations::from(
            [['module' => 'web_list']],
            'module',
            static fn(string $target): bool => true,
        ));
    }

    #[Test]
    public function refusesAnOperationWhoseDirectionItCannotRead(): void
    {
        self::assertNull(GrantOperations::from(
            [['module' => 'web_list', 'grant' => 'perhaps']],
            'module',
            static fn(string $target): bool => true,
        ));
    }
}
