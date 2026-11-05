<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Configuration;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use TYPO3\CMS\Core\Authentication\BackendUserAuthentication;
use TYPO3\CMS\Core\Localization\LanguageServiceFactory;
use TYPO3\CMS\Core\Page\PageRenderer;

final readonly class InlineSettings implements MiddlewareInterface
{
    public function __construct(
        private PageRenderer $pageRenderer,
        private Settings $settings,
        private LanguageServiceFactory $languageServiceFactory,
    ) {
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $this->pageRenderer->addInlineSettingArray('visualPermissions', [
            'animation' => $this->settings->animation(),
            'toggleKey' => $this->settings->toggleKey(),
            'switchUserKey' => $this->settings->switchUserKey(),
            'keysOnButtons' => $this->settings->keysOnButtons(),
            'modifiers' => $this->modifierLabel($request),
        ]);

        return $handler->handle($request);
    }

    private function modifierLabel(ServerRequestInterface $request): string
    {
        /** @var BackendUserAuthentication|null $backendUser */
        $backendUser = $request->getAttribute('backend.user');

        return $this->languageServiceFactory
            ->createFromUserPreferences($backendUser)
            ->sL('LLL:EXT:visual_permissions/Resources/Private/Language/locallang.xlf:platform.shortcut.modifiers');
    }
}
