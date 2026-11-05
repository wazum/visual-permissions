<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Functional\ViewAsUser;

use PHPUnit\Framework\Attributes\Test;
use TYPO3\CMS\Core\Database\ConnectionPool;
use TYPO3\CMS\Core\Http\ServerRequest;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;
use Wazum\VisualPermissions\ViewAsUser\ViewableUsersController;

final class ViewableUsersControllerTest extends FunctionalTestCase
{
    protected array $coreExtensionsToLoad = ['beuser'];

    protected array $testExtensionsToLoad = ['wazum/visual-permissions'];

    #[Test]
    public function listsEveryViewableUserWithTheirGroups(): void
    {
        $this->importCSVDataSet(__DIR__ . '/Fixtures/be_users.csv');
        $this->setUpBackendUser(1);

        $response = $this->get(ViewableUsersController::class)->list($this->request());

        self::assertSame(200, $response->getStatusCode());

        /** @var array{recent: list<int>, users: list<array{id: int, username: string, realName: string, groups: list<int>}>} $payload */
        $payload = json_decode((string) $response->getBody(), true);

        self::assertSame([
            ['id' => 5, 'username' => 'another-editor', 'realName' => '', 'groups' => [10, 12]],
            ['id' => 2, 'username' => 'editor', 'realName' => 'Hans Huber', 'groups' => [10]],
        ], $payload['users']);
    }

    #[Test]
    public function handsOverTheUsersCoreSaysWereSwitchedToMostRecently(): void
    {
        $this->importCSVDataSet(__DIR__ . '/Fixtures/be_users.csv');
        $backendUser = $this->setUpBackendUser(1);
        $backendUser->uc['recentSwitchedToUsers'] = [5, 2];

        $response = $this->get(ViewableUsersController::class)->list($this->request());

        /** @var array{recent: list<int>} $payload */
        $payload = json_decode((string) $response->getBody(), true);

        self::assertSame([5, 2], $payload['recent']);
    }

    #[Test]
    public function saysNobodyWasSwitchedToWhenCoreRememberedNobody(): void
    {
        $this->importCSVDataSet(__DIR__ . '/Fixtures/be_users.csv');
        $this->setUpBackendUser(1);

        $response = $this->get(ViewableUsersController::class)->list($this->request());

        /** @var array{recent: list<int>} $payload */
        $payload = json_decode((string) $response->getBody(), true);

        self::assertSame([], $payload['recent']);
    }

    #[Test]
    public function saysNothingChangedWhenTheCallerAlreadyHasTheList(): void
    {
        $this->importCSVDataSet(__DIR__ . '/Fixtures/be_users.csv');
        $this->setUpBackendUser(1);

        $first = $this->get(ViewableUsersController::class)->list($this->request());
        $tag = $first->getHeaderLine('ETag');

        $again = $this->get(ViewableUsersController::class)
            ->list($this->request()->withHeader('If-None-Match', $tag));

        self::assertNotSame('', $tag);
        self::assertSame(304, $again->getStatusCode());
        self::assertSame('', (string) $again->getBody());
    }

    #[Test]
    public function knowsItsOwnTagWhenTheServerMarkedItWeak(): void
    {
        $this->importCSVDataSet(__DIR__ . '/Fixtures/be_users.csv');
        $this->setUpBackendUser(1);

        $tag = $this->get(ViewableUsersController::class)->list($this->request())->getHeaderLine('ETag');

        $again = $this->get(ViewableUsersController::class)
            ->list($this->request()->withHeader('If-None-Match', 'W/' . $tag));

        self::assertSame(304, $again->getStatusCode());
    }

    #[Test]
    public function answersInFullOnceAUserHasChanged(): void
    {
        $this->importCSVDataSet(__DIR__ . '/Fixtures/be_users.csv');
        $this->setUpBackendUser(1);

        $tag = $this->get(ViewableUsersController::class)
            ->list($this->request())
            ->getHeaderLine('ETag');

        $this->get(ConnectionPool::class)->getConnectionForTable('be_users')->update(
            'be_users',
            ['realName' => 'Someone Else', 'tstamp' => time() + 1],
            ['uid' => 2],
        );

        $again = $this->get(ViewableUsersController::class)
            ->list($this->request()->withHeader('If-None-Match', $tag));

        self::assertSame(200, $again->getStatusCode());
        self::assertStringContainsString('Someone Else', (string) $again->getBody());
    }

    private function request(): ServerRequest
    {
        return new ServerRequest('https://example.com/typo3/ajax/visual-permissions/viewable-users');
    }
}
