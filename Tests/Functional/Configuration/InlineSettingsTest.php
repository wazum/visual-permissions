<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Functional\Configuration;

use PHPUnit\Framework\Attributes\Test;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use TYPO3\CMS\Core\Configuration\ExtensionConfiguration;
use TYPO3\CMS\Core\Core\SystemEnvironmentBuilder;
use TYPO3\CMS\Core\Http\NormalizedParams;
use TYPO3\CMS\Core\Http\Response;
use TYPO3\CMS\Core\Http\ServerRequest;
use TYPO3\CMS\Core\Page\PageRenderer;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;
use Wazum\VisualPermissions\Configuration\InlineSettings;

final class InlineSettingsTest extends FunctionalTestCase
{
    protected array $coreExtensionsToLoad = ['beuser'];

    protected array $testExtensionsToLoad = ['wazum/visual-permissions'];

    protected function tearDown(): void
    {
        unset($GLOBALS['TYPO3_REQUEST']);
        parent::tearDown();
    }

    #[Test]
    public function tellsThePageThatWeAnimate(): void
    {
        $this->get(InlineSettings::class)->process($this->backendRequest(), $this->carriesOn());

        self::assertStringContainsString(
            '"animation":true',
            $this->get(PageRenderer::class)->render($this->backendRequest()),
        );
    }

    #[Test]
    public function tellsThePageThatWeDoNot(): void
    {
        $this->get(ExtensionConfiguration::class)->set('visual_permissions', ['animation' => '0']);

        $this->get(InlineSettings::class)->process($this->backendRequest(), $this->carriesOn());

        self::assertStringContainsString('"animation":false', $this->get(PageRenderer::class)->render($this->backendRequest()));
    }

    #[Test]
    public function tellsThePageWhichKeysSwitchWhat(): void
    {
        $this->get(InlineSettings::class)->process($this->backendRequest(), $this->carriesOn());

        $page = $this->get(PageRenderer::class)->render($this->backendRequest());

        self::assertStringContainsString('"toggleKey":"u"', $page);
        self::assertStringContainsString('"switchUserKey":"v"', $page);
    }

    #[Test]
    public function tellsThePageWhatToCallTheKeysHeldDown(): void
    {
        $this->get(InlineSettings::class)->process($this->backendRequest(), $this->carriesOn());

        self::assertStringContainsString(
            '"modifiers":"Ctrl+Shift"',
            $this->get(PageRenderer::class)->render($this->backendRequest()),
        );
    }

    #[Test]
    public function tellsThePageWhetherTheButtonsCarryTheKeys(): void
    {
        $this->get(ExtensionConfiguration::class)
            ->set('visual_permissions', ['shortcut' => ['show' => '0']]);

        $this->get(InlineSettings::class)->process($this->backendRequest(), $this->carriesOn());

        self::assertStringContainsString('"keysOnButtons":false', $this->get(PageRenderer::class)->render($this->backendRequest()));
    }

    private function backendRequest(): ServerRequestInterface
    {
        $request = (new ServerRequest('https://example.com/typo3/'))
            ->withAttribute('applicationType', SystemEnvironmentBuilder::REQUESTTYPE_BE);

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
