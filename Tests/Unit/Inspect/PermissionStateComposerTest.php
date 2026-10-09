<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Unit\Inspect;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use TYPO3\CMS\Backend\Module\Module;
use TYPO3\CMS\Backend\Module\ModuleRegistry;
use Wazum\VisualPermissions\Authorization\Verdicts;
use Wazum\VisualPermissions\GrantFields\FieldCatalogue;
use Wazum\VisualPermissions\GrantModules\ModuleCatalogue;
use Wazum\VisualPermissions\GrantTables\TableCatalogue;
use Wazum\VisualPermissions\Inspect\PermissionStateComposer;
use Wazum\VisualPermissions\Tests\ContractFixture;

final class PermissionStateComposerTest extends TestCase
{
    protected function setUp(): void
    {
        $GLOBALS['TCA'] = [];
    }

    #[Test]
    public function namesExactlyTheScopesTheContractDeclares(): void
    {
        $state = $this->composer()->compose(10, [
            10 => ['title' => 'Editors', 'subgroups' => []],
        ]);

        self::assertSame(
            ContractFixture::readList('vocabulary', 'scopes'),
            array_keys($state['scopes']),
        );
    }

    #[Test]
    public function reportsWhatTheGroupMayDoWithTheFieldsOfTheTablesItWasAskedAbout(): void
    {
        $GLOBALS['TCA'] = ['pages' => ['columns' => [
            'title' => ['config' => ['type' => 'input']],
            'layout' => ['exclude' => true, 'config' => ['type' => 'select']],
            'nav_title' => ['exclude' => true, 'config' => ['type' => 'input']],
        ]]];

        $state = $this->composer()->compose(10, [
            10 => ['title' => 'Editors', 'subgroups' => [11], 'fields' => ['pages:layout']],
            11 => ['title' => 'Everyone', 'subgroups' => [], 'fields' => ['pages:nav_title']],
        ], ['pages']);

        self::assertSame([
            'pages:title' => 'notApplicable',
            'pages:layout' => 'allowed',
            'pages:nav_title' => 'inherited',
        ], $state['scopes']['fields']['targets']);
    }

    #[Test]
    public function namesTheSubgroupsThatGiveTheFieldsOfTheTablesItWasAskedAbout(): void
    {
        $GLOBALS['TCA'] = [
            'pages' => ['columns' => ['nav_title' => ['exclude' => true, 'config' => ['type' => 'input']]]],
            'tt_content' => ['columns' => ['header' => ['exclude' => true, 'config' => ['type' => 'input']]]],
        ];

        $state = $this->composer()->compose(10, [
            10 => ['title' => 'Editors', 'subgroups' => [11]],
            11 => ['title' => 'Everyone', 'subgroups' => [], 'fields' => ['pages:nav_title', 'tt_content:header']],
        ], ['pages']);

        self::assertSame(['pages:nav_title' => 'inherited'], $state['scopes']['fields']['targets']);
        self::assertSame(['pages:nav_title' => [11]], $state['scopes']['fields']['givenBy']);
    }

    #[Test]
    public function reportsTheTablesTheGroupMayWriteAndTheOnesItMayRead(): void
    {
        $GLOBALS['TCA'] = ['pages' => [], 'tt_content' => [], 'sys_category' => []];

        $state = $this->composer()->compose(10, [
            10 => [
                'title' => 'Editors',
                'subgroups' => [11],
                'tablesModify' => ['tt_content'],
                'tablesSelect' => ['pages'],
            ],
            11 => ['title' => 'Everyone', 'subgroups' => [], 'tablesModify' => ['sys_category']],
        ]);

        self::assertSame([
            'pages' => 'denied',
            'tt_content' => 'allowed',
            'sys_category' => 'inherited',
        ], $state['scopes']['tablesModify']['targets']);

        self::assertSame([
            'pages' => 'allowed',
            'tt_content' => 'allowed',
            'sys_category' => 'inherited',
        ], $state['scopes']['tablesSelect']['targets']);
    }

    #[Test]
    public function reportsTheValuesTheGroupMayUseAndTheOnesItInherits(): void
    {
        $state = $this->composer()->compose(10, [
            10 => ['title' => 'Editors', 'subgroups' => [11], 'fieldValues' => ['tt_content:CType:textmedia']],
            11 => ['title' => 'Everyone', 'subgroups' => [], 'fieldValues' => ['tt_content:CType:header']],
        ]);

        self::assertSame([
            'tt_content:CType:textmedia' => 'allowed',
            'tt_content:CType:header' => 'inherited',
        ], $state['scopes']['fieldValues']['targets']);
    }

    #[Test]
    public function reportsThePageTypesTheGroupMayCreateAndTheOnesItInherits(): void
    {
        $state = $this->composer()->compose(10, [
            10 => ['title' => 'Editors', 'subgroups' => [11], 'pageTypes' => ['1']],
            11 => ['title' => 'Everyone', 'subgroups' => [], 'pageTypes' => ['254']],
        ]);

        self::assertSame(['1' => 'allowed', '254' => 'inherited'], $state['scopes']['pageTypes']['targets']);
    }

    #[Test]
    public function reportsTheFileOperationsTheGroupMayDoAndTheOnesItInherits(): void
    {
        $state = $this->composer()->compose(10, [
            10 => ['title' => 'Editors', 'subgroups' => [11], 'fileOperations' => ['readFile']],
            11 => ['title' => 'Everyone', 'subgroups' => [], 'fileOperations' => ['readFolder']],
        ]);

        self::assertSame(['readFile' => 'allowed', 'readFolder' => 'inherited'], $state['scopes']['fileOperations']['targets']);
    }

    #[Test]
    public function reportsTheFieldsOfEveryTableItWasAskedAbout(): void
    {
        $GLOBALS['TCA'] = [
            'pages' => ['columns' => ['layout' => ['exclude' => true]]],
            'tt_content' => ['columns' => ['header' => ['exclude' => true]]],
        ];

        $state = $this->composer()->compose(10, [
            10 => ['title' => 'Editors', 'subgroups' => [], 'fields' => ['tt_content:header']],
        ], ['pages', 'tt_content']);

        self::assertSame([
            'pages:layout' => 'denied',
            'tt_content:header' => 'allowed',
        ], $state['scopes']['fields']['targets']);
    }

    #[Test]
    public function reportsNoFieldOfATableItWasNotAskedAbout(): void
    {
        $GLOBALS['TCA'] = [
            'pages' => ['columns' => ['layout' => ['exclude' => true]]],
            'tt_content' => ['columns' => ['header' => ['exclude' => true]]],
        ];

        $state = $this->composer()->compose(10, [
            10 => ['title' => 'Editors', 'subgroups' => [], 'fields' => ['pages:layout', 'tt_content:header']],
        ], ['pages']);

        self::assertSame(['pages:layout' => 'allowed'], $state['scopes']['fields']['targets']);
    }

    #[Test]
    public function reportsTheGroupWithItsChain(): void
    {
        $state = $this->composer()->compose(10, [
            10 => ['title' => 'Editors', 'subgroups' => [11]],
            11 => ['title' => 'Everyone', 'subgroups' => []],
        ]);

        self::assertSame(['id' => 10, 'title' => 'Editors'], $state['group']);
        self::assertSame([
            ['groupId' => 10, 'title' => 'Editors', 'depth' => 0],
            ['groupId' => 11, 'title' => 'Everyone', 'depth' => 1],
        ], $state['chain']);
    }

    #[Test]
    public function reportsNoFieldsWhenAskedAboutNoTable(): void
    {
        $state = $this->composer()->compose(10, [
            10 => ['title' => 'Editors', 'subgroups' => []],
        ]);

        self::assertSame([], $state['scopes']['fields']['targets']);
    }

    #[Test]
    public function reportsWhatTheGroupMayDoWithTheBackendModules(): void
    {
        $state = $this->composerKnowing(
            Module::createFromConfiguration('web_layout', ['access' => 'user', 'path' => '/module/web_layout']),
            Module::createFromConfiguration('site_configuration', ['access' => 'admin', 'path' => '/module/site']),
        )->compose(10, [
            10 => ['title' => 'Editors', 'subgroups' => [11], 'modules' => ['web_layout']],
            11 => ['title' => 'Everyone', 'subgroups' => []],
        ]);

        self::assertSame([
            'web_layout' => 'allowed',
            'site_configuration' => 'adminOnly',
        ], $state['scopes']['modules']['targets']);
    }

    #[Test]
    public function reportsThePagesTheGroupMounts(): void
    {
        $state = $this->composer()->compose(20, [
            20 => ['title' => 'Editorial Lead', 'subgroups' => [21], 'pageMounts' => [3, 5]],
            21 => ['title' => 'Editors', 'subgroups' => [], 'pageMounts' => [7]],
        ]);

        self::assertSame([
            3 => 'allowed',
            5 => 'allowed',
            7 => 'inherited',
        ], $state['scopes']['pageMounts']['targets']);
    }

    #[Test]
    public function reportsTheFoldersTheGroupMounts(): void
    {
        $state = $this->composer()->compose(20, [
            20 => ['title' => 'Editorial Lead', 'subgroups' => [21], 'fileMounts' => ['1:/campaign/']],
            21 => ['title' => 'Editors', 'subgroups' => [], 'fileMounts' => ['1:/press/']],
        ]);

        self::assertSame([
            '1:/campaign/' => 'allowed',
            '1:/press/' => 'inherited',
        ], $state['scopes']['fileMounts']['targets']);
    }

    private function composer(): PermissionStateComposer
    {
        return $this->composerKnowing();
    }

    private function composerKnowing(Module ...$modules): PermissionStateComposer
    {
        return new PermissionStateComposer(
            new Verdicts(),
            new FieldCatalogue(),
            new ModuleCatalogue(new ModuleRegistry($modules)),
            new TableCatalogue(),
        );
    }
}
