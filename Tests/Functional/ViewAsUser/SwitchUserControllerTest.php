<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Functional\ViewAsUser;

use PHPUnit\Framework\Attributes\Test;
use TYPO3\CMS\Core\Http\ServerRequest;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;
use Wazum\VisualPermissions\ViewAsUser\SwitchUserController;

final class SwitchUserControllerTest extends FunctionalTestCase
{
    protected array $coreExtensionsToLoad = ['beuser'];

    protected array $testExtensionsToLoad = ['wazum/visual-permissions'];

    // The browser is sent on rather than told where to go, so the page it leaves is gone
    #[Test]
    public function sendsTheBrowserOnToTheBackendItHandedOver(): void
    {
        $this->importCSVDataSet(__DIR__ . '/Fixtures/be_users.csv');
        $this->setUpBackendUser(1);

        $response = $this->get(SwitchUserController::class)->switchUser($this->asked(['targetUser' => 2]));

        self::assertSame(303, $response->getStatusCode());
        self::assertStringStartsWith('/typo3/', $response->getHeaderLine('location'));
    }

    #[Test]
    public function sendsTheBrowserOnToTheScreenItWasGiven(): void
    {
        $this->importCSVDataSet(__DIR__ . '/Fixtures/be_users.csv');
        $this->setUpBackendUser(1);

        $response = $this->get(SwitchUserController::class)->switchUser($this->asked([
            'targetUser' => 2,
            'screen' => '/typo3/module/web/list?id=3',
        ]));

        self::assertSame('/typo3/module/web/list?id=3', $response->getHeaderLine('location'));
    }

    // The screen comes from the browser, so it is not to be trusted
    #[Test]
    public function sendsTheBrowserNowhereButThisBackend(): void
    {
        $this->importCSVDataSet(__DIR__ . '/Fixtures/be_users.csv');
        $this->setUpBackendUser(1);

        foreach (['https://example.org/typo3', '//example.org/typo3', '/\\example.org'] as $elsewhere) {
            $response = $this->get(SwitchUserController::class)->switchUser($this->asked([
                'targetUser' => 2,
                'screen' => $elsewhere,
            ]));

            self::assertStringStartsWith('/typo3/main', $response->getHeaderLine('location'), $elsewhere);
        }
    }

    #[Test]
    public function handsTheSessionOverToTheUserItWasAskedAbout(): void
    {
        $this->importCSVDataSet(__DIR__ . '/Fixtures/be_users.csv');
        $backendUser = $this->setUpBackendUser(1);

        $this->get(SwitchUserController::class)->switchUser($this->asked(['targetUser' => 2]));

        self::assertSame(1, $backendUser->getOriginalUserIdWhenInSwitchUserMode());
    }

    /**
     * @param array<string, mixed> $body
     */
    private function asked(array $body): ServerRequest
    {
        return (new ServerRequest('https://example.com/typo3/visual-permissions/view-as-user', 'POST'))
            ->withParsedBody($body);
    }
}
