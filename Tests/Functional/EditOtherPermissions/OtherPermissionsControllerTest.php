<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Functional\EditOtherPermissions;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use TYPO3\CMS\Core\Authentication\BackendUserAuthentication;
use TYPO3\CMS\Core\Http\ServerRequest;
use TYPO3\CMS\Core\Localization\LanguageServiceFactory;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;
use Wazum\VisualPermissions\EditOtherPermissions\OtherPermissionsController;
use Wazum\VisualPermissions\Tests\Functional\Fixtures\VetoTheWrite;

final class OtherPermissionsControllerTest extends FunctionalTestCase
{
    protected array $coreExtensionsToLoad = ['beuser'];

    protected array $testExtensionsToLoad = ['wazum/visual-permissions'];

    protected function setUp(): void
    {
        parent::setUp();
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_users.csv');
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/group_chain.csv');
        $this->setUpBackendUser(1);
        $this->speakTheUsersLanguage();
    }

    #[Test]
    public function rendersTheGroupsOwnFieldForItsTypoScript(): void
    {
        $request = (new ServerRequest('https://example.com/typo3/ajax/visual-permissions/other-permissions'))
            ->withQueryParams(['group' => '10']);

        $response = $this->get(OtherPermissionsController::class)->form($request);

        /** @var array{html: string} $payload */
        $payload = json_decode((string) $response->getBody(), true);

        self::assertStringContainsString('data[be_groups][10][TSconfig]', $payload['html']);
    }

    #[Test]
    public function rendersTheColumnsNoOtherTabShows(): void
    {
        $request = (new ServerRequest('https://example.com/typo3/ajax/visual-permissions/other-permissions'))
            ->withQueryParams(['group' => '10']);

        $response = $this->get(OtherPermissionsController::class)->form($request);

        /** @var array{html: string} $payload */
        $payload = json_decode((string) $response->getBody(), true);

        self::assertStringContainsString('data[be_groups][10][subgroup]', $payload['html']);
        self::assertStringContainsString('data[be_groups][10][hidden]', $payload['html']);
        self::assertStringNotContainsString('data[be_groups][10][groupMods]', $payload['html']);
        self::assertStringNotContainsString('data[be_groups][10][db_mountpoints]', $payload['html']);
        self::assertStringNotContainsString('data[be_groups][10][non_exclude_fields]', $payload['html']);
    }

    #[Test]
    public function putsWhetherTheGroupIsEnabledFirst(): void
    {
        $request = (new ServerRequest('https://example.com/typo3/ajax/visual-permissions/other-permissions'))
            ->withQueryParams(['group' => '10']);

        $response = $this->get(OtherPermissionsController::class)->form($request);

        /** @var array{html: string} $payload */
        $payload = json_decode((string) $response->getBody(), true);

        self::assertLessThan(
            strpos($payload['html'], 'data[be_groups][10][subgroup]'),
            strpos($payload['html'], 'data[be_groups][10][hidden]'),
        );
    }

    #[Test]
    public function namesTheModulesTheFieldsNeed(): void
    {
        $request = (new ServerRequest('https://example.com/typo3/ajax/visual-permissions/other-permissions'))
            ->withQueryParams(['group' => '10']);

        $response = $this->get(OtherPermissionsController::class)->form($request);

        /** @var array{scriptItems: list<mixed>} $payload */
        $payload = json_decode((string) $response->getBody(), true);

        self::assertStringContainsString(
            '@typo3/backend/form-engine/element/select-multiple-side-by-side-element.js',
            json_encode($payload['scriptItems'], JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES),
        );
    }

    #[Test]
    public function setsUpWhatTheFieldsModulesLookFor(): void
    {
        $request = (new ServerRequest('https://example.com/typo3/ajax/visual-permissions/other-permissions'))
            ->withQueryParams(['group' => '10']);

        $response = $this->get(OtherPermissionsController::class)->form($request);

        /** @var array{scriptItems: list<mixed>} $payload */
        $payload = json_decode((string) $response->getBody(), true);
        $items = json_encode($payload['scriptItems'], JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES);

        self::assertStringContainsString('"formName":"editform"', $items);
        self::assertStringContainsString('@typo3/backend/form-engine.js', $items);
    }

    #[Test]
    public function writesAChangedValueToTheGroupRecord(): void
    {
        $request = (new ServerRequest('https://example.com/typo3/ajax/visual-permissions/write-other-permissions'))
            ->withParsedBody([
                'group' => '10',
                'data' => ['be_groups' => ['10' => ['TSconfig' => 'options.saveDocNew = 1']]],
            ]);

        $response = $this->get(OtherPermissionsController::class)->write($request);

        self::assertSame(204, $response->getStatusCode());
        self::assertSame(
            'options.saveDocNew = 1',
            $this->getConnectionPool()
                ->getConnectionForTable('be_groups')
                ->fetchOne('SELECT TSconfig FROM be_groups WHERE uid = 10'),
        );
    }

    /**
     * @return array<string, array{mixed}>
     */
    public static function formsThatCarryNothingToWrite(): array
    {
        return [
            'only another group' => [['be_groups' => ['10' => ['TSconfig' => 'options.saveDocNew = 1']]]],
            'words for the group' => [['be_groups' => ['11' => 'TSconfig']]],
            'words for the table' => [['be_groups' => 'TSconfig']],
            'words for the data' => ['TSconfig'],
        ];
    }

    #[Test]
    #[DataProvider('formsThatCarryNothingToWrite')]
    public function refusesAFormThatCarriesNothingOfTheGroupItNames(mixed $data): void
    {
        $request = (new ServerRequest('https://example.com/typo3/ajax/visual-permissions/write-other-permissions'))
            ->withParsedBody(['group' => '11', 'data' => $data]);

        $response = $this->get(OtherPermissionsController::class)->write($request);

        self::assertSame(400, $response->getStatusCode());
    }

    #[Test]
    public function writesNoColumnThisTabDoesNotOwn(): void
    {
        $request = (new ServerRequest('https://example.com/typo3/ajax/visual-permissions/write-other-permissions'))
            ->withParsedBody([
                'group' => '10',
                'data' => ['be_groups' => ['10' => [
                    'TSconfig' => 'options.saveDocNew = 1',
                    'groupMods' => 'web_list',
                ]]],
            ]);

        $this->get(OtherPermissionsController::class)->write($request);

        self::assertSame(
            'web_layout',
            $this->getConnectionPool()
                ->getConnectionForTable('be_groups')
                ->fetchOne('SELECT groupMods FROM be_groups WHERE uid = 10'),
        );
    }

    #[Test]
    public function refusesAWriteToAGroupThatIsNotThere(): void
    {
        $request = (new ServerRequest('https://example.com/typo3/ajax/visual-permissions/write-other-permissions'))
            ->withParsedBody([
                'group' => '99',
                'data' => ['be_groups' => ['99' => ['TSconfig' => 'options.saveDocNew = 1']]],
            ]);

        $response = $this->get(OtherPermissionsController::class)->write($request);

        self::assertSame(404, $response->getStatusCode());
    }

    #[Test]
    public function saysSoWhenTheBackendRefusedTheWrite(): void
    {
        VetoTheWrite::register();

        $request = (new ServerRequest('https://example.com/typo3/ajax/visual-permissions/write-other-permissions'))
            ->withParsedBody([
                'group' => '10',
                'data' => ['be_groups' => ['10' => ['TSconfig' => 'options.saveDocNew = 1']]],
            ]);

        $response = $this->get(OtherPermissionsController::class)->write($request);

        self::assertSame(409, $response->getStatusCode());
        self::assertNull(
            $this->getConnectionPool()
                ->getConnectionForTable('be_groups')
                ->fetchOne('SELECT TSconfig FROM be_groups WHERE uid = 10'),
        );
    }

    #[Test]
    public function refusesAGroupThatIsNotThere(): void
    {
        $request = (new ServerRequest('https://example.com/typo3/ajax/visual-permissions/other-permissions'))
            ->withQueryParams(['group' => '99']);

        $response = $this->get(OtherPermissionsController::class)->form($request);

        self::assertSame(404, $response->getStatusCode());
    }

    private function speakTheUsersLanguage(): void
    {
        $backendUser = $GLOBALS['BE_USER'];

        self::assertInstanceOf(BackendUserAuthentication::class, $backendUser);

        $GLOBALS['LANG'] = $this->get(LanguageServiceFactory::class)
            ->createFromUserPreferences($backendUser);
    }
}
