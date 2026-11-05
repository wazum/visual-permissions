<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Unit\Configuration;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Wazum\VisualPermissions\Configuration\PermissionMode;

final class PermissionModeTest extends TestCase
{
    #[Test]
    public function isOffWhenTheBrowserKeptItSwitchedOff(): void
    {
        self::assertFalse(PermissionMode::isOn(['vperm' => ['session' => ['active' => 'false']]]));
    }

    #[Test]
    public function isOnWhenTheBrowserKeptItSwitchedOn(): void
    {
        self::assertTrue(PermissionMode::isOn(['vperm' => ['session' => ['active' => 'true']]]));
    }
}
