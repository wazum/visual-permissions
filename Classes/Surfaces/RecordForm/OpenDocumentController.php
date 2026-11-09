<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Surfaces\RecordForm;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Backend\Routing\UriBuilder;
use TYPO3\CMS\Core\Http\JsonResponse;
use TYPO3\CMS\Core\Utility\GeneralUtility;

final readonly class OpenDocumentController
{
    public function __construct(private UriBuilder $uriBuilder)
    {
    }

    /**
     * @throws \TYPO3\CMS\Backend\Routing\Exception\RouteNotFoundException
     */
    public function url(ServerRequestInterface $request): ResponseInterface
    {
        $asked = $request->getQueryParams();
        $table = \is_string($asked['table'] ?? null) ? $asked['table'] : '';
        $uids = \is_string($asked['uids'] ?? null) ? $asked['uids'] : '';
        $wayBack = \is_string($asked['returnUrl'] ?? null) ? $asked['returnUrl'] : '';

        if (1 !== \preg_match('/^[a-z0-9_]+$/', $table) || 1 !== \preg_match('/^\d+(?:,\d+)*$/', $uids)) {
            return new JsonResponse(['url' => '']);
        }

        $url = $this->uriBuilder->buildUriFromRoute('record_edit', [
            'edit' => [$table => \array_fill_keys(\explode(',', $uids), 'edit')],
            'returnUrl' => GeneralUtility::sanitizeLocalUrl($wayBack, $request),
        ]);

        return new JsonResponse(['url' => (string) $url]);
    }
}
