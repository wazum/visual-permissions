<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Functional\Surfaces\ContextMenu;

use PHPUnit\Framework\Attributes\Test;
use TYPO3\CMS\Backend\Configuration\BackendUserConfiguration;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;
use Wazum\VisualPermissions\Surfaces\ContextMenu\RecordMenu;

final class RecordMenuTest extends FunctionalTestCase
{
    protected array $coreExtensionsToLoad = ['beuser'];

    protected array $testExtensionsToLoad = ['wazum/visual-permissions'];

    // Permissions are being set, not records edited: what changes a record waits until the mode is off
    #[Test]
    public function offersOnlyWhatChangesNoPageWhileTheModeIsOn(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/be_users.csv');
        $backendUser = $this->setUpBackendUser(1);
        (new BackendUserConfiguration($backendUser))->set('vperm.session', ['active' => 'true']);

        $menu = $this->get(RecordMenu::class);
        $menu->setContext('pages', '1');

        self::assertSame(
            ['view', 'edit', 'info'],
            array_keys($menu->addItems(array_fill_keys(
                ['view', 'edit', 'new', 'info', 'divider1', 'copy', 'cut', 'more', 'disable', 'delete', 'history', 'clearCache'],
                ['type' => 'item'],
            ))),
        );
    }

    #[Test]
    public function offersEverythingCoreOffersWhileTheModeIsOff(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/be_users.csv');
        $this->setUpBackendUser(1);

        $menu = $this->get(RecordMenu::class);
        $menu->setContext('pages', '1');

        self::assertSame(['view', 'edit', 'new'], array_keys($menu->addItems(array_fill_keys(['view', 'edit', 'new'], ['type' => 'item']))));
    }

    #[Test]
    public function offersEverythingCoreOffersOnceTheModeWasSwitchedOff(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/be_users.csv');
        $backendUser = $this->setUpBackendUser(1);
        (new BackendUserConfiguration($backendUser))->set('vperm.session', ['active' => 'false']);

        $menu = $this->get(RecordMenu::class);
        $menu->setContext('pages', '1');

        self::assertSame(['view', 'edit', 'new'], array_keys($menu->addItems(array_fill_keys(['view', 'edit', 'new'], ['type' => 'item']))));
    }

    #[Test]
    public function offersOnlyWhatChangesNoRecordOfAnyTableWhileTheModeIsOn(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/be_users.csv');
        $backendUser = $this->setUpBackendUser(1);
        (new BackendUserConfiguration($backendUser))->set('vperm.session', ['active' => 'true']);

        $menu = $this->get(RecordMenu::class);
        $menu->setContext('tt_content', '1');

        self::assertTrue($menu->canHandle());
    }
}
