<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Unit\GrantTables;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Wazum\VisualPermissions\Authorization\TargetKind;
use Wazum\VisualPermissions\GrantTables\TableCatalogue;

final class TableCatalogueTest extends TestCase
{
    protected function setUp(): void
    {
        $GLOBALS['TCA'] = [
            'pages' => ['ctrl' => ['title' => 'Page']],
            'tt_content' => ['ctrl' => ['title' => 'Content']],
        ];
    }

    #[Test]
    public function saysEveryTableCanBeGranted(): void
    {
        self::assertSame(
            [
                'pages' => TargetKind::Grantable,
                'tt_content' => TargetKind::Grantable,
            ],
            (new TableCatalogue())->all(),
        );
    }

    // Core keeps such a table out of the group form, and refuses the write even when it is listed
    #[Test]
    public function saysATableOnlyAdministratorsMayWriteIsTheirsAlone(): void
    {
        $GLOBALS['TCA'] = ['sys_log' => ['ctrl' => ['title' => 'Log', 'adminOnly' => true]]];

        self::assertSame(TargetKind::AdminOnly, (new TableCatalogue())->all()['sys_log']);
    }

    #[Test]
    public function saysWhatTcaCallsEachTableItIsAskedAbout(): void
    {
        self::assertSame(
            ['tt_content' => 'Content', 'pages' => 'Page'],
            (new TableCatalogue())->titles(['tt_content', 'pages']),
        );
    }
}
