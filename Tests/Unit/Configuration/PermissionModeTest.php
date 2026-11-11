<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Unit\Configuration;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use TYPO3\CMS\Core\Authentication\BackendUserAuthentication;
use Wazum\VisualPermissions\Configuration\PermissionMode;

final class PermissionModeTest extends TestCase
{
    #[Test]
    public function isOffWhenTheBrowserKeptItSwitchedOff(): void
    {
        self::assertFalse(PermissionMode::isOn($this->userWith(true, 'false')));
    }

    #[Test]
    public function isOnWhenTheBrowserKeptItSwitchedOn(): void
    {
        self::assertTrue(PermissionMode::isOn($this->userWith(true, 'true')));
    }

    #[Test]
    public function isOffForAnEditorWhoseSettingsSayOn(): void
    {
        self::assertFalse(PermissionMode::isOn($this->userWith(false, 'true')));
    }

    private function userWith(bool $admin, string $active): BackendUserAuthentication
    {
        $backendUser = new BackendUserAuthentication();
        $backendUser->user = ['admin' => $admin ? 1 : 0];
        $backendUser->uc = ['vperm' => ['session' => ['active' => $active]]];

        return $backendUser;
    }
}
