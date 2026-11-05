<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Functional;

use PHPUnit\Framework\Attributes\Test;
use TYPO3\CMS\Backend\Routing\Router;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;

final class AjaxRoutesTest extends FunctionalTestCase
{
    protected array $coreExtensionsToLoad = ['beuser'];

    protected array $testExtensionsToLoad = ['wazum/visual-permissions'];

    #[Test]
    public function everyRouteTargetIsCallable(): void
    {
        /** @var array<string, array{path: string, target: string}> $routes */
        $routes = require dirname(__DIR__, 2) . '/Configuration/Backend/AjaxRoutes.php';

        self::assertNotEmpty($routes);

        foreach ($routes as $name => $route) {
            [$class, $method] = explode('::', $route['target']);

            self::assertTrue(
                is_callable([$this->get($class), $method]),
                sprintf('Route "%s" points at a target the container cannot call.', $name),
            );
        }
    }

    #[Test]
    public function everyRouteAsksForAnAdministratorButTheOnesTheViewedUserCalls(): void
    {
        $router = $this->get(Router::class);
        $ours = array_filter(
            array_keys(iterator_to_array($router->getRoutes())),
            static fn(string $name): bool => str_starts_with($name, 'ajax_visual_permissions_'),
        );

        $open = array_values(array_filter(
            $ours,
            static fn(string $name): bool => 'admin' !== $router->getRoute($name)?->getOption('access'),
        ));
        sort($open);

        self::assertSame(['ajax_visual_permissions_open_document'], $open);
    }
}
