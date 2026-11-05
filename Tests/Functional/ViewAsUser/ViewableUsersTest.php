<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Functional\ViewAsUser;

use PHPUnit\Framework\Attributes\Test;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;
use Wazum\VisualPermissions\ViewAsUser\ViewableUsers;

final class ViewableUsersTest extends FunctionalTestCase
{
    protected array $coreExtensionsToLoad = ['beuser'];

    protected array $testExtensionsToLoad = ['wazum/visual-permissions'];

    #[Test]
    public function namesEveryUserWorthViewing(): void
    {
        $this->importCSVDataSet(__DIR__ . '/Fixtures/be_users.csv');

        self::assertSame([
            5 => ['username' => 'another-editor', 'realName' => '', 'groups' => [10, 12]],
            2 => ['username' => 'editor', 'realName' => 'Hans Huber', 'groups' => [10]],
        ], $this->get(ViewableUsers::class)->all());
    }
}
