<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Functional\AllowModules;

use PHPUnit\Framework\Attributes\Test;
use TYPO3\CMS\Core\Http\ServerRequest;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;
use Wazum\VisualPermissions\AllowModules\AllowModulesController;
use Wazum\VisualPermissions\Authorization\Scope;
use Wazum\VisualPermissions\BackendGroups\BackendGroups;

final class AllowModulesControllerTest extends FunctionalTestCase
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

    /**
     * @param array<string, mixed> $body
     */
    private function asked(array $body): ServerRequest
    {
        return (new ServerRequest('https://example.com/typo3/ajax/visual-permissions/allow-modules', 'POST'))
            ->withParsedBody($body);
    }
}
