<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Unit\Authorization;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Wazum\VisualPermissions\Authorization\AccessVerdict;
use Wazum\VisualPermissions\Authorization\TargetKind;
use Wazum\VisualPermissions\Authorization\Verdicts;

final class VerdictsTest extends TestCase
{
    #[Test]
    public function namesEveryGroupBehindTheGroupThatAllowsATarget(): void
    {
        $allowedBy = (new Verdicts())->allowedBy([20, 21, 22, 23], [20 => [5], 21 => [7], 22 => [], 23 => [7, 5]]);

        self::assertSame([7 => [21, 23], 5 => [23]], $allowedBy);
    }

    #[Test]
    public function callsATargetNobodyAllowedDenied(): void
    {
        $verdicts = (new Verdicts())->resolve([13], [13 => []], ['pages:layout' => TargetKind::Allowable]);

        self::assertSame(['pages:layout' => AccessVerdict::Denied], $verdicts);
    }

    #[Test]
    public function callsATargetTheGroupItselfAllowsAllowed(): void
    {
        $verdicts = (new Verdicts())->resolve([13, 18], [13 => ['web_layout'], 18 => []]);

        self::assertSame(['web_layout' => AccessVerdict::Allowed], $verdicts);
    }

    #[Test]
    public function callsATargetOnlyAGroupBehindItAllowsInherited(): void
    {
        $verdicts = (new Verdicts())->resolve([20, 21], [20 => [], 21 => [7]]);

        self::assertSame([7 => AccessVerdict::Inherited], $verdicts);
    }

    #[Test]
    public function callsATargetTheGroupAllowsAndAlsoInheritsAllowedAndInherited(): void
    {
        $verdicts = (new Verdicts())->resolve([13, 18], [13 => ['web_layout'], 18 => ['web_layout']]);

        self::assertSame(['web_layout' => AccessVerdict::AllowedAndInherited], $verdicts);
    }

    #[Test]
    public function callsATargetTheGroupAllowsTwiceAllowed(): void
    {
        $verdicts = (new Verdicts())->resolve([13], [13 => ['web_layout', 'web_layout']]);

        self::assertSame(['web_layout' => AccessVerdict::Allowed], $verdicts);
    }

    #[Test]
    public function readsOnPastATargetTheNearerGroupAlreadyAllows(): void
    {
        $verdicts = (new Verdicts())->resolve([20, 21], [20 => [5], 21 => [5, 9]]);

        self::assertSame([5 => AccessVerdict::AllowedAndInherited, 9 => AccessVerdict::Inherited], $verdicts);
    }

    // Core turns such a target down whatever the group carries
    #[Test]
    public function leavesATargetForAdministratorsTheirsEvenWhenAGroupCarriesIt(): void
    {
        $verdicts = (new Verdicts())->resolve(
            [13],
            [13 => ['site_configuration', 'web_layout']],
            ['site_configuration' => TargetKind::AdminOnly, 'web_layout' => TargetKind::Allowable],
        );

        self::assertSame([
            'site_configuration' => AccessVerdict::AdminOnly,
            'web_layout' => AccessVerdict::Allowed,
        ], $verdicts);
    }

    #[Test]
    public function callsATargetEveryoneReachesNotApplicable(): void
    {
        $verdicts = (new Verdicts())->resolve([13], [13 => ['pages:title']], ['pages:title' => TargetKind::NotApplicable]);

        self::assertSame(['pages:title' => AccessVerdict::NotApplicable], $verdicts);
    }

    #[Test]
    public function callsATargetNobodyMayEverEditNeverEditable(): void
    {
        $verdicts = (new Verdicts())->resolve([13], [13 => ['pages:uid']], ['pages:uid' => TargetKind::NeverEditable]);

        self::assertSame(['pages:uid' => AccessVerdict::NeverEditable], $verdicts);
    }
}
