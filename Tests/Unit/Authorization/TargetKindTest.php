<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Unit\Authorization;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Wazum\VisualPermissions\Authorization\TargetKind;
use Wazum\VisualPermissions\Tests\ContractFixture;

final class TargetKindTest extends TestCase
{
    #[Test]
    public function coversExactlyTheKindsTheContractDeclares(): void
    {
        self::assertSame(
            ContractFixture::readList('vocabulary', 'kinds'),
            array_column(TargetKind::cases(), 'value'),
        );
    }
}
