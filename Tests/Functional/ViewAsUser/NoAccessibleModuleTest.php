<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Functional\ViewAsUser;

use PHPUnit\Framework\Attributes\Test;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use TYPO3\CMS\Backend\Exception\NoAccessibleModuleException;
use TYPO3\CMS\Core\Http\ServerRequest;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;
use Wazum\VisualPermissions\ViewAsUser\NoAccessibleModule;

final class NoAccessibleModuleTest extends FunctionalTestCase
{
    protected array $coreExtensionsToLoad = ['beuser'];

    protected array $testExtensionsToLoad = ['wazum/visual-permissions'];

    #[Test]
    public function sendsAReaderWithNoModuleToTheBackendItself(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_users.csv');
        $this->setUpBackendUser(2);

        $request = new ServerRequest('https://example.com/typo3/module/web/layout');
        $refusing = new class implements RequestHandlerInterface {
            public function handle(ServerRequestInterface $request): ResponseInterface
            {
                throw new NoAccessibleModuleException('none of them', 1702480600);
            }
        };

        $response = $this->get(NoAccessibleModule::class)->process($request, $refusing);

        self::assertSame(303, $response->getStatusCode());
        self::assertStringContainsString('/typo3/main', $response->getHeaderLine('location'));
    }
}
