<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Functional\Surfaces\Toolbar;

use Doctrine\DBAL\Exception;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use Psr\Log\AbstractLogger;
use Psr\Log\NullLogger;
use TYPO3\CMS\Backend\Backend\ToolbarItems\UserToolbarItem;
use TYPO3\CMS\Backend\Toolbar\ToolbarItemInterface;
use TYPO3\CMS\Backend\Toolbar\ToolbarItemsRegistry;
use TYPO3\CMS\Core\Core\SystemEnvironmentBuilder;
use TYPO3\CMS\Core\Database\ConnectionPool;
use TYPO3\CMS\Core\Database\Query\QueryBuilder;
use TYPO3\CMS\Core\Http\NormalizedParams;
use TYPO3\CMS\Core\Http\ServerRequest;
use TYPO3\CMS\Core\Localization\LanguageServiceFactory;
use TYPO3\CMS\Core\Page\PageRenderer;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;
use Wazum\VisualPermissions\BackendGroups\BackendGroups;
use Wazum\VisualPermissions\BackendGroups\GroupCatalogue;
use Wazum\VisualPermissions\Compatibility\BackendViewFactory;
use Wazum\VisualPermissions\DataHandling\Records;
use Wazum\VisualPermissions\Surfaces\Toolbar\VisualPermissionsToolbarItem;
use Wazum\VisualPermissions\Tests\ContractFixture;

final class VisualPermissionsToolbarItemTest extends FunctionalTestCase
{
    protected array $coreExtensionsToLoad = ['beuser'];

    protected array $testExtensionsToLoad = ['wazum/visual-permissions'];

    #[Test]
    public function showsItsTitleInTheToolbar(): void
    {
        $item = $this->toolbarItem();

        self::assertStringContainsString('Visual permissions', $item->getItem());
    }

    #[Test]
    public function showsItsTitleInTheLanguageOfTheBackendUser(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/be_users.csv');
        $this->setUpBackendUser(1);

        $item = $this->toolbarItem();

        self::assertStringContainsString('Visuelle Berechtigungen', $item->getItem());
    }

    /**
     * @return array<string, array{string}>
     */
    public static function labelsOnThePage(): array
    {
        return [
            'one of its own' => ['viewAsUser.leave'],
            'the save core names' => ['rm.saveDoc'],
            'the record saved core reports' => ['notification.record_saved.title.singular'],
        ];
    }

    #[Test]
    #[DataProvider('labelsOnThePage')]
    public function putsTheLabelsItUsesOnThePage(string $label): void
    {
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/be_users.csv');
        $this->setUpBackendUser(1);
        $this->toolbarItem()->getItem();

        self::assertStringContainsString('"' . $label . '":', $this->renderedPage());
    }

    #[Test]
    public function isAvailableToAnAdministrator(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/be_users.csv');
        $this->setUpBackendUser(1);

        self::assertTrue($this->get(VisualPermissionsToolbarItem::class)->checkAccess());
    }

    #[Test]
    public function staysOutOfTheToolbarForAUserWhoIsNoAdministrator(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/be_users.csv');
        $this->setUpBackendUser(2);

        self::assertFalse($this->get(VisualPermissionsToolbarItem::class)->checkAccess());
    }

    #[Test]
    public function sitsDirectlyBeforeTheUserMenu(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/be_users.csv');
        $backendUser = $this->setUpBackendUser(1);
        $GLOBALS['LANG'] = GeneralUtility::makeInstance(LanguageServiceFactory::class)
            ->createFromUserPreferences($backendUser);

        $classes = array_map(
            static fn(ToolbarItemInterface $item): string => $item::class,
            array_values($this->get(ToolbarItemsRegistry::class)->getToolbarItems()),
        );

        $position = array_search(VisualPermissionsToolbarItem::class, $classes, true);

        self::assertIsInt($position, 'The item is not registered at all.');
        self::assertSame(UserToolbarItem::class, $classes[$position + 1] ?? null);
    }

    #[Test]
    public function offersTheToggleTheContractDeclares(): void
    {
        $item = $this->toolbarItem();

        self::assertStringContainsString(
            ContractFixture::readMap('dom-attributes', 'attributes')['toggle'],
            $item->getItem(),
        );
    }

    #[Test]
    public function namesTheSwitchAfterWhatItDoes(): void
    {
        $item = $this->toolbarItem();

        self::assertStringContainsString('Edit permissions', $item->getItem());
    }

    #[Test]
    public function offersNoDropDownAtAll(): void
    {
        self::assertFalse($this->toolbarItem()->hasDropDown());
    }

    #[Test]
    public function offersTheGroupsAnAdminCanInspect(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/be_groups.csv');

        $groups = $this->groupsCarriedBy($this->toolbarItem()->getItem());

        $titles = array_column($groups, 'title');

        self::assertContains('Editors', $titles);
        self::assertContains('Retired', $titles);
    }

    #[Test]
    public function saysWhichOfThemIsDisabled(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/be_groups.csv');

        $groups = $this->groupsCarriedBy($this->toolbarItem()->getItem());

        self::assertSame(
            ['2' => false, '3' => true, '1' => false],
            array_map(static fn(array $group): bool => $group['disabled'], $groups),
        );
    }

    #[Test]
    public function handsEachGroupTheChainItInheritsWithoutItself(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/be_users.csv');
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/group_chain.csv');
        $this->setUpBackendUser(1);

        $groups = $this->groupsCarriedBy($this->toolbarItem()->getItem());

        // Editors reaches Everyone through both subgroups, and keeps it once
        self::assertSame([
            '11' => ['title' => 'Base Editors', 'disabled' => false, 'inherits' => [
                ['groupId' => 13, 'title' => 'Everyone', 'depth' => 1],
            ]],
            '10' => ['title' => 'Editors', 'disabled' => false, 'inherits' => [
                ['groupId' => 11, 'title' => 'Base Editors', 'depth' => 1],
                ['groupId' => 13, 'title' => 'Everyone', 'depth' => 2],
                ['groupId' => 12, 'title' => 'Reviewers', 'depth' => 1],
            ]],
            '13' => ['title' => 'Everyone', 'disabled' => false, 'inherits' => []],
            '12' => ['title' => 'Reviewers', 'disabled' => false, 'inherits' => [
                ['groupId' => 13, 'title' => 'Everyone', 'depth' => 1],
            ]],
        ], $groups);
    }

    #[Test]
    public function carriesNoUserList(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/be_users.csv');

        $item = $this->toolbarItem()->getItem();

        self::assertStringNotContainsString('editor', $item);
    }

    #[Test]
    public function shipsTheToggleDisabledUntilTheBrowserKnowsTheGroup(): void
    {
        $item = $this->toolbarItem();

        self::assertStringContainsString('disabled', $item->getItem());
    }

    #[Test]
    public function labelsTheToggleInTheLanguageOfTheBackendUser(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/be_users.csv');
        $this->setUpBackendUser(1);

        $item = $this->toolbarItem();

        self::assertStringContainsString('Berechtigungen bearbeiten', $item->getItem());
    }

    #[Test]
    public function carriesTheToolbarClassTheContractDeclares(): void
    {
        $item = $this->toolbarItem();

        self::assertSame(
            ['class' => ContractFixture::readMap('dom-attributes', 'classes')['toolbarItem']],
            $item->getAdditionalAttributes(),
        );
    }

    #[Test]
    public function showsItsOwnIconInTheToolbar(): void
    {
        $item = $this->toolbarItem();

        self::assertStringContainsString('vperm-shield-eye', $item->getItem());
    }

    #[Test]
    public function inlinesTheIconSoItTakesTheToolbarColour(): void
    {
        $item = $this->toolbarItem();

        self::assertStringContainsString('currentColor', $item->getItem());
    }

    #[Test]
    public function staysOutOfTheBackendWhenTheDatabaseRefusesToAnswer(): void
    {
        $refusing = new class extends ConnectionPool {
            public function getQueryBuilderForTable(string $tableName): QueryBuilder
            {
                throw new class('the database is gone') extends \RuntimeException implements Exception {};
            }
        };

        $item = new VisualPermissionsToolbarItem(
            $this->get(BackendViewFactory::class),
            new GroupCatalogue(new BackendGroups($refusing, $this->get(Records::class))),
            $this->get(PageRenderer::class),
            new NullLogger(),
        );
        $item->setRequest(
            (new ServerRequest('https://example.com/typo3/'))
                ->withAttribute('applicationType', SystemEnvironmentBuilder::REQUESTTYPE_BE),
        );

        self::assertSame('', $item->getItem());
    }

    #[Test]
    public function logsWhyItStaysOutOfTheBackend(): void
    {
        $refusing = new class extends ConnectionPool {
            public function getQueryBuilderForTable(string $tableName): QueryBuilder
            {
                throw new class('the database is gone') extends \RuntimeException implements Exception {};
            }
        };
        $logger = new class extends AbstractLogger {
            /**
             * @var list<array{mixed, string}>
             */
            public array $messages = [];

            public function log($level, string|\Stringable $message, array $context = []): void
            {
                $this->messages[] = [$level, (string) $message];
            }
        };

        $item = new VisualPermissionsToolbarItem(
            $this->get(BackendViewFactory::class),
            new GroupCatalogue(new BackendGroups($refusing, $this->get(Records::class))),
            $this->get(PageRenderer::class),
            $logger,
        );
        $item->setRequest(
            (new ServerRequest('https://example.com/typo3/'))
                ->withAttribute('applicationType', SystemEnvironmentBuilder::REQUESTTYPE_BE),
        );
        $item->getItem();

        self::assertSame([['error', 'the database is gone']], $logger->messages);
    }

    private function renderedPage(): string
    {
        $request = (new ServerRequest('https://example.com/typo3/'))
            ->withAttribute('applicationType', SystemEnvironmentBuilder::REQUESTTYPE_BE);
        $request = $request->withAttribute('normalizedParams', NormalizedParams::createFromRequest($request));
        $GLOBALS['TYPO3_REQUEST'] = $request;

        return $this->get(PageRenderer::class)->render($request);
    }

    private function toolbarItem(): VisualPermissionsToolbarItem
    {
        $item = $this->get(VisualPermissionsToolbarItem::class);
        $item->setRequest(
            (new ServerRequest('https://example.com/typo3/'))
                ->withAttribute('applicationType', SystemEnvironmentBuilder::REQUESTTYPE_BE)
                // A backend request carries the user it is for, and the words are in their language
                ->withAttribute('backend.user', $GLOBALS['BE_USER'] ?? null),
        );

        return $item;
    }

    /**
     * @return array<string, array{title: string, disabled: bool, inherits: list<array{id: int, title: string, depth: int}>}>
     */
    private function groupsCarriedBy(string $item): array
    {
        preg_match('/data-vperm-groups="([^"]*)"/', $item, $found);

        /** @var array<string, array{title: string, disabled: bool, inherits: list<array{id: int, title: string, depth: int}>}> $groups */
        $groups = json_decode(
            htmlspecialchars_decode($found[1] ?? '', ENT_QUOTES),
            true,
            flags: JSON_THROW_ON_ERROR,
        );

        return $groups;
    }
}
