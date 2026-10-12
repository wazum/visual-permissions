<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Functional\AllowModules;

use PHPUnit\Framework\Attributes\Test;
use TYPO3\CMS\Backend\Module\ModuleRegistry;
use TYPO3\CMS\Core\Http\ServerRequest;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;
use Wazum\VisualPermissions\AllowModules\AllowModulesController;
use Wazum\VisualPermissions\Authorization\Scope;
use Wazum\VisualPermissions\BackendGroups\BackendGroups;

final class AllowModulesControllerTest extends FunctionalTestCase
{
    protected array $coreExtensionsToLoad = ['beuser'];

    protected array $testExtensionsToLoad = [
        'wazum/visual-permissions',
        __DIR__ . '/../Fixtures/Extensions/module_tree',
    ];

    protected function setUp(): void
    {
        parent::setUp();
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/group_chain.csv');
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_users.csv');
        $this->setUpBackendUser(1);
    }

    #[Test]
    public function appliesWhatWasCollected(): void
    {
        $response = $this->get(AllowModulesController::class)->write($this->asked([
            'group' => 10,
            'operations' => [
                ['module' => 'about', 'allow' => true],
                ['module' => 'web_layout', 'allow' => false],
            ],
        ]));

        self::assertSame(204, $response->getStatusCode());
        self::assertSame(['about'], $this->get(BackendGroups::class)->listOf(10, Scope::Modules));
    }

    #[Test]
    public function allowsTheParentOfAModuleBelowTheMenuWithIt(): void
    {
        $this->get(AllowModulesController::class)->write($this->asked([
            'group' => 10,
            'operations' => [['module' => 'module_tree_child', 'allow' => true]],
        ]));

        self::assertEqualsCanonicalizing(
            ['web_layout', 'module_tree_child', 'module_tree_parent'],
            $this->get(BackendGroups::class)->listOf(10, Scope::Modules),
        );
    }

    #[Test]
    public function namesTheParentAllowedAlongWithAModule(): void
    {
        $response = $this->get(AllowModulesController::class)->write($this->asked([
            'group' => 10,
            'operations' => [['module' => 'module_tree_child', 'allow' => true]],
        ]));

        self::assertSame(['alsoAllowed' => ['Module tree']], json_decode((string) $response->getBody(), true));
    }

    #[Test]
    public function namesNoParentTheGroupHasAlready(): void
    {
        $this->get(AllowModulesController::class)->write($this->asked([
            'group' => 10,
            'operations' => [['module' => 'module_tree_parent', 'allow' => true]],
        ]));

        $response = $this->get(AllowModulesController::class)->write($this->asked([
            'group' => 10,
            'operations' => [['module' => 'module_tree_child', 'allow' => true]],
        ]));

        self::assertSame(204, $response->getStatusCode());
    }

    #[Test]
    public function namesNoParentAllowedInTheSameWrite(): void
    {
        $response = $this->get(AllowModulesController::class)->write($this->asked([
            'group' => 10,
            'operations' => [
                ['module' => 'module_tree_child', 'allow' => true],
                ['module' => 'module_tree_parent', 'allow' => true],
            ],
        ]));

        self::assertSame(204, $response->getStatusCode());
    }

    #[Test]
    public function refusesToAllowWhatCannotBeAllowed(): void
    {
        $response = $this->get(AllowModulesController::class)->write($this->asked([
            'group' => 10,
            'operations' => [['module' => 'no_such_module', 'allow' => true]],
        ]));

        self::assertSame(400, $response->getStatusCode());
        self::assertSame(
            'web_layout',
            $this->getConnectionPool()
                ->getConnectionForTable('be_groups')
                ->fetchOne('SELECT groupMods FROM be_groups WHERE uid = 10'),
        );
    }

    #[Test]
    public function disallowsWhatCanNoLongerBeAllowed(): void
    {
        $response = $this->get(AllowModulesController::class)->write($this->asked([
            'group' => 10,
            'operations' => [['module' => 'no_such_module', 'allow' => false]],
        ]));

        self::assertSame(204, $response->getStatusCode());
    }

    #[Test]
    public function offersTheModulesOutsideTheMenu(): void
    {
        $values = array_merge(...array_column($this->outsideTheMenu()['groups'], 'values'));

        self::assertContains('about', array_column($values, 'value'));
        self::assertNotContains('web_layout', array_column($values, 'value'));
    }

    #[Test]
    public function namesAModuleOutsideTheMenuUnderItsMainModule(): void
    {
        $byMainModule = array_column($this->outsideTheMenu()['groups'], 'values', 'label');

        self::assertContains('About TYPO3 CMS', array_column($byMainModule['Help'] ?? [], 'label'));
    }

    #[Test]
    public function showsAModuleOutsideTheMenuWithItsOwnIcon(): void
    {
        $values = array_column(array_merge(...array_column($this->outsideTheMenu()['groups'], 'values')), 'icon', 'value');

        self::assertSame($this->get(ModuleRegistry::class)->getModule('about')->getIconIdentifier(), $values['about'] ?? null);
    }

    #[Test]
    public function titlesTheModulesOutsideTheMenuInTheLanguageOfTheBackendUser(): void
    {
        self::assertSame('Module außerhalb des Menüs, die die Gruppe „%s“ öffnen darf', $this->outsideTheMenu()['title']);
    }

    /**
     * @return array{title: string, groups: list<array{label: string, values: list<array{value: string, label: string, icon: string}>}>}
     */
    private function outsideTheMenu(): array
    {
        $response = $this->get(AllowModulesController::class)->choices(
            (new ServerRequest('https://example.com/typo3/ajax/visual-permissions/modules-outside-menu'))
                ->withAttribute('backend.user', $GLOBALS['BE_USER']),
        );

        /** @var array{title: string, groups: list<array{label: string, values: list<array{value: string, label: string, icon: string}>}>} $choices */
        $choices = json_decode((string) $response->getBody(), true);

        return $choices;
    }

    /**
     * @param array<string, mixed> $body
     */
    private function asked(array $body): ServerRequest
    {
        return (new ServerRequest('https://example.com/typo3/ajax/visual-permissions/allow-modules', 'POST'))
            ->withParsedBody($body)
            ->withAttribute('backend.user', $GLOBALS['BE_USER']);
    }
}
