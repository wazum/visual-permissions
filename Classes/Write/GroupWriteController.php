<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Write;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Core\Http\Response;
use Wazum\VisualPermissions\BackendGroups\BackendGroups;

/**
 * @template TOperation of array<string, mixed>
 */
abstract readonly class GroupWriteController
{
    public function __construct(protected BackendGroups $groups)
    {
    }

    /**
     * @throws \Doctrine\DBAL\Exception
     */
    final public function write(ServerRequestInterface $request): ResponseInterface
    {
        $body = $request->getParsedBody();
        $params = is_array($body) ? $body : [];
        $groupId = $this->groups->existing($params['group'] ?? null);
        if (null === $groupId) {
            return new Response(null, 404);
        }

        $operations = $this->operationsFrom($params['operations'] ?? null);
        if (null === $operations) {
            return new Response(null, 400);
        }

        if (!$this->writeOperations($groupId, $operations)) {
            return new Response(null, 409);
        }

        return new Response(null, 204);
    }

    /**
     * @return list<TOperation>|null null when one of them is no operation this can read
     */
    abstract protected function operationsFrom(mixed $sent): ?array;

    /**
     * @param list<TOperation> $operations
     *
     * @return bool whether the backend took the write
     *
     * @throws \Doctrine\DBAL\Exception
     */
    abstract protected function writeOperations(int $groupId, array $operations): bool;
}
