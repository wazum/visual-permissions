<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Functional\Compatibility;

use PHPUnit\Framework\Attributes\Test;
use TYPO3\CMS\Backend\Controller\Event\AfterBackendPageRenderEvent;
use TYPO3\CMS\Core\Http\ServerRequest;
use TYPO3\CMS\Core\Information\Typo3Version;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;
use Wazum\VisualPermissions\Compatibility\BackendViewFactory;
use Wazum\VisualPermissions\Compatibility\NoModuleAccessNotice;

final class NoModuleAccessNoticeTest extends FunctionalTestCase
{
    protected array $coreExtensionsToLoad = ['beuser'];

    protected array $testExtensionsToLoad = ['wazum/visual-permissions'];

    #[Test]
    public function saysThatNoModuleIsOpenToTheReader(): void
    {
        if ($this->get(Typo3Version::class)->getMajorVersion() >= 14) {
            self::markTestSkipped('14.3 says so itself');
        }

        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_users.csv');
        $this->setUpBackendUser(2);

        $event = new AfterBackendPageRenderEvent(
            '<div class="scaffold-content-module"><typo3-backend-module-router module="">'
            . '</typo3-backend-module-router></div>',
            $this->get(BackendViewFactory::class)->create(new ServerRequest('https://example.com/typo3/main')),
        );

        ($this->get(NoModuleAccessNotice::class))($event);

        self::assertStringContainsString('Kein Modulzugriff', $event->getContent());
        self::assertStringNotContainsString('typo3-backend-module-router', $event->getContent());
    }
}
