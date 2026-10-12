<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Functional\Surfaces\RecordForm;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use TYPO3\CMS\Backend\Form\FormDataCompiler;
use TYPO3\CMS\Backend\Form\FormDataGroup\TcaDatabaseRecord;
use TYPO3\CMS\Core\Authentication\BackendUserAuthentication;
use TYPO3\CMS\Core\Core\SystemEnvironmentBuilder;
use TYPO3\CMS\Core\Http\ServerRequest;
use TYPO3\CMS\Core\Localization\LanguageServiceFactory;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;

final class SwitchedValuesTest extends FunctionalTestCase
{
    protected array $coreExtensionsToLoad = ['beuser'];

    protected array $testExtensionsToLoad = ['wazum/visual-permissions'];

    protected function setUp(): void
    {
        parent::setUp();
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/be_users.csv');
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/pages.csv');
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/tt_content.csv');
    }

    #[Test]
    public function drawsTheFormForTheTypeTheAdminSwitchedTo(): void
    {
        $this->signIn(modeOn: true);

        self::assertSame('textmedia', $this->formFor(['tt_content' => [1 => ['CType' => 'textmedia']]])['recordTypeValue']);
    }

    #[Test]
    public function drawsTheStoredTypeWhileTheModeIsOff(): void
    {
        $this->signIn(modeOn: false);

        self::assertSame('text', $this->formFor(['tt_content' => [1 => ['CType' => 'textmedia']]])['recordTypeValue']);
    }

    #[Test]
    public function keepsTheStoredValueOfAFieldThatDoesNotReloadTheForm(): void
    {
        $this->signIn(modeOn: true);

        self::assertSame('Lorem ipsum', $this->formFor(['tt_content' => [1 => ['header' => 'Changed']]])['databaseRow']['header']);
    }

    #[Test]
    public function switchesAnyFieldThatReloadsTheForm(): void
    {
        $this->signIn(modeOn: true);
        /** @var array<string, array{columns: array<string, array<string, mixed>>}> $tableConfigurations */
        $tableConfigurations = $GLOBALS['TCA'];
        $tableConfigurations['tt_content']['columns']['header']['onChange'] = 'reload';
        $GLOBALS['TCA'] = $tableConfigurations;

        self::assertSame('Changed', $this->formFor(['tt_content' => [1 => ['header' => 'Changed']]])['databaseRow']['header']);
    }

    #[Test]
    public function drawsAFormBuiltFromARequestWithoutAUser(): void
    {
        $this->signIn(modeOn: true);

        self::assertSame('textmedia', $this->formFor(['tt_content' => [1 => ['CType' => 'textmedia']]], carriesUser: false)['recordTypeValue']);
    }

    /**
     * @return array<string, array{mixed}>
     */
    public static function switchesThatAreNoValue(): array
    {
        return [
            'a record named without its fields' => [['tt_content' => [1 => 'textmedia']]],
            'a value that is a list' => [['tt_content' => [1 => ['CType' => ['textmedia']]]]],
        ];
    }

    #[Test]
    #[DataProvider('switchesThatAreNoValue')]
    public function drawsTheStoredTypeForASwitchThatIsNoValue(mixed $switched): void
    {
        $this->signIn(modeOn: true);

        self::assertSame('text', $this->formFor($switched)['recordTypeValue']);
    }

    private function signIn(bool $modeOn): BackendUserAuthentication
    {
        $backendUser = $this->setUpBackendUser(1);
        if ($modeOn) {
            $backendUser->uc = array_replace_recursive($backendUser->uc, ['vperm' => ['session' => ['active' => 'true']]]);
        }

        $GLOBALS['LANG'] = $this->get(LanguageServiceFactory::class)->createFromUserPreferences($backendUser);

        return $backendUser;
    }

    /**
     * @return array{recordTypeValue: string, databaseRow: array<string, mixed>}
     */
    private function formFor(mixed $switched, bool $carriesUser = true): array
    {
        $request = (new ServerRequest('https://example.com/typo3/record/edit'))
            ->withAttribute('applicationType', SystemEnvironmentBuilder::REQUESTTYPE_BE)
            ->withQueryParams(['vperm' => ['value' => $switched]]);
        if ($carriesUser) {
            $request = $request->withAttribute('backend.user', $GLOBALS['BE_USER']);
        }

        /** @var array{recordTypeValue: string, databaseRow: array<string, mixed>} $formData */
        $formData = $this->get(FormDataCompiler::class)->compile(
            [
                'request' => $request,
                'tableName' => 'tt_content',
                'vanillaUid' => 1,
                'command' => 'edit',
            ],
            $this->get(TcaDatabaseRecord::class),
        );

        return $formData;
    }
}
