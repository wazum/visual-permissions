<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Configuration;

use TYPO3\CMS\Core\Authentication\BackendUserAuthentication;

final class PermissionMode
{
    // Only an administrator assigns permissions; the flag in anyone else's settings means nothing
    public static function isOn(BackendUserAuthentication $backendUser): bool
    {
        /** @var array{vperm?: array{session?: array{active?: mixed}}} $kept */
        $kept = $backendUser->uc;

        return $backendUser->isAdmin() && 'true' === ($kept['vperm']['session']['active'] ?? null);
    }
}
