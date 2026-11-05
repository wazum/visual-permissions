<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Functional\ViewAsUser;

use PHPUnit\Framework\Attributes\Test;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use TYPO3\CMS\Core\Http\ServerRequest;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;
use Wazum\VisualPermissions\ViewAsUser\NoAccessiblePage;

final class NoAccessiblePageTest extends FunctionalTestCase
{
    protected array $coreExtensionsToLoad = ['beuser'];

    protected array $testExtensionsToLoad = ['wazum/visual-permissions'];

    #[Test]
    public function sendsAReaderToTheModuleWithoutAPageTheyMayNotSee(): void
    {
        $request = new ServerRequest('https://example.com/typo3/module/web/layout?id=25&token=abc');
        $refusing = new class implements RequestHandlerInterface {
            public function handle(ServerRequestInterface $request): ResponseInterface
            {
                throw new \RuntimeException('You don\'t have access to this page', 1289917924);
            }
        };

        $response = $this->get(NoAccessiblePage::class)->process($request, $refusing);

        self::assertSame(303, $response->getStatusCode());
        self::assertSame('https://example.com/typo3/module/web/layout?token=abc', $response->getHeaderLine('location'));
    }

    #[Test]
    public function leavesAnyOtherFailureToTheBackend(): void
    {
        $request = new ServerRequest('https://example.com/typo3/module/web/layout?id=25');
        $failing = new class implements RequestHandlerInterface {
            public function handle(ServerRequestInterface $request): ResponseInterface
            {
                throw new \RuntimeException('Something else', 1700000000);
            }
        };

        $this->expectExceptionCode(1700000000);

        $this->get(NoAccessiblePage::class)->process($request, $failing);
    }
}
