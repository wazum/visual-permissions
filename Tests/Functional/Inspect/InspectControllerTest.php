<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Functional\Inspect;

use PHPUnit\Framework\Attributes\Test;
use TYPO3\CMS\Core\Http\ServerRequest;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;
use Wazum\VisualPermissions\Inspect\InspectController;

final class InspectControllerTest extends FunctionalTestCase
{
    protected array $coreExtensionsToLoad = ['beuser'];

    protected array $testExtensionsToLoad = ['wazum/visual-permissions'];

    protected function setUp(): void
    {
        parent::setUp();
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/be_users.csv');
        $this->setUpBackendUser(1);
    }

    #[Test]
    public function putsTheMountsInTheOrderTheTreeShowsThem(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/group_mounts.csv');

        $request = (new ServerRequest('https://example.com/typo3/ajax/visual-permissions/inspect'))
            ->withQueryParams(['group' => '20']);

        $response = $this->get(InspectController::class)->inspect($request);

        /** @var array{scopes: array{pageMounts:array{targets: array<string, string>, order: list<int>}}} $payload */
        $payload = json_decode((string) $response->getBody(), true);

        self::assertSame([3, 7, 5], $payload['scopes']['pageMounts']['order']);
    }

    #[Test]
    public function saysWhichMountedPagesTheGroupCannotSee(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/unseen_mounts.csv');

        $request = (new ServerRequest('https://example.com/typo3/ajax/visual-permissions/inspect'))
            ->withQueryParams(['group' => '20']);

        $response = $this->get(InspectController::class)->inspect($request);

        /** @var array{scopes: array{pageMounts:array{unseen: list<array{page: int, title: string}>}}} $payload */
        $payload = json_decode((string) $response->getBody(), true);

        self::assertSame(7, $payload['scopes']['pageMounts']['unseen'][0]['page']);
        self::assertSame('East Wing', $payload['scopes']['pageMounts']['unseen'][0]['title']);
    }

    #[Test]
    public function linksAnUnseenPageToItsPagePermissions(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/unseen_mounts.csv');

        $request = (new ServerRequest('https://example.com/typo3/ajax/visual-permissions/inspect'))
            ->withQueryParams(['group' => '20']);

        $response = $this->get(InspectController::class)->inspect($request);

        /** @var array{scopes: array{pageMounts:array{unseen: list<array{link: string}>}}} $payload */
        $payload = json_decode((string) $response->getBody(), true);

        self::assertMatchesRegularExpression('#/module/\w+/permissions\?.*id=7#', $payload['scopes']['pageMounts']['unseen'][0]['link']);
    }

    #[Test]
    public function saysNoPageIsUnseenForAGroupWithoutMounts(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/unseen_mounts.csv');

        $request = (new ServerRequest('https://example.com/typo3/ajax/visual-permissions/inspect'))
            ->withQueryParams(['group' => '21']);

        $response = $this->get(InspectController::class)->inspect($request);

        /** @var array{scopes: array{pageMounts:array{unseen: list<int>}}} $payload */
        $payload = json_decode((string) $response->getBody(), true);

        self::assertSame([], $payload['scopes']['pageMounts']['unseen']);
    }

    #[Test]
    public function reportsTheGroupAndItsChain(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/group_chain.csv');

        $request = (new ServerRequest('https://example.com/typo3/ajax/visual-permissions/inspect'))
            ->withQueryParams(['group' => '10']);

        $response = $this->get(InspectController::class)->inspect($request);

        self::assertSame(200, $response->getStatusCode());

        /** @var array{group: array{id: int, title: string}, chain: list<array{groupId: int, title: string, depth: int}>} $payload */
        $payload = json_decode((string) $response->getBody(), true);

        self::assertSame(['id' => 10, 'title' => 'Editors'], $payload['group']);
        self::assertSame([
            ['groupId' => 10, 'title' => 'Editors', 'depth' => 0],
            ['groupId' => 11, 'title' => 'Base Editors', 'depth' => 1],
            ['groupId' => 13, 'title' => 'Everyone', 'depth' => 2],
            ['groupId' => 12, 'title' => 'Reviewers', 'depth' => 1],
        ], $payload['chain']);
    }

    #[Test]
    public function reportsWhatTheGroupMayDoWithTheFieldsOfATableItIsAskedAbout(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/group_chain.csv');

        $request = (new ServerRequest('https://example.com/typo3/ajax/visual-permissions/inspect'))
            ->withQueryParams(['group' => '10', 'tables' => ['pages']]);

        $response = $this->get(InspectController::class)->inspect($request);

        /** @var array{scopes: array{fields: array{targets: array<string, string>}}} $payload */
        $payload = json_decode((string) $response->getBody(), true);
        $targets = $payload['scopes']['fields']['targets'];

        self::assertArrayHasKey('pages:title', $targets);
        self::assertSame('notApplicable', $targets['pages:title']);
        self::assertSame('denied', $targets['pages:layout']);
    }

    #[Test]
    public function namesTheSubgroupsThatGiveAField(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/fields_given_by_subgroups.csv');

        $request = (new ServerRequest('https://example.com/typo3/ajax/visual-permissions/inspect'))
            ->withQueryParams(['group' => '20', 'tables' => ['pages']]);

        $response = $this->get(InspectController::class)->inspect($request);

        /** @var array{scopes: array{fields: array{givenBy?: array<string, list<int>>}}} $payload */
        $payload = json_decode((string) $response->getBody(), true);
        $givenBy = $payload['scopes']['fields']['givenBy'] ?? [];
        ksort($givenBy);

        self::assertSame(['pages:author' => [23], 'pages:nav_title' => [21, 23]], $givenBy);
    }

    #[Test]
    public function reportsAModuleTheGroupIsGranted(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/group_chain.csv');

        $request = (new ServerRequest('https://example.com/typo3/ajax/visual-permissions/inspect'))
            ->withQueryParams(['group' => '10']);

        $response = $this->get(InspectController::class)->inspect($request);

        /** @var array{scopes: array{modules: array{targets: array<string, string>}}} $payload */
        $payload = json_decode((string) $response->getBody(), true);

        self::assertSame('allowed', $payload['scopes']['modules']['targets']['web_layout']);
    }

    // Core folds the tables a group may write into the ones it may read
    #[Test]
    public function reportsATableTheGroupMayWriteAsOneItMayReadAsWell(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/group_table_chain.csv');

        $request = (new ServerRequest('https://example.com/typo3/ajax/visual-permissions/inspect'))
            ->withQueryParams(['group' => '10']);

        $response = $this->get(InspectController::class)->inspect($request);

        /**
         * @var array{scopes: array{
         *     tablesModify: array{targets: array<string, string>},
         *     tablesSelect: array{targets: array<string, string>}
         * }} $payload
         */
        $payload = json_decode((string) $response->getBody(), true);

        self::assertSame('allowed', $payload['scopes']['tablesModify']['targets']['tt_content']);
        self::assertSame('allowed', $payload['scopes']['tablesSelect']['targets']['tt_content']);
        self::assertSame('inherited', $payload['scopes']['tablesSelect']['targets']['sys_category']);
        self::assertSame('denied', $payload['scopes']['tablesModify']['targets']['sys_category']);
    }

    #[Test]
    public function reportsAValueTheGroupMayUse(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/group_values.csv');

        $request = (new ServerRequest('https://example.com/typo3/ajax/visual-permissions/inspect'))
            ->withQueryParams(['group' => '10']);

        $response = $this->get(InspectController::class)->inspect($request);

        /** @var array{scopes: array{fieldValues: array{targets: array<string, string>}}} $payload */
        $payload = json_decode((string) $response->getBody(), true);

        self::assertSame('allowed', $payload['scopes']['fieldValues']['targets']['tt_content:CType:textmedia']);
    }

    #[Test]
    public function reportsAPageTypeTheGroupMayCreate(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/group_values.csv');

        $request = (new ServerRequest('https://example.com/typo3/ajax/visual-permissions/inspect'))
            ->withQueryParams(['group' => '10']);

        $response = $this->get(InspectController::class)->inspect($request);

        /** @var array{scopes: array{pageTypes: array{targets: array<int, string>}}} $payload */
        $payload = json_decode((string) $response->getBody(), true);

        self::assertSame('allowed', $payload['scopes']['pageTypes']['targets'][1]);
    }

    #[Test]
    public function reportsAFileOperationTheGroupMayDo(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/group_values.csv');

        $request = (new ServerRequest('https://example.com/typo3/ajax/visual-permissions/inspect'))
            ->withQueryParams(['group' => '10']);

        $response = $this->get(InspectController::class)->inspect($request);

        /** @var array{scopes: array{fileOperations: array{targets: array<string, string>}}} $payload */
        $payload = json_decode((string) $response->getBody(), true);

        self::assertSame('allowed', $payload['scopes']['fileOperations']['targets']['readFile']);
    }

    #[Test]
    public function reportsAModuleThatOnlyASubgroupGrants(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/group_chain.csv');

        $request = (new ServerRequest('https://example.com/typo3/ajax/visual-permissions/inspect'))
            ->withQueryParams(['group' => '10']);

        $response = $this->get(InspectController::class)->inspect($request);

        /** @var array{scopes: array{modules: array{targets: array<string, string>}}} $payload */
        $payload = json_decode((string) $response->getBody(), true);

        self::assertSame('inherited', $payload['scopes']['modules']['targets']['about']);
    }

    #[Test]
    public function reportsAModuleNoGroupCanBeGivenAsAdministratorsOnly(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/group_chain.csv');

        $request = (new ServerRequest('https://example.com/typo3/ajax/visual-permissions/inspect'))
            ->withQueryParams(['group' => '10']);

        $response = $this->get(InspectController::class)->inspect($request);

        /** @var array{scopes: array{modules: array{targets: array<string, string>}}} $payload */
        $payload = json_decode((string) $response->getBody(), true);
        self::assertSame('adminOnly', $payload['scopes']['modules']['targets']['site_configuration']);
    }

    #[Test]
    public function reportsNothingForAGroupThatIsNotThere(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/group_chain.csv');

        $request = (new ServerRequest('https://example.com/typo3/ajax/visual-permissions/inspect'))
            ->withQueryParams(['group' => '999']);

        $response = $this->get(InspectController::class)->inspect($request);

        self::assertSame(404, $response->getStatusCode());
    }

    #[Test]
    public function saysWhichFoldersAlreadyHaveAFileMount(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/group_file_mounts.csv');

        $request = (new ServerRequest('https://example.com/typo3/ajax/visual-permissions/inspect'))
            ->withQueryParams(['group' => '20']);

        $response = $this->get(InspectController::class)->inspect($request);

        /** @var array{scopes: array{fileMounts: array{named: array<string, string>}}} $payload */
        $payload = json_decode((string) $response->getBody(), true);

        self::assertSame(
            ['1:/campaign/' => 'Campaign', '1:/press/' => 'Press', '1:/archive/' => 'Archive'],
            $payload['scopes']['fileMounts']['named'],
        );
    }

    #[Test]
    public function namesTheTablesItWasAskedAbout(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../Fixtures/group_chain.csv');

        $request = (new ServerRequest('https://example.com/typo3/ajax/visual-permissions/inspect'))
            ->withQueryParams(['group' => '10', 'tables' => ['pages', 'sys_file_reference']])
            ->withAttribute('backend.user', $GLOBALS['BE_USER']);

        $response = $this->get(InspectController::class)->inspect($request);

        /** @var array{scopes: array{tablesModify: array{named: array<string, string>}}} $payload */
        $payload = json_decode((string) $response->getBody(), true);

        self::assertSame(
            ['pages' => 'Page', 'sys_file_reference' => 'File Reference'],
            $payload['scopes']['tablesModify']['named'],
        );
    }
}
