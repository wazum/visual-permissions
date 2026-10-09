<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Functional\ViewAsUser;

use PHPUnit\Framework\Attributes\Test;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use TYPO3\CMS\Backend\Routing\Route;
use TYPO3\CMS\Core\Core\SystemEnvironmentBuilder;
use TYPO3\CMS\Core\Http\NormalizedParams;
use TYPO3\CMS\Core\Http\Response;
use TYPO3\CMS\Core\Http\ServerRequest;
use TYPO3\CMS\Core\Page\PageRenderer;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;
use Wazum\VisualPermissions\ViewAsUser\LeaveUserView;

final class LeaveUserViewTest extends FunctionalTestCase
{
    protected array $coreExtensionsToLoad = ['beuser'];

    protected array $testExtensionsToLoad = ['wazum/visual-permissions'];

    protected function tearDown(): void
    {
        unset($GLOBALS['TYPO3_REQUEST']);
        parent::tearDown();
    }

    #[Test]
    public function loadsTheScriptForAUserWhoWasSwitchedTo(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_users.csv');
        $switched = $this->setUpBackendUser(2);
        $switched->setAndSaveSessionData('backuserid', 1);

        $this->get(LeaveUserView::class)->process($this->backendRequest(), $this->carriesOn());

        self::assertStringContainsString(
            '@wazum/visual-permissions/main.js',
            (string) json_encode(
                $this->get(PageRenderer::class)->getJavaScriptRenderer()->toArray(),
                JSON_UNESCAPED_SLASHES,
            ),
        );
    }

    // A module document written in the user's session runs on after the way back was taken,
    // as the admin, and would take the way back for itself.
    #[Test]
    public function loadsNothingIntoAModuleTheBackendShows(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_users.csv');
        $switched = $this->setUpBackendUser(2);
        $switched->setAndSaveSessionData('backuserid', 1);

        $this->get(LeaveUserView::class)->process(
            $this->backendRequest()->withAttribute('route', new Route('/module/web/layout', ['_identifier' => 'web_layout'])),
            $this->carriesOn(),
        );

        self::assertStringNotContainsString(
            '@wazum/visual-permissions',
            (string) json_encode(
                $this->get(PageRenderer::class)->getJavaScriptRenderer()->toArray(),
                JSON_UNESCAPED_SLASHES,
            ),
        );
    }

    // What the page is cannot be told before core has routed the request
    #[Test]
    public function loadsNothingIntoARequestNobodyRoutedYet(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_users.csv');
        $switched = $this->setUpBackendUser(2);
        $switched->setAndSaveSessionData('backuserid', 1);

        $this->get(LeaveUserView::class)->process(
            $this->backendRequest()->withoutAttribute('route'),
            $this->carriesOn(),
        );

        self::assertStringNotContainsString(
            '@wazum/visual-permissions',
            (string) json_encode(
                $this->get(PageRenderer::class)->getJavaScriptRenderer()->toArray(),
                JSON_UNESCAPED_SLASHES,
            ),
        );
    }

    #[Test]
    public function carriesTheWordOnTheWayBack(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_users.csv');
        $switched = $this->setUpBackendUser(2);
        $switched->setAndSaveSessionData('backuserid', 1);

        $this->get(LeaveUserView::class)->process($this->backendRequest(), $this->carriesOn());

        self::assertStringContainsString(
            '"leave":"Leave user view"',
            $this->get(PageRenderer::class)->render($this->backendRequest()),
        );
    }

    #[Test]
    public function loadsNothingForAUserWhoIsSimplyThemselves(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_users.csv');
        $this->setUpBackendUser(2);

        $this->get(LeaveUserView::class)->process($this->backendRequest(), $this->carriesOn());

        self::assertStringNotContainsString(
            '@wazum/visual-permissions',
            (string) json_encode(
                $this->get(PageRenderer::class)->getJavaScriptRenderer()->toArray(),
                JSON_UNESCAPED_SLASHES,
            ),
        );
    }

    private function backendRequest(): ServerRequestInterface
    {
        $request = (new ServerRequest('https://example.com/typo3/main'))
            ->withAttribute('applicationType', SystemEnvironmentBuilder::REQUESTTYPE_BE)
            ->withAttribute('route', new Route('/main', ['_identifier' => 'main']));

        // PageRenderer::render() reads the request from here: 13.4 always, 14.3 when given none
        return $GLOBALS['TYPO3_REQUEST'] = $request
            ->withAttribute('normalizedParams', NormalizedParams::createFromRequest($request));
    }

    private function carriesOn(): RequestHandlerInterface
    {
        return new class implements RequestHandlerInterface {
            public function handle(ServerRequestInterface $request): ResponseInterface
            {
                return new Response();
            }
        };
    }
}
