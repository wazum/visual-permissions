<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\ViewAsUser;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use TYPO3\CMS\Backend\Exception\NoAccessibleModuleException;
use TYPO3\CMS\Backend\Routing\UriBuilder;
use TYPO3\CMS\Core\Http\RedirectResponse;

final readonly class NoAccessibleModule implements MiddlewareInterface
{
    public function __construct(private UriBuilder $uriBuilder)
    {
    }

    /**
     * @noinspection PhpRedundantCatchClauseInspection
     */
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        try {
            return $handler->handle($request);
        } catch (NoAccessibleModuleException) {
            return new RedirectResponse((string) $this->uriBuilder->buildUriFromRoute('main'), 303);
        }
    }
}
