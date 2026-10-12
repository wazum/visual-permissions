<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Compatibility;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

// 14.3 puts the backend user on the request, 13.4 does not. Delete this with 13.4 support.
final readonly class BackendUserAttribute implements MiddlewareInterface
{
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        return $handler->handle($request->withAttribute('backend.user', $request->getAttribute('backend.user') ?? $GLOBALS['BE_USER'] ?? null));
    }
}
