<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Functional\Configuration;

use PHPUnit\Framework\Attributes\Test;
use TYPO3\CMS\Core\Configuration\ExtensionConfiguration;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;
use Wazum\VisualPermissions\Configuration\Settings;

final class SettingsTest extends FunctionalTestCase
{
    protected array $coreExtensionsToLoad = ['beuser'];

    protected array $testExtensionsToLoad = ['wazum/visual-permissions'];

    #[Test]
    public function carriesTheKeyAnInstallationPicked(): void
    {
        $this->get(ExtensionConfiguration::class)
            ->set('visual_permissions', ['shortcut' => ['toggle' => 'k']]);

        self::assertSame('k', $this->get(Settings::class)->toggleKey());
    }

    // A shortcut is one key beside the modifiers; an empty setting means the installation's keys clash.
    #[Test]
    public function readsAnythingButOneKeyAsNoShortcutAtAll(): void
    {
        $this->get(ExtensionConfiguration::class)
            ->set('visual_permissions', ['shortcut' => ['toggle' => 'Ctrl+Shift+U']]);

        self::assertSame('', $this->get(Settings::class)->toggleKey());
    }

    #[Test]
    public function carriesTheKeyThatSwitchesToAUserAndBack(): void
    {
        $this->get(ExtensionConfiguration::class)
            ->set('visual_permissions', ['shortcut' => ['switchUser' => 'x']]);

        self::assertSame('x', $this->get(Settings::class)->switchUserKey());
    }

    #[Test]
    public function saysWhetherTheButtonsCarryTheKeys(): void
    {
        $this->get(ExtensionConfiguration::class)
            ->set('visual_permissions', ['shortcut' => ['show' => '0']]);

        self::assertFalse($this->get(Settings::class)->keysOnButtons());
    }

    #[Test]
    public function saysWhetherToAnimate(): void
    {
        $this->get(ExtensionConfiguration::class)->set('visual_permissions', ['animation' => '0']);

        self::assertFalse($this->get(Settings::class)->animation());
    }
}
