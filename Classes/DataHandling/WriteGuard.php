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
    private const PAGE_PERMISSION_COLUMNS = ['perms_userid', 'perms_groupid', 'perms_user', 'perms_group', 'perms_everybody', 'editlock'];

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

        if (PermissionMode::isOn($dataHandler->BE_USER->uc) && !$this->changesOnlyPagePermissions($dataHandler->datamap)) {
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

    /**
     * @param array<string, array<int|string, array<array-key, mixed>>> $datamap
     */
    private function changesOnlyPagePermissions(array $datamap): bool
    {
        if (['pages'] !== array_keys($datamap)) {
            return false;
        }

        foreach ($datamap['pages'] as $columns) {
            if ([] !== array_diff(array_keys($columns), self::PAGE_PERMISSION_COLUMNS)) {
                return false;
            }
        }

        return true;
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
