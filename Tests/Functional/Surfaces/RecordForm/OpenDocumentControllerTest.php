<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Functional\Surfaces\RecordForm;

use PHPUnit\Framework\Attributes\Test;
use TYPO3\CMS\Core\Http\ServerRequest;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;
use Wazum\VisualPermissions\Surfaces\RecordForm\OpenDocumentController;

final class OpenDocumentControllerTest extends FunctionalTestCase
{
    protected array $coreExtensionsToLoad = ['beuser'];

    protected array $testExtensionsToLoad = ['wazum/visual-permissions'];

    protected function setUp(): void
    {
        parent::setUp();

        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/be_users.csv');
        $this->setUpBackendUser(1);
    }

    #[Test]
    public function answersWithTheUrlOfThatDocument(): void
    {
        $url = $this->urlFor(['table' => 'tt_content', 'uids' => '82,81']);

        self::assertStringContainsString('/typo3/record/edit', $url);
        self::assertStringContainsString('token=', $url);
        self::assertStringContainsString('edit%5Btt_content%5D%5B82%5D=edit', $url);
        self::assertStringContainsString('edit%5Btt_content%5D%5B81%5D=edit', $url);
    }

    #[Test]
    public function sendsThemBackToTheScreenTheDocumentStandsOn(): void
    {
        $url = $this->urlFor([
            'table' => 'tt_content',
            'uids' => '81',
            'returnUrl' => '/typo3/module/web/layout?id=63',
        ]);

        self::assertStringContainsString('returnUrl=', $url);
        self::assertStringContainsString('web/layout', $url);
    }

    #[Test]
    public function sendsThemNowhereButThisBackend(): void
    {
        foreach (['https://example.org/somewhere', '//example.org/somewhere', 'javascript:alert(1)'] as $elsewhere) {
            $url = $this->urlFor(['table' => 'tt_content', 'uids' => '81', 'returnUrl' => $elsewhere]);

            self::assertStringNotContainsString('example.org', $url, $elsewhere);
            self::assertStringNotContainsString('javascript', $url, $elsewhere);
        }
    }

    #[Test]
    public function answersWithNoUrlForAnythingElse(): void
    {
        $asked = [[], ['table' => 'tt_content'], ['table' => '../etc', 'uids' => '1'], ['table' => 'tt_content', 'uids' => 'all']];

        foreach ($asked as $query) {
            self::assertSame('', $this->urlFor($query), (string) \json_encode($query));
        }
    }

    /**
     * @param array<string, string> $query
     */
    private function urlFor(array $query): string
    {
        $answer = $this->get(OpenDocumentController::class)->url(
            (new ServerRequest('https://example.com/typo3/ajax/visual-permissions/open-document'))
                ->withQueryParams($query),
        );

        self::assertSame(200, $answer->getStatusCode());

        $said = \json_decode((string) $answer->getBody(), true);

        self::assertIsArray($said);
        self::assertArrayHasKey('url', $said);
        self::assertIsString($said['url']);

        return $said['url'];
    }
}
