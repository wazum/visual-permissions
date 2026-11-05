<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Unit\Surfaces\RecordForm;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Wazum\VisualPermissions\Surfaces\RecordForm\FieldAnchorRenderer;
use Wazum\VisualPermissions\Tests\ContractFixture;

final class FieldAnchorRendererTest extends TestCase
{
    #[Test]
    public function namesTheFieldTheMarkupBelongsTo(): void
    {
        $anchored = (new FieldAnchorRenderer())->wrap('<input name="title">', 'pages', 'title');

        self::assertStringContainsString(
            sprintf('%s="pages:title"', ContractFixture::readMap('dom-attributes', 'attributes')['token']),
            $anchored,
        );
        self::assertStringContainsString('<input name="title">', $anchored);
    }

    // The same field of a table is drawn once per record on the page, so the token names no one
    #[Test]
    public function namesTheOneRecordTheFieldIsDrawnFor(): void
    {
        $anchored = (new FieldAnchorRenderer())->wrap('<input name="title">', 'pages', 'title', 63);

        self::assertStringContainsString(
            sprintf('%s="pages-63-title"', ContractFixture::readMap('dom-attributes', 'attributes')['field']),
            $anchored,
        );
    }

    #[Test]
    public function namesTheListThatAllowsTheValuesOfTheField(): void
    {
        $anchored = (new FieldAnchorRenderer())->wrap('<select></select>', 'tt_content', 'CType', 1, '', 'fieldValues');

        self::assertStringContainsString(
            sprintf('%s="fieldValues"', ContractFixture::readMap('dom-attributes', 'attributes')['allows']),
            $anchored,
        );
    }

    #[Test]
    public function namesNoListForAFieldWhoseValuesNeedNone(): void
    {
        $anchored = (new FieldAnchorRenderer())->wrap('<input name="title">', 'pages', 'title');

        self::assertStringNotContainsString(ContractFixture::readMap('dom-attributes', 'attributes')['allows'], $anchored);
    }

    // A record of another table is drawn inside the field that holds it, and says which one
    #[Test]
    public function namesTheFieldTheRecordIsHeldBy(): void
    {
        $anchored = (new FieldAnchorRenderer())
            ->wrap('<input name="title">', 'sys_file_reference', 'title', 7, 'tt_content-82-assets');

        self::assertStringContainsString(
            sprintf('%s="tt_content-82-assets"', ContractFixture::readMap('dom-attributes', 'attributes')['inside']),
            $anchored,
        );
    }

    // A field of a record type the form holds none of has no control to stand beside
    #[Test]
    public function listsFieldsOfOtherKindsOneRowEach(): void
    {
        $listed = (new FieldAnchorRenderer())
            ->otherKinds('Only on other kinds of "File"', 'sys_file_reference', ['autoplay' => 'Autoplay', 'loop' => 'Loop <1>'], 'tt_content-82-assets');
        $attributes = ContractFixture::readMap('dom-attributes', 'attributes');

        self::assertStringStartsWith(
            sprintf('<div class="%s">', ContractFixture::readMap('dom-attributes', 'classes')['otherKinds']),
            $listed,
        );
        self::assertStringContainsString('Only on other kinds of &quot;File&quot;', $listed);
        self::assertStringContainsString(sprintf('%s="sys_file_reference:autoplay"', $attributes['token']), $listed);
        self::assertStringContainsString(sprintf('%s="sys_file_reference:loop"', $attributes['token']), $listed);
        self::assertStringContainsString(
            sprintf('<div class="form-group"><fieldset class="vperm-anchor" %s="sys_file_reference:loop"', $attributes['token']),
            $listed,
        );
        self::assertStringContainsString('<label class="form-label">Autoplay</label></fieldset></div><div class="form-group">', $listed);
        self::assertStringContainsString('<label class="form-label">Loop &lt;1&gt;</label>', $listed);
    }

    #[Test]
    public function namesTheFieldTheOtherKindsAreHeldBy(): void
    {
        $listed = (new FieldAnchorRenderer())
            ->otherKinds('Only on other kinds of "File"', 'sys_file_reference', ['autoplay' => 'Autoplay'], 'tt_content-82-assets');

        self::assertStringContainsString(
            sprintf('%s="tt_content-82-assets"', ContractFixture::readMap('dom-attributes', 'attributes')['inside']),
            $listed,
        );
    }

    #[Test]
    public function listsNothingAtAllWhenNoFieldIsLeftForOtherKinds(): void
    {
        self::assertSame('', (new FieldAnchorRenderer())->otherKinds('Only on other kinds of "File"', 'sys_file_reference', [], 'tt_content-82-assets'));
    }

    #[Test]
    public function leavesAFieldThatRendersNothingAlone(): void
    {
        $anchored = (new FieldAnchorRenderer())->wrap("  \n", 'pages', 'hidden');

        self::assertSame("  \n", $anchored);
    }
}
