<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\ViewAsUser;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use TYPO3\CMS\Core\Http\RedirectResponse;

final readonly class NoAccessiblePage implements MiddlewareInterface
{
    private const NO_ACCESS_TO_PAGE = 1289917924;

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        try {
            return $handler->handle($request);
        } catch (\RuntimeException $exception) {
            if (self::NO_ACCESS_TO_PAGE !== $exception->getCode()) {
                throw $exception;
            }

            \parse_str($request->getUri()->getQuery(), $query);
            unset($query['id']);

            return new RedirectResponse((string) $request->getUri()->withQuery(\http_build_query($query)), 303);
        }
    }
}
