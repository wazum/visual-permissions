<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\ViewAsUser;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use TYPO3\CMS\Backend\Routing\Route;
use TYPO3\CMS\Core\Authentication\BackendUserAuthentication;
use TYPO3\CMS\Core\Localization\LanguageServiceFactory;
use TYPO3\CMS\Core\Page\PageRenderer;

final readonly class LeaveUserView implements MiddlewareInterface
{
    public function __construct(
        private PageRenderer $pageRenderer,
        private LanguageServiceFactory $languageServiceFactory,
    ) {
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        if ($this->isSwitchedUser($request) && $this->isMainPage($request)) {
            $this->pageRenderer->loadJavaScriptModule('@wazum/visual-permissions/main.js');
            $this->pageRenderer->addInlineSetting('visualPermissions', 'leave', $this->leaveLabel($request));
        }

        return $handler->handle($request);
    }

    private function isSwitchedUser(ServerRequestInterface $request): bool
    {
        $user = $request->getAttribute('backend.user') ?? $GLOBALS['BE_USER'] ?? null;

        return $user instanceof BackendUserAuthentication
            && null !== $user->getOriginalUserIdWhenInSwitchUserMode();
    }

    // Only the main backend page loads the script. A module page opened while viewing as the
    // user can still run after switching back, and would add the button to leave again.
    private function isMainPage(ServerRequestInterface $request): bool
    {
        $route = $request->getAttribute('route');

        return $route instanceof Route && 'main' === $route->getOption('_identifier');
    }

    private function leaveLabel(ServerRequestInterface $request): string
    {
        /** @var BackendUserAuthentication|null $backendUser */
        $backendUser = $request->getAttribute('backend.user');

        return $this->languageServiceFactory
            ->createFromUserPreferences($backendUser)
            ->sL('LLL:EXT:visual_permissions/Resources/Private/Language/locallang.xlf:viewAsUser.leave');
    }
}
