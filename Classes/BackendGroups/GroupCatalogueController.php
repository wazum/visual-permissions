<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\BackendGroups;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Core\Http\JsonResponse;
use TYPO3\CMS\Core\Http\Response;

final readonly class GroupCatalogueController
{
    public function __construct(private GroupCatalogue $catalogue)
    {
    }

    /**
     * @throws \Doctrine\DBAL\Exception
     */
    public function list(ServerRequestInterface $request): ResponseInterface
    {
        $groups = $this->catalogue->all();
        $tag = sprintf('"%s"', md5((string) json_encode($groups)));
        if (ltrim($request->getHeaderLine('If-None-Match'), 'W/') === $tag) {
            return new Response(null, 304, ['ETag' => $tag]);
        }

        return new JsonResponse($groups, 200, ['ETag' => $tag, 'Cache-Control' => 'private, no-cache']);
    }
}
