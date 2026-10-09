<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Unit\Surfaces\RecordForm;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Wazum\VisualPermissions\Surfaces\RecordForm\FormFields;

final class FormFieldsTest extends TestCase
{
    #[Test]
    public function listsTheFieldsAnyTypeShowsInTheOrderTheyFirstStand(): void
    {
        $GLOBALS['TCA'] = ['sys_file_reference' => [
            'columns' => array_fill_keys(['title', 'description', 'alternative', 'crop', 'autoplay'], []),
            'types' => [
                '1' => ['showitem' => '--div--;General, --palette--;;basic, crop'],
                '4' => ['showitem' => '--palette--;;video, gone'],
            ],
            'palettes' => [
                'basic' => ['showitem' => 'title;Its title, --linebreak--, description'],
                'video' => ['showitem' => 'title, description, autoplay'],
            ],
        ]];

        self::assertSame(
            ['title', 'description', 'crop', 'autoplay'],
            (new FormFields())->shownOnlyByTypesOtherThan('sys_file_reference', []),
        );
    }

    #[Test]
    public function listsTheFieldsOnlyTypesOtherThanTheGivenOnesShow(): void
    {
        $GLOBALS['TCA'] = ['sys_file_reference' => [
            'columns' => array_fill_keys(['title', 'description', 'alternative', 'crop', 'autoplay'], []),
            'types' => [
                '1' => ['showitem' => 'title, description'],
                '2' => ['showitem' => 'title, alternative, crop'],
                '4' => ['showitem' => 'title, description, autoplay'],
            ],
        ]];

        self::assertSame(['autoplay'], (new FormFields())->shownOnlyByTypesOtherThan('sys_file_reference', ['1', '2']));
    }

    // Core draws a hidden palette as hidden fields: nobody sees them to edit
    #[Test]
    public function leavesOutTheFieldsOfAHiddenPalette(): void
    {
        $GLOBALS['TCA'] = ['sys_file_reference' => [
            'columns' => array_fill_keys(['title', 'hidden'], []),
            'types' => ['1' => ['showitem' => 'title, --palette--;;filePalette']],
            'palettes' => ['filePalette' => ['showitem' => 'hidden', 'isHiddenPalette' => true]],
        ]];

        self::assertSame(['title'], (new FormFields())->shownOnlyByTypesOtherThan('sys_file_reference', []));
    }
}
