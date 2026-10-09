<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Unit\AllowValues;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use TYPO3\CMS\Core\Localization\LanguageService;
use Wazum\VisualPermissions\AllowValues\ValueChoices;

final class ValueChoicesTest extends TestCase
{
    #[Test]
    public function listsEachValueInTheGroupTheFieldShowsItIn(): void
    {
        $choices = $this->choices()->of('fieldValues', [
            'items' => [
                ['label' => 'Text & Media', 'value' => 'textmedia', 'icon' => 'content-textmedia', 'group' => 'default'],
                ['label' => 'Bullet List', 'value' => 'bullets', 'icon' => 'content-bullets', 'group' => 'lists'],
            ],
            'itemGroups' => ['default' => 'LLL:typical', 'lists' => 'LLL:lists'],
        ]);

        self::assertSame([
            ['label' => 'translated LLL:typical', 'values' => [['value' => 'textmedia', 'label' => 'Text & Media', 'icon' => 'content-textmedia']]],
            ['label' => 'translated LLL:lists', 'values' => [['value' => 'bullets', 'label' => 'Bullet List', 'icon' => 'content-bullets']]],
        ], $choices['groups']);
    }

    #[Test]
    public function listsNoHeadingOfTheFieldAsAValue(): void
    {
        $choices = $this->choices()->of('fieldValues', [
            'items' => [
                ['label' => 'Typical page content', 'value' => ValueChoices::DIVIDER, 'icon' => '', 'group' => 'default'],
                ['label' => 'Text & Media', 'value' => 'textmedia', 'icon' => 'content-textmedia', 'group' => 'default'],
            ],
        ]);

        self::assertSame(['textmedia'], array_column($choices['groups'][0]['values'] ?? [], 'value'));
    }

    #[Test]
    public function givesAValueThatIsANumberAsText(): void
    {
        $choices = $this->choices()->of('pageTypes', [
            'items' => [['label' => 'Standard', 'value' => 1, 'icon' => 'apps-pagetree-page-default', 'group' => 'default']],
        ]);

        self::assertSame(['1'], array_column($choices['groups'][0]['values'] ?? [], 'value'));
    }

    #[Test]
    public function namesTheChoiceOfPageTypesAfterWhatTheGroupMayCreate(): void
    {
        self::assertSame(
            'translated LLL:EXT:visual_permissions/Resources/Private/Language/locallang.xlf:allowedValues.title.pageTypes',
            $this->choices()->of('pageTypes', [])['title'],
        );
    }

    #[Test]
    public function namesTheChoiceOfFieldValuesAfterWhatTheGroupMayUse(): void
    {
        self::assertSame(
            'translated LLL:EXT:visual_permissions/Resources/Private/Language/locallang.xlf:allowedValues.title.fieldValues',
            $this->choices()->of('fieldValues', [])['title'],
        );
    }

    #[Test]
    public function keepsEveryValueOfAGroup(): void
    {
        $choices = $this->choices()->of('fieldValues', [
            'items' => [
                ['label' => 'Header Only', 'value' => 'header', 'icon' => 'content-header', 'group' => 'default'],
                ['label' => 'Text & Media', 'value' => 'textmedia', 'icon' => 'content-textmedia', 'group' => 'default'],
            ],
        ]);

        self::assertSame(['header', 'textmedia'], array_column($choices['groups'][0]['values'] ?? [], 'value'));
    }

    #[Test]
    public function startsAGroupAtEachHeadingOfTheField(): void
    {
        $choices = $this->choices()->of('fileOperations', [
            'items' => [
                ['label' => 'Directory', 'value' => ValueChoices::DIVIDER],
                ['label' => 'Directory: Read', 'value' => 'readFolder', 'icon' => 'apps-filetree-folder-default'],
                ['label' => 'Files', 'value' => ValueChoices::DIVIDER],
                ['label' => 'Files: Read', 'value' => 'readFile', 'icon' => 'mimetypes-other-other'],
            ],
        ]);

        self::assertSame(
            ['Directory' => ['readFolder'], 'Files' => ['readFile']],
            array_map(
                static fn(array $values): array => array_column($values, 'value'),
                array_column($choices['groups'], 'values', 'label'),
            ),
        );
    }

    #[Test]
    public function translatesTheLabelOfEachValue(): void
    {
        $choices = $this->choices()->of('fileOperations', [
            'items' => [['label' => 'LLL:files_read', 'value' => 'readFile', 'icon' => 'mimetypes-other-other']],
        ]);

        self::assertSame(['translated LLL:files_read'], array_column($choices['groups'][0]['values'] ?? [], 'label'));
    }

    #[Test]
    public function namesTheChoiceOfFileOperationsAfterWhatTheGroupMayDo(): void
    {
        self::assertSame(
            'translated LLL:EXT:visual_permissions/Resources/Private/Language/locallang.xlf:allowedValues.title.fileOperations',
            $this->choices()->of('fileOperations', [])['title'],
        );
    }

    private function choices(): ValueChoices
    {
        $language = $this->createStub(LanguageService::class);
        $language->method('sL')->willReturnCallback(
            static fn(string $label): string => str_starts_with($label, 'LLL:') ? 'translated ' . $label : $label,
        );

        return new ValueChoices($language);
    }
}
