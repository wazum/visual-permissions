<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\DataHandling;

use TYPO3\CMS\Core\DataHandling\DataHandler;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Core\Utility\StringUtility;

final readonly class Records
{
    /**
     * @param array<string, mixed> $columns
     */
    public function create(string $table, array $columns): ?int
    {
        $placeholder = StringUtility::getUniqueId('NEW');

        $dataHandler = GeneralUtility::makeInstance(DataHandler::class);
        $dataHandler->start([$table => [$placeholder => $columns]], []);
        WriteGuard::allow($dataHandler);
        $dataHandler->process_datamap();

        $made = $dataHandler->substNEWwithIDs[$placeholder] ?? null;

        return is_numeric($made) ? (int) $made : null;
    }

    /**
     * @param array<string, mixed> $columns
     *
     * @return bool whether the backend took the write
     */
    public function update(string $table, int $uid, array $columns): bool
    {
        $dataHandler = GeneralUtility::makeInstance(DataHandler::class);
        $dataHandler->start([$table => [$uid => $columns]], []);
        WriteGuard::allow($dataHandler);
        $dataHandler->process_datamap();

        return [] === $dataHandler->errorLog;
    }
}
