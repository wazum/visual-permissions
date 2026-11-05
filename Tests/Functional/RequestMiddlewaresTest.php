<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Functional;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use TYPO3\CMS\Core\Http\MiddlewareStackResolver;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;

final class RequestMiddlewaresTest extends FunctionalTestCase
{
    protected array $coreExtensionsToLoad = ['beuser'];

    protected array $testExtensionsToLoad = ['wazum/visual-permissions'];

    /**
     * @return array<string, array{string}>
     */
    public static function middlewares(): array
    {
        return [
            'admin access' => ['wazum/visual-permissions/admin-access'],
            'inline settings' => ['wazum/visual-permissions/inline-settings'],
            'leave user view' => ['wazum/visual-permissions/leave-user-view'],
            'no accessible module' => ['wazum/visual-permissions/no-accessible-module'],
            'no accessible page' => ['wazum/visual-permissions/no-accessible-page'],
        ];
    }

    #[Test]
    #[DataProvider('middlewares')]
    public function runsOnceTheUserIsLoggedIn(string $middleware): void
    {
        self::assertTrue($this->runsBefore('typo3/cms-backend/authentication', $middleware));
    }

    /**
     * @return array<string, array{string, string}>
     */
    public static function precedences(): array
    {
        return [
            'no administrator reaches the password prompt' => ['wazum/visual-permissions/admin-access', 'typo3/cms-backend/sudo-mode-interceptor'],
            'no module refuses the user before core does' => ['wazum/visual-permissions/no-accessible-module', 'typo3/cms-backend/backend-module-validator'],
            'no page refuses the user before core does' => ['wazum/visual-permissions/no-accessible-page', 'typo3/cms-backend/backend-module-validator'],
        ];
    }

    #[Test]
    #[DataProvider('precedences')]
    public function runsBeforeTheCoreMiddlewareItMustPrecede(string $middleware, string $core): void
    {
        self::assertTrue($this->runsBefore($middleware, $core));
    }

    // Core hands the stack over last in, first out, so what runs first stands last
    private function runsBefore(string $first, string $second): bool
    {
        $positions = array_flip(array_keys(iterator_to_array($this->get(MiddlewareStackResolver::class)->resolve('backend'))));

        return $positions[$first] > $positions[$second];
    }
}
