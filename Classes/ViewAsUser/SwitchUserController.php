<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\ViewAsUser;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Backend\Controller\SwitchUserController as CoreSwitchUser;
use TYPO3\CMS\Backend\Routing\UriBuilder;
use TYPO3\CMS\Core\Http\RedirectResponse;

final readonly class SwitchUserController
{
    public function __construct(
        private CoreSwitchUser $core,
        private UriBuilder $uriBuilder,
    ) {
    }

    /**
     * @throws \TYPO3\CMS\Backend\Routing\Exception\RouteNotFoundException
     */
    public function switchUser(ServerRequestInterface $request): ResponseInterface
    {
        $this->core->switchUserAction($request);

        return $this->redirectToScreen($request);
    }

    /**
     * @throws \TYPO3\CMS\Backend\Routing\Exception\RouteNotFoundException
     */
    private function redirectToScreen(ServerRequestInterface $request): ResponseInterface
    {
        $body = $request->getParsedBody();
        $params = \is_array($body) ? $body : [];
        $screen = \is_string($params['screen'] ?? null) ? $params['screen'] : '';

        return new RedirectResponse($this->screenOrBackend($screen), 303);
    }

    /**
     * @throws \TYPO3\CMS\Backend\Routing\Exception\RouteNotFoundException
     */
    private function screenOrBackend(string $screen): string
    {
        return 1 === \preg_match('#^/[^/\\\\]#', $screen)
            ? $screen
            : (string) $this->uriBuilder->buildUriFromRoute('main');
    }
}
