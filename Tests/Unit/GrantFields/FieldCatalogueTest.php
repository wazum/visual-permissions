<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Unit\GrantFields;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Wazum\VisualPermissions\Authorization\TargetKind;
use Wazum\VisualPermissions\GrantFields\FieldCatalogue;

final class FieldCatalogueTest extends TestCase
{
    protected function setUp(): void
    {
        $GLOBALS['TCA'] = ['pages' => ['columns' => [
            'title' => ['config' => ['type' => 'input']],
            'layout' => ['exclude' => true, 'config' => ['type' => 'select']],
            // Core's own TCA writes 1 rather than true for boolean fields
            'nav_title' => ['exclude' => 1, 'config' => ['type' => 'input']],
        ]]];
    }

    #[Test]
    public function saysWhichOfATablesFieldsCanBeGranted(): void
    {
        self::assertSame(
            [
                'pages:title' => TargetKind::NotApplicable,
                'pages:layout' => TargetKind::Grantable,
                'pages:nav_title' => TargetKind::Grantable,
            ],
            (new FieldCatalogue())->of('pages'),
        );
    }

    // Field is for administrators only; do not grant to groups or hide it
    #[Test]
    public function saysAFieldHiddenFromEveryoneButAdministratorsIsTheirsAlone(): void
    {
        $GLOBALS['TCA'] = ['pages' => ['columns' => [
            'TSconfig' => ['displayCond' => 'HIDE_FOR_NON_ADMINS', 'config' => ['type' => 'text']],
        ]]];

        self::assertSame(
            TargetKind::AdminOnly,
            (new FieldCatalogue())->of('pages')['pages:TSconfig'],
        );
    }

    #[Test]
    public function saysAFieldNobodyEditsIsNobodysToGrant(): void
    {
        $GLOBALS['TCA'] = ['pages' => ['columns' => [
            'layout' => ['exclude' => true, 'config' => ['type' => 'select', 'readOnly' => true]],
        ]]];

        self::assertSame(
            TargetKind::NeverEditable,
            (new FieldCatalogue())->of('pages')['pages:layout'],
        );
    }

    #[Test]
    public function saysNothingAboutATableTheInstallationDoesNotHave(): void
    {
        self::assertSame([], (new FieldCatalogue())->of('tx_absent_table'));
    }
}
