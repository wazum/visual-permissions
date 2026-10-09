<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Authorization;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use TYPO3\CMS\Backend\Routing\Route;
use TYPO3\CMS\Core\Context\Context;
use TYPO3\CMS\Core\Http\Response;

final readonly class AdminAccess implements MiddlewareInterface
{
    public function __construct(private Context $context)
    {
    }

    /**
     * @throws \TYPO3\CMS\Core\Context\Exception\AspectNotFoundException
     */
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        /** @var Route $route */
        $route = $request->getAttribute('route');
        if ('admin' === $route->getOption('access') && !$this->context->getAspect('backend.user')->isAdmin()) {
            return new Response(null, 403);
        }

        return $handler->handle($request);
    }
}
