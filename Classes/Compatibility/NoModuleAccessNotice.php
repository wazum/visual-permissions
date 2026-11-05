<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Compatibility;

use TYPO3\CMS\Backend\Controller\Event\AfterBackendPageRenderEvent;
use TYPO3\CMS\Backend\Module\ModuleProvider;
use TYPO3\CMS\Core\Authentication\BackendUserAuthentication;
use TYPO3\CMS\Core\Imaging\IconFactory;
use TYPO3\CMS\Core\Imaging\IconSize;
use TYPO3\CMS\Core\Information\Typo3Version;
use TYPO3\CMS\Core\Localization\LanguageServiceFactory;

final readonly class NoModuleAccessNotice
{
    private const ROUTER = '#<typo3-backend-module-router\b[^>]*>.*?</typo3-backend-module-router>#s';

    public function __construct(
        private ModuleProvider $modules,
        private IconFactory $icons,
        private LanguageServiceFactory $languageServiceFactory,
        private Typo3Version $version,
    ) {
    }

    public function __invoke(AfterBackendPageRenderEvent $event): void
    {
        $backendUser = $GLOBALS['BE_USER'] ?? null;

        if ($this->version->getMajorVersion() >= 14
            || !$backendUser instanceof BackendUserAuthentication
            || [] !== $this->modules->getModulesForModuleMenu($backendUser)
        ) {
            return;
        }

        $event->setContent((string) preg_replace(
            self::ROUTER,
            $this->notice($backendUser),
            $event->getContent(),
            1,
        ));
    }

    private function notice(BackendUserAuthentication $backendUser): string
    {
        $language = $this->languageServiceFactory->createFromUserPreferences($backendUser);
        $labels = 'LLL:EXT:visual_permissions/Resources/Private/Language/locallang.xlf:viewAsUser.noModule.';

        return '<div class="m-4"><div class="callout callout-warning">'
            . '<div class="callout-icon"><span class="icon-emphasized">'
            . $this->icons->getIcon('actions-exclamation', IconSize::SMALL)->render()
            . '</span></div>'
            . '<div class="callout-content">'
            . '<div class="callout-title">' . htmlspecialchars($language->sL($labels . 'title')) . '</div>'
            . '<div class="callout-body">' . htmlspecialchars($language->sL($labels . 'message')) . '</div>'
            . '</div></div></div>';
    }
}
