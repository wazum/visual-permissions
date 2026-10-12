<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Functional\Compatibility;

use PHPUnit\Framework\Attributes\Test;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use TYPO3\CMS\Core\Authentication\BackendUserAuthentication;
use TYPO3\CMS\Core\Http\Response;
use TYPO3\CMS\Core\Http\ServerRequest;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;
use Wazum\VisualPermissions\Compatibility\BackendUserAttribute;

final class BackendUserAttributeTest extends FunctionalTestCase
{
    protected array $coreExtensionsToLoad = ['beuser'];

    protected array $testExtensionsToLoad = ['wazum/visual-permissions'];

    #[Test]
    public function handsTheRequestTheBackendUserItWasAuthenticatedAs(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_users.csv');
        $backendUser = $this->setUpBackendUser(1);
        $handler = new class implements RequestHandlerInterface {
            public ?ServerRequestInterface $handled = null;

            public function handle(ServerRequestInterface $request): ResponseInterface
            {
                $this->handled = $request;

                return new Response();
            }
        };

        $this->get(BackendUserAttribute::class)->process(new ServerRequest('https://example.com/typo3/'), $handler);

        self::assertSame($backendUser, $handler->handled?->getAttribute('backend.user'));
    }

    #[Test]
    public function keepsTheBackendUserTheRequestAlreadyCarries(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_users.csv');
        $this->setUpBackendUser(1);
        $carried = new BackendUserAuthentication();
        $handler = new class implements RequestHandlerInterface {
            public ?ServerRequestInterface $handled = null;

            public function handle(ServerRequestInterface $request): ResponseInterface
            {
                $this->handled = $request;

                return new Response();
            }
        };

        $this->get(BackendUserAttribute::class)->process(
            (new ServerRequest('https://example.com/typo3/'))->withAttribute('backend.user', $carried),
            $handler,
        );

        self::assertSame($carried, $handler->handled?->getAttribute('backend.user'));
    }

    #[Test]
    public function handsTheRequestNoBackendUserWhenNobodyIsAuthenticated(): void
    {
        unset($GLOBALS['BE_USER']);
        $handler = new class implements RequestHandlerInterface {
            public ?ServerRequestInterface $handled = null;

            public function handle(ServerRequestInterface $request): ResponseInterface
            {
                $this->handled = $request;

                return new Response();
            }
        };

        $this->get(BackendUserAttribute::class)->process(new ServerRequest('https://example.com/typo3/login'), $handler);

        self::assertNull($handler->handled?->getAttribute('backend.user'));
    }
}
