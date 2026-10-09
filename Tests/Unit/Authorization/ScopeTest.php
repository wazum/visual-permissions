<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Unit\Authorization;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Wazum\VisualPermissions\Authorization\Scope;
use Wazum\VisualPermissions\Tests\ContractFixture;

final class ScopeTest extends TestCase
{
    #[Test]
    public function coversExactlyTheScopesTheContractDeclares(): void
    {
        self::assertSame(
            ContractFixture::readList('vocabulary', 'scopes'),
            array_column(Scope::cases(), 'value'),
        );
    }
}
