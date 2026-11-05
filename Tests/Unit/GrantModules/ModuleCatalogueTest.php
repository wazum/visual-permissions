<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Unit\GrantModules;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use TYPO3\CMS\Backend\Module\Module;
use TYPO3\CMS\Backend\Module\ModuleRegistry;
use Wazum\VisualPermissions\Authorization\TargetKind;
use Wazum\VisualPermissions\GrantModules\ModuleCatalogue;

final class ModuleCatalogueTest extends TestCase
{
    #[Test]
    public function callsAModuleAGroupCanBeGivenGrantable(): void
    {
        $catalogue = $this->catalogueOf('web_layout', 'user');

        self::assertSame(TargetKind::Grantable, $catalogue['web_layout']);
    }

    #[Test]
    public function callsAModuleOfAdministratorsAdminOnly(): void
    {
        $catalogue = $this->catalogueOf('site_configuration', 'admin');

        self::assertSame(TargetKind::AdminOnly, $catalogue['site_configuration']);
    }

    #[Test]
    public function keepsAModuleOfSystemMaintainersOutOfReachAsWell(): void
    {
        $catalogue = $this->catalogueOf('system_maintenance', 'systemMaintainer');

        self::assertSame(TargetKind::AdminOnly, $catalogue['system_maintenance']);
    }

    #[Test]
    public function callsAModuleWithoutAnyAccessSettingNotApplicable(): void
    {
        $catalogue = $this->catalogueOf('about', '');

        self::assertSame(TargetKind::NotApplicable, $catalogue['about']);
    }

    #[Test]
    public function reportsEveryModuleTheBackendKnows(): void
    {
        $catalogue = (new ModuleCatalogue(new ModuleRegistry([
            $this->module('web_layout', 'user'),
            $this->module('site_configuration', 'admin'),
        ])))->all();

        self::assertSame([
            'web_layout' => TargetKind::Grantable,
            'site_configuration' => TargetKind::AdminOnly,
        ], $catalogue);
    }

    /**
     * @return array<string, TargetKind>
     */
    private function catalogueOf(string $identifier, string $access): array
    {
        return (new ModuleCatalogue(new ModuleRegistry([$this->module($identifier, $access)])))->all();
    }

    private function module(string $identifier, string $access): Module
    {
        return Module::createFromConfiguration($identifier, [
            'access' => $access,
            'path' => '/module/' . $identifier,
        ]);
    }
}
