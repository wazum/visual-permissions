<?php

/** @noinspection PhpIllegalArrayKeyTypeInspection */

declare(strict_types=1);

namespace Wazum\VisualPermissions\DataHandling;

use TYPO3\CMS\Core\DataHandling\DataHandler;
use TYPO3\CMS\Core\Localization\LanguageServiceFactory;
use TYPO3\CMS\Core\SysLog\Action as SystemLogGenericAction;
use TYPO3\CMS\Core\SysLog\Error as SystemLogErrorClassification;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use Wazum\VisualPermissions\Configuration\PermissionMode;

final class WriteGuard
{
    /**
     * @var \WeakMap<DataHandler, true>|null
     */
    private static ?\WeakMap $allowed = null;

    public static function allow(DataHandler $dataHandler): void
    {
        self::$allowed ??= new \WeakMap();
        self::$allowed[$dataHandler] = true;
    }

    public function processDatamap_beforeStart(DataHandler $dataHandler): void
    {
        if (isset(self::$allowed[$dataHandler]) || [] === $dataHandler->datamap) {
            return;
        }

        if (PermissionMode::isOn($dataHandler->BE_USER->uc)) {
            $dataHandler->datamap = [];
            $this->logRefusal($dataHandler);
        }
    }

    public function processCmdmap_beforeStart(DataHandler $dataHandler): void
    {
        if ([] === $dataHandler->cmdmap) {
            return;
        }

        if (PermissionMode::isOn($dataHandler->BE_USER->uc)) {
            $dataHandler->cmdmap = [];
            $this->logRefusal($dataHandler);
        }
    }

    private function logRefusal(DataHandler $dataHandler): void
    {
        $dataHandler->log(
            '',
            0,
            SystemLogGenericAction::UNDEFINED,
            null,
            SystemLogErrorClassification::USER_ERROR,
            GeneralUtility::makeInstance(LanguageServiceFactory::class)
                ->createFromUserPreferences($dataHandler->BE_USER)
                ->sL('LLL:EXT:visual_permissions/Resources/Private/Language/locallang.xlf:readOnly.reason'),
        );
    }
}
