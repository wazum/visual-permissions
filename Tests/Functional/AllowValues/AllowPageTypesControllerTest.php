<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Functional\AllowValues;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use TYPO3\CMS\Core\Http\ServerRequest;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;
use Wazum\VisualPermissions\AllowValues\AllowPageTypesController;
use Wazum\VisualPermissions\AllowValues\ValueChoices;
use Wazum\VisualPermissions\Authorization\Scope;
use Wazum\VisualPermissions\BackendGroups\BackendGroups;

final class AllowPageTypesControllerTest extends FunctionalTestCase
{
    protected array $coreExtensionsToLoad = ['beuser'];

    protected array $testExtensionsToLoad = ['wazum/visual-permissions'];

    #[Test]
    public function appliesWhatWasCollected(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/group_values.csv');
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_users.csv');
        $this->setUpBackendUser(1);

        $response = $this->get(AllowPageTypesController::class)->write($this->asked([
            'group' => 10,
            'operations' => [
                ['value' => '254', 'grant' => true],
                ['value' => '1', 'grant' => false],
            ],
        ]));

        self::assertSame(204, $response->getStatusCode());
        self::assertSame(['254'], $this->get(BackendGroups::class)->listOf(10, Scope::PageTypes));
    }

    /**
     * @return array<string, array{string}>
     */
    public static function pageTypesNoGroupCanBeGiven(): array
    {
        return [
            'one that is not there' => ['9999'],
            'a divider' => [ValueChoices::DIVIDER],
        ];
    }

    #[Test]
    #[DataProvider('pageTypesNoGroupCanBeGiven')]
    public function refusesToGrantAPageType(string $pageType): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/group_values.csv');
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_users.csv');
        $this->setUpBackendUser(1);
        /** @var array{pages: array{columns: array{doktype: array{config: array{items: list<array<string, string>>}}}}} $tableConfigurations */
        $tableConfigurations = $GLOBALS['TCA'];
        $tableConfigurations['pages']['columns']['doktype']['config']['items'][] = ['label' => 'More', 'value' => ValueChoices::DIVIDER];
        $GLOBALS['TCA'] = $tableConfigurations;

        $response = $this->get(AllowPageTypesController::class)->write($this->asked([
            'group' => 10,
            'operations' => [['value' => $pageType, 'grant' => true]],
        ]));

        self::assertSame(400, $response->getStatusCode());
    }

    /**
     * @param array<string, mixed> $body
     */
    private function asked(array $body): ServerRequest
    {
        return (new ServerRequest('https://example.com/typo3/ajax/visual-permissions/allow-page-types', 'POST'))
            ->withParsedBody($body);
    }
}
