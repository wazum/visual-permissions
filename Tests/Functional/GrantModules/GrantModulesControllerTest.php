<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Functional\GrantModules;

use PHPUnit\Framework\Attributes\Test;
use TYPO3\CMS\Core\Http\ServerRequest;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;
use Wazum\VisualPermissions\Authorization\Scope;
use Wazum\VisualPermissions\BackendGroups\BackendGroups;
use Wazum\VisualPermissions\GrantModules\GrantModulesController;

final class GrantModulesControllerTest extends FunctionalTestCase
{
    protected array $coreExtensionsToLoad = ['beuser'];

    protected array $testExtensionsToLoad = ['wazum/visual-permissions'];

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
        $response = $this->get(GrantModulesController::class)->write($this->asked([
            'group' => 10,
            'operations' => [
                ['module' => 'about', 'grant' => true],
                ['module' => 'web_layout', 'grant' => false],
            ],
        ]));

        self::assertSame(204, $response->getStatusCode());
        self::assertSame(['about'], $this->get(BackendGroups::class)->listOf(10, Scope::Modules));
    }

    #[Test]
    public function refusesToGrantWhatCannotBeGranted(): void
    {
        $response = $this->get(GrantModulesController::class)->write($this->asked([
            'group' => 10,
            'operations' => [['module' => 'no_such_module', 'grant' => true]],
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
    public function takesAwayWhatCanNoLongerBeGranted(): void
    {
        $response = $this->get(GrantModulesController::class)->write($this->asked([
            'group' => 10,
            'operations' => [['module' => 'no_such_module', 'grant' => false]],
        ]));

        self::assertSame(204, $response->getStatusCode());
    }

    /**
     * @param array<string, mixed> $body
     */
    private function asked(array $body): ServerRequest
    {
        return (new ServerRequest('https://example.com/typo3/ajax/visual-permissions/grant-modules', 'POST'))
            ->withParsedBody($body);
    }
}
