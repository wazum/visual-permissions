<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Unit\Authorization;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Wazum\VisualPermissions\Authorization\AccessVerdict;
use Wazum\VisualPermissions\Tests\ContractFixture;

final class AccessVerdictTest extends TestCase
{
    #[Test]
    public function coversExactlyTheVerdictsTheContractDeclares(): void
    {
        self::assertSame(
            ContractFixture::readList('vocabulary', 'verdicts'),
            array_column(AccessVerdict::cases(), 'value'),
        );
    }
}
