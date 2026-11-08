<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Functional\BackendGroups;

use PHPUnit\Framework\Attributes\Test;
use TYPO3\CMS\Core\Database\ConnectionPool;
use TYPO3\CMS\Core\Http\ServerRequest;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;
use Wazum\VisualPermissions\BackendGroups\GroupCatalogueController;

final class GroupCatalogueControllerTest extends FunctionalTestCase
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
    public function listsEveryGroupWithWhatItInherits(): void
    {
        $response = $this->get(GroupCatalogueController::class)->list($this->request());

        /** @var array<int, array{title: string, inherits: list<array{groupId: int}>}> $groups */
        $groups = json_decode((string) $response->getBody(), true);

        self::assertSame('Editors', $groups[10]['title'] ?? null);
        self::assertSame([11, 13, 12], array_column($groups[10]['inherits'] ?? [], 'groupId'));
    }

    #[Test]
    public function saysNothingChangedWhenTheCallerAlreadyHasTheList(): void
    {
        $tag = $this->get(GroupCatalogueController::class)->list($this->request())->getHeaderLine('ETag');

        $again = $this->get(GroupCatalogueController::class)
            ->list($this->request()->withHeader('If-None-Match', $tag));

        self::assertNotSame('', $tag);
        self::assertSame(304, $again->getStatusCode());
        self::assertSame('', (string) $again->getBody());
    }

    #[Test]
    public function knowsItsOwnTagWhenTheServerMarkedItWeak(): void
    {
        $tag = $this->get(GroupCatalogueController::class)->list($this->request())->getHeaderLine('ETag');

        $again = $this->get(GroupCatalogueController::class)
            ->list($this->request()->withHeader('If-None-Match', 'W/' . $tag));

        self::assertSame(304, $again->getStatusCode());
    }

    #[Test]
    public function answersInFullOnceAGroupWasAdded(): void
    {
        $tag = $this->get(GroupCatalogueController::class)->list($this->request())->getHeaderLine('ETag');

        $this->get(ConnectionPool::class)->getConnectionForTable('be_groups')->insert(
            'be_groups',
            ['uid' => 20, 'pid' => 0, 'title' => 'Translators'],
        );

        $again = $this->get(GroupCatalogueController::class)
            ->list($this->request()->withHeader('If-None-Match', $tag));

        self::assertSame(200, $again->getStatusCode());
        self::assertStringContainsString('Translators', (string) $again->getBody());
    }

    private function request(): ServerRequest
    {
        return (new ServerRequest('https://example.com/typo3/ajax/visual-permissions/groups'))
            ->withAttribute('backend.user', $GLOBALS['BE_USER']);
    }
}
