<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Functional;

use PHPUnit\Framework\Attributes\Test;
use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;

final class ExtensionInstallationTest extends FunctionalTestCase
{
    protected array $coreExtensionsToLoad = ['beuser'];

    protected array $testExtensionsToLoad = ['wazum/visual-permissions'];

    #[Test]
    public function theExtensionIsLoadedWithACompilableContainer(): void
    {
        self::assertTrue(ExtensionManagementUtility::isLoaded('visual_permissions'));
    }
}
