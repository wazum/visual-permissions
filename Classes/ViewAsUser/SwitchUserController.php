<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\ViewAsUser;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Backend\Controller\SwitchUserController as CoreSwitchUser;
use TYPO3\CMS\Backend\Routing\UriBuilder;
use TYPO3\CMS\Core\Authentication\BackendUserAuthentication;
use TYPO3\CMS\Core\Http\RedirectResponse;
use TYPO3\CMS\Core\Localization\LanguageServiceFactory;
use TYPO3\CMS\Core\Messaging\FlashMessage;
use TYPO3\CMS\Core\Messaging\FlashMessageService;
use TYPO3\CMS\Core\Type\ContextualFeedbackSeverity;
use TYPO3\CMS\Core\Utility\GeneralUtility;

final readonly class SwitchUserController
{
    public function __construct(
        private CoreSwitchUser $core,
        private UriBuilder $uriBuilder,
        private FlashMessageService $flashMessages,
        private LanguageServiceFactory $languages,
    ) {
    }

    /**
     * @throws \TYPO3\CMS\Backend\Routing\Exception\RouteNotFoundException
     * @throws \TYPO3\CMS\Core\Exception
     */
    public function switchUser(ServerRequestInterface $request): ResponseInterface
    {
        /** @var array{success?: bool} $answer */
        $answer = \json_decode((string) $this->core->switchUserAction($request)->getBody(), true);
        if (true !== ($answer['success'] ?? false)) {
            $this->tellNotSwitched($request);
        }

        return $this->redirectToScreen($request);
    }

    /**
     * @throws \TYPO3\CMS\Core\Exception
     */
    private function tellNotSwitched(ServerRequestInterface $request): void
    {
        /** @var BackendUserAuthentication|null $administrator */
        $administrator = $request->getAttribute('backend.user');
        $message = $this->languages
            ->createFromUserPreferences($administrator)
            ->sL('LLL:EXT:visual_permissions/Resources/Private/Language/locallang.xlf:viewAsUser.notSwitched');
        $this->flashMessages->getMessageQueueByIdentifier()->enqueue(
            new FlashMessage($message, '', ContextualFeedbackSeverity::ERROR, true),
        );
    }

    /**
     * @throws \TYPO3\CMS\Backend\Routing\Exception\RouteNotFoundException
     */
    private function redirectToScreen(ServerRequestInterface $request): ResponseInterface
    {
        $body = $request->getParsedBody();
        $params = \is_array($body) ? $body : [];
        $screen = \is_string($params['screen'] ?? null) ? $params['screen'] : '';

        return new RedirectResponse($this->screenOrBackend($screen, $request), 303);
    }

    /**
     * @throws \TYPO3\CMS\Backend\Routing\Exception\RouteNotFoundException
     */
    private function screenOrBackend(string $screen, ServerRequestInterface $request): string
    {
        return GeneralUtility::sanitizeLocalUrl($screen, $request) ?: (string) $this->uriBuilder->buildUriFromRoute('main');
    }
}
