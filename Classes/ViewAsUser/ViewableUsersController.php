<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\ViewAsUser;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Core\Authentication\BackendUserAuthentication;
use TYPO3\CMS\Core\Http\JsonResponse;
use TYPO3\CMS\Core\Http\Response;

final readonly class ViewableUsersController
{
    public function __construct(private ViewableUsers $viewableUsers)
    {
    }

    /**
     * @throws \Doctrine\DBAL\Exception
     */
    public function list(ServerRequestInterface $request): ResponseInterface
    {
        $tag = sprintf('"%s"', md5($this->viewableUsers->version() . implode(',', $this->recent())));

        // Server marks If-None-Match weak with W/; trim it off before comparison
        $held = ltrim($request->getHeaderLine('If-None-Match'), 'W/');
        if ($held === $tag) {
            return new Response(null, 304, ['ETag' => $tag]);
        }

        $users = [];
        foreach ($this->viewableUsers->all() as $id => $user) {
            $users[] = ['id' => $id, ...$user];
        }

        return new JsonResponse(
            ['recent' => $this->recent(), 'users' => $users],
            200,
            ['ETag' => $tag, 'Cache-Control' => 'private, no-cache'],
        );
    }

    /**
     * @return list<int>
     */
    private function recent(): array
    {
        $backendUser = $GLOBALS['BE_USER'] ?? null;
        if (!$backendUser instanceof BackendUserAuthentication) {
            return [];
        }

        $recent = $backendUser->uc['recentSwitchedToUsers'] ?? [];
        if (!is_array($recent)) {
            return [];
        }

        /** @var list<int> $ids */
        $ids = array_values($recent);

        return $ids;
    }
}
