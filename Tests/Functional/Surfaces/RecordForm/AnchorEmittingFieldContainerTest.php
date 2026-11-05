<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Functional\Surfaces\RecordForm;

use PHPUnit\Framework\Attributes\Test;
use TYPO3\CMS\Backend\Form\FormDataCompiler;
use TYPO3\CMS\Backend\Form\FormDataGroup\TcaDatabaseRecord;
use TYPO3\CMS\Backend\Form\NodeFactory;
use TYPO3\CMS\Backend\Routing\Route;
use TYPO3\CMS\Core\Core\SystemEnvironmentBuilder;
use TYPO3\CMS\Core\Http\ServerRequest;
use TYPO3\CMS\Core\Localization\LanguageServiceFactory;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;
use Wazum\VisualPermissions\AllowValues\ValueChoices;
use Wazum\VisualPermissions\Tests\Functional\Fixtures\LabellessElement;

final class AnchorEmittingFieldContainerTest extends FunctionalTestCase
{
    protected array $coreExtensionsToLoad = ['beuser'];

    protected array $testExtensionsToLoad = ['wazum/visual-permissions'];

    #[Test]
    public function marksAFieldWithTheTokenThatNamesIt(): void
    {
        $html = $this->renderField('pages', 1, 'title');

        self::assertStringContainsString('data-vperm-token="pages:title"', $html);
    }

    #[Test]
    public function namesTheTableOfTheRecordTheFieldBelongsToNotTheFormItWasOpenedFor(): void
    {
        $html = $this->renderField('sys_file_reference', 1, 'title');

        self::assertStringContainsString('data-vperm-token="sys_file_reference:title"', $html);
    }

    // The same token is drawn once per record on a form, so only the record tells them apart
    #[Test]
    public function namesTheRecordTheFieldIsDrawnFor(): void
    {
        $html = $this->renderField('sys_file_reference', 1, 'title');

        self::assertStringContainsString('data-vperm-field="sys_file_reference-1-title"', $html);
    }

    // Core draws a record of another table inside the field that holds it, and says which
    #[Test]
    public function namesTheFieldTheRecordIsHeldBy(): void
    {
        $html = $this->renderField('sys_file_reference', 1, 'title', [
            'inlineParentTableName' => 'tt_content',
            'inlineParentUid' => 82,
            'inlineParentFieldName' => 'assets',
        ]);

        self::assertStringContainsString('data-vperm-inside="tt_content-82-assets"', $html);
    }

    // A file record is drawn with the fields of its own kind of file, and a video has more
    #[Test]
    public function listsAfterAFieldHoldingRecordsTheFieldsEveryKindOfThemCanShow(): void
    {
        $html = $this->renderField('pages', 1, 'media');

        self::assertStringContainsString('class="vperm-other-kinds"', $html);
        self::assertStringContainsString('data-vperm-token="sys_file_reference:autoplay"', $html);
    }

    #[Test]
    public function namesTheFieldThoseFieldsOfOtherKindsAreHeldBy(): void
    {
        $html = $this->renderField('pages', 1, 'media');
        $listed = substr($html, (int) strpos($html, 'vperm-other-kinds'));

        self::assertStringContainsString('data-vperm-token="sys_file_reference:autoplay" data-vperm-field="sys_file_reference--autoplay" data-vperm-inside="pages-1-media"', $listed);
    }

    // A text file is drawn with the fields text files show, so those are not listed again
    #[Test]
    public function listsNoFieldTheKindOfRecordTheFieldHoldsShows(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/file_storage.csv');
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/page_media.csv');

        $html = $this->renderField('pages', 1, 'media');
        $listed = substr($html, (int) strpos($html, 'vperm-other-kinds'));

        self::assertStringNotContainsString('data-vperm-token="sys_file_reference:title"', $listed);
        self::assertStringContainsString('data-vperm-token="sys_file_reference:autoplay"', $listed);
    }

    #[Test]
    public function saysWhichListAllowsTheValuesOfAFieldThatAsksForThem(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/tt_content.csv');

        $html = $this->renderField('tt_content', 1, 'CType');

        self::assertStringContainsString('data-vperm-allows="fieldValues"', $html);
    }

    #[Test]
    public function namesTheChoiceOfPageContentTypesAfterWhatTheGroupMayUse(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/tt_content.csv');

        $choices = $this->choicesOf($this->renderField('tt_content', 1, 'CType'));

        self::assertSame('Die Seiten-Inhaltstypen, die die Gruppe „%s“ verwenden darf', $choices['title']);
    }

    #[Test]
    public function listsEachPageContentTypeInTheGroupTheFormShowsItIn(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/tt_content.csv');

        $choices = $this->choicesOf($this->renderField('tt_content', 1, 'CType'));

        self::assertContains(
            ['value' => 'textmedia', 'label' => 'Text & Media', 'icon' => 'mimetypes-x-content-text-media'],
            array_column($choices['groups'], 'values', 'label')['Typical page content'],
        );
    }

    #[Test]
    public function listsNoHeadingOfTheFieldAsAValue(): void
    {
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/tt_content.csv');

        $choices = $this->choicesOf($this->renderField('tt_content', 1, 'CType'));

        self::assertNotContains(ValueChoices::DIVIDER, array_column(array_merge(...array_column($choices['groups'], 'values')), 'value'));
    }

    #[Test]
    public function namesTheChoiceOfPageTypesAfterWhatTheGroupMayCreate(): void
    {
        $choices = $this->choicesOf($this->renderField('pages', 1, 'doktype'));

        self::assertSame('Die Seitentypen, die die Gruppe „%s“ anlegen darf', $choices['title']);
    }

    #[Test]
    public function saysThePageTypesListAllowsTheTypeOfAPage(): void
    {
        $html = $this->renderField('pages', 1, 'doktype');

        self::assertStringContainsString('data-vperm-allows="pageTypes"', $html);
    }

    // The mark and the field's name stand on its label, and some elements draw none of their own
    #[Test]
    public function namesAFieldWhoseElementDrawsNoLabelOfItsOwn(): void
    {
        $this->addLabellessReport();

        $html = $this->renderField('pages', 1, 'tx_report');

        self::assertStringContainsString('<label class="form-label">Report</label>', $html);
    }

    #[Test]
    public function leavesTheLabelOfAFieldThatDrawsItsOwn(): void
    {
        $html = $this->renderField('pages', 1, 'title');

        self::assertSame(1, substr_count($html, 'form-label'));
    }

    #[Test]
    public function namesNoSuchFieldForAnEditor(): void
    {
        $this->addLabellessReport();

        $html = $this->renderField('pages', 1, 'tx_report', [], 2);

        self::assertStringNotContainsString('form-label', $html);
    }

    // Only an administrator gives permissions away; an editor's form stays as core draws it
    #[Test]
    public function listsNoFieldsOfOtherKindsForAnEditor(): void
    {
        $html = $this->renderField('pages', 1, 'media', [], 2);

        self::assertStringNotContainsString('vperm-other-kinds', $html);
    }

    /**
     * @return array{title: string, groups: list<array{label: string, values: list<array{value: string, label: string, icon: string}>}>}
     */
    private function choicesOf(string $html): array
    {
        preg_match('/data-vperm-choices="([^"]*)"/', $html, $found);
        /** @var array{title: string, groups: list<array{label: string, values: list<array{value: string, label: string, icon: string}>}>} $choices */
        $choices = json_decode(html_entity_decode($found[1] ?? '{}', ENT_QUOTES), true);

        return $choices;
    }

    // An extension's field whose element draws a report and no label of its own
    private function addLabellessReport(): void
    {
        /** @var array{pages: array{columns: array<string, mixed>, types: array{1: array{showitem: string}}}} $tca */
        $tca = $GLOBALS['TCA'];
        $tca['pages']['columns']['tx_report'] = [
            'exclude' => true,
            'label' => 'Report',
            'config' => ['type' => 'user', 'renderType' => 'labellessReport'],
        ];
        $tca['pages']['types'][1]['showitem'] .= ',tx_report';
        $GLOBALS['TCA'] = $tca;

        /** @var array{SYS: array{formEngine: array{nodeRegistry: array<int, mixed>}}} $configuration */
        $configuration = $GLOBALS['TYPO3_CONF_VARS'];
        $configuration['SYS']['formEngine']['nodeRegistry'][1790000000] = [
            'nodeName' => 'labellessReport',
            'priority' => 40,
            'class' => LabellessElement::class,
        ];
        $GLOBALS['TYPO3_CONF_VARS'] = $configuration;
    }

    /**
     * @param array<string, mixed> $inline
     */
    private function renderField(string $table, int $uid, string $fieldName, array $inline = [], int $renderedFor = 1): string
    {
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/be_users.csv');
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/pages.csv');
        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/sys_file_reference.csv');
        $backendUser = $this->setUpBackendUser(1);
        $GLOBALS['LANG'] = GeneralUtility::makeInstance(LanguageServiceFactory::class)
            ->createFromUserPreferences($backendUser);

        $request = (new ServerRequest('https://example.com/typo3/record/edit'))
            ->withAttribute('applicationType', SystemEnvironmentBuilder::REQUESTTYPE_BE)
            ->withAttribute('route', new Route('/record/edit', ['_identifier' => 'record_edit']));

        $formData = $this->get(FormDataCompiler::class)->compile(
            [
                'request' => $request,
                'tableName' => $table,
                'vanillaUid' => $uid,
                'command' => 'edit',
            ],
            $this->get(TcaDatabaseRecord::class),
        );

        $formData = array_merge($formData, $inline);
        $formData['renderType'] = 'singleFieldContainer';
        $formData['fieldName'] = $fieldName;
        $this->setUpBackendUser($renderedFor);

        /** @var array{html: string} $result */
        $result = $this->get(NodeFactory::class)->create($formData)->render();

        return $result['html'];
    }
}
