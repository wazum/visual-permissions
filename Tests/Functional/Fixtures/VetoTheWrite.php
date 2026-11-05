<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Functional\Fixtures;

use TYPO3\CMS\Core\DataHandling\DataHandler;
use TYPO3\CMS\Core\SysLog\Action\Database as SystemLogDatabaseAction;
use TYPO3\CMS\Core\SysLog\Error as SystemLogErrorClassification;

final class VetoTheWrite
{
    public static function register(): void
    {
        /** @var array{SC_OPTIONS?: array<string, array<string, list<string>>>} $configuration */
        $configuration = $GLOBALS['TYPO3_CONF_VARS'];
        $configuration['SC_OPTIONS']['t3lib/class.t3lib_tcemain.php']['processDatamapClass'][] = self::class;
        $GLOBALS['TYPO3_CONF_VARS'] = $configuration;
    }

    /**
     * @param array<string, mixed> $fieldArray
     */
    public function processDatamap_preProcessFieldArray(
        array &$fieldArray,
        string $table,
        int|string $id,
        DataHandler $dataHandler,
    ): void {
        $fieldArray = [];
        $dataHandler->log(
            $table,
            (int) $id,
            SystemLogDatabaseAction::UPDATE,
            null,
            SystemLogErrorClassification::USER_ERROR,
            'the write was turned down',
        );
    }
}
