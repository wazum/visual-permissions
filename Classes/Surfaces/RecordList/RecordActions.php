<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Surfaces\RecordList;

use TYPO3\CMS\Backend\RecordList\Event\ModifyRecordListRecordActionsEvent;
use TYPO3\CMS\Core\Authentication\BackendUserAuthentication;
use Wazum\VisualPermissions\Configuration\PermissionMode;

final class RecordActions
{
    public function __invoke(ModifyRecordListRecordActionsEvent $event): void
    {
        if (!PermissionMode::isOn($this->getBackendUser()->uc)) {
            return;
        }

        $event->removeAction('delete');
        $event->removeAction('hide');
        $event->removeAction('moveUp');
        $event->removeAction('moveDown');
        $event->removeAction('copy');
        $event->removeAction('cut');
        $event->removeAction('move');
    }

    private function getBackendUser(): BackendUserAuthentication
    {
        /**
         * @var BackendUserAuthentication $backendUser
         */
        $backendUser = $GLOBALS['BE_USER'];

        return $backendUser;
    }
}
