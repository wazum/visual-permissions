<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\GrantModules;

use TYPO3\CMS\Backend\Module\ModuleInterface;
use TYPO3\CMS\Backend\Module\ModuleRegistry;
use Wazum\VisualPermissions\Authorization\TargetKind;

final readonly class ModuleCatalogue
{
    public function __construct(private ModuleRegistry $registry)
    {
    }

    /**
     * @return array<string, TargetKind>
     */
    public function all(): array
    {
        $catalogue = [];
        foreach ($this->registry->getModules() as $module) {
            $catalogue[$module->getIdentifier()] = $this->kindOf($module);
        }

        return $catalogue;
    }

    private function kindOf(ModuleInterface $module): TargetKind
    {
        return match ($module->getAccess()) {
            'user' => TargetKind::Grantable,
            'admin', 'systemMaintainer' => TargetKind::AdminOnly,
            default => TargetKind::NotApplicable,
        };
    }
}
