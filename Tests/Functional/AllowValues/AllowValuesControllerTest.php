<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Functional\AllowValues;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use TYPO3\CMS\Core\Http\ServerRequest;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;
use Wazum\VisualPermissions\AllowValues\AllowValuesController;
use Wazum\VisualPermissions\AllowValues\ValueChoices;
use Wazum\VisualPermissions\Authorization\Scope;
use Wazum\VisualPermissions\BackendGroups\BackendGroups;

final class AllowValuesControllerTest extends FunctionalTestCase
{
    protected array $coreExtensionsToLoad = ['beuser'];

    protected array $testExtensionsToLoad = ['wazum/visual-permissions'];

    #[Test]
    public function appliesWhatWasCollected(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/group_values.csv');
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_users.csv');
        $this->setUpBackendUser(1);

        $response = $this->get(AllowValuesController::class)->write($this->asked([
            'group' => 10,
            'operations' => [
                ['value' => 'tt_content:CType:header', 'grant' => true],
                ['value' => 'tt_content:CType:textmedia', 'grant' => false],
            ],
        ]));

        self::assertSame(204, $response->getStatusCode());
        self::assertSame(['tt_content:CType:header'], $this->get(BackendGroups::class)->listOf(10, Scope::FieldValues));
    }

    /**
     * @return array<string, array{string}>
     */
    public static function valuesNoGroupCanBeGiven(): array
    {
        return [
            'of a field that allows none' => ['pages:title:anything'],
            'without a value' => ['tt_content:CType'],
            'with an empty value' => ['tt_content:CType:'],
            'that the field does not offer' => ['tt_content:CType:nonsense'],
            'a divider' => ['tt_content:CType:' . ValueChoices::DIVIDER],
        ];
    }

    #[Test]
    #[DataProvider('valuesNoGroupCanBeGiven')]
    public function refusesToGrantAValue(string $value): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/group_values.csv');
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_users.csv');
        $this->setUpBackendUser(1);

        $response = $this->get(AllowValuesController::class)->write($this->asked([
            'group' => 10,
            'operations' => [['value' => $value, 'grant' => true]],
        ]));

        self::assertSame(400, $response->getStatusCode());
    }

    #[Test]
    public function refusesToGrantAValueOfAFieldInAModeCoreDoesNotSupport(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/group_values.csv');
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_users.csv');
        $this->setUpBackendUser(1);
        /** @var array{tt_content: array{columns: array{CType: array{config: array<string, mixed>}}}} $tableConfigurations */
        $tableConfigurations = $GLOBALS['TCA'];
        $tableConfigurations['tt_content']['columns']['CType']['config']['authMode'] = 'explicitDeny';
        $GLOBALS['TCA'] = $tableConfigurations;

        $response = $this->get(AllowValuesController::class)->write($this->asked([
            'group' => 10,
            'operations' => [['value' => 'tt_content:CType:header', 'grant' => true]],
        ]));

        self::assertSame(400, $response->getStatusCode());
    }

    /**
     * @param array<string, mixed> $body
     */
    private function asked(array $body): ServerRequest
    {
        return (new ServerRequest('https://example.com/typo3/ajax/visual-permissions/allow-values', 'POST'))
            ->withParsedBody($body);
    }
}
