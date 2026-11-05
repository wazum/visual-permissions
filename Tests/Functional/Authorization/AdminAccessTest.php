<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Functional\Authorization;

use PHPUnit\Framework\Attributes\Test;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use TYPO3\CMS\Backend\Routing\Route;
use TYPO3\CMS\Core\Http\Response;
use TYPO3\CMS\Core\Http\ServerRequest;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;
use Wazum\VisualPermissions\Authorization\AdminAccess;

final class AdminAccessTest extends FunctionalTestCase
{
    protected array $coreExtensionsToLoad = ['beuser'];

    protected array $testExtensionsToLoad = ['wazum/visual-permissions'];

    #[Test]
    public function refusesAUserWhoIsNoAdministratorOnARouteForAdministrators(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_users.csv');
        $this->setUpBackendUser(2);

        $response = $this->get(AdminAccess::class)->process($this->requestFor(['access' => 'admin']), $this->handler());

        self::assertSame(403, $response->getStatusCode());
    }

    #[Test]
    public function letsAnAdministratorThrough(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_users.csv');
        $this->setUpBackendUser(1);

        $response = $this->get(AdminAccess::class)->process($this->requestFor(['access' => 'admin']), $this->handler());

        self::assertSame(200, $response->getStatusCode());
    }

    #[Test]
    public function letsAnyoneThroughOnARouteThatAsksForNoAdministrator(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_users.csv');
        $this->setUpBackendUser(2);

        $response = $this->get(AdminAccess::class)->process($this->requestFor([]), $this->handler());

        self::assertSame(200, $response->getStatusCode());
    }

    /**
     * @param array<string, mixed> $options
     */
    private function requestFor(array $options): ServerRequestInterface
    {
        return (new ServerRequest('https://example.com/typo3/ajax/visual-permissions/any'))
            ->withAttribute('route', new Route('/visual-permissions/any', $options));
    }

    private function handler(): RequestHandlerInterface
    {
        return new class implements RequestHandlerInterface {
            public function handle(ServerRequestInterface $request): ResponseInterface
            {
                return new Response(null, 200);
            }
        };
    }
}
