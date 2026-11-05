<?php

declare(strict_types=1);

return [
    'backend' => [
        'wazum/visual-permissions/admin-access' => [
            'target' => Wazum\VisualPermissions\Authorization\AdminAccess::class,
            'after' => ['typo3/cms-backend/authentication'],
            'before' => ['typo3/cms-backend/sudo-mode-interceptor'],
        ],
        'wazum/visual-permissions/inline-settings' => [
            'target' => Wazum\VisualPermissions\Configuration\InlineSettings::class,
            'after' => ['typo3/cms-backend/authentication'],
        ],
        'wazum/visual-permissions/leave-user-view' => [
            'target' => Wazum\VisualPermissions\ViewAsUser\LeaveUserView::class,
            'after' => ['typo3/cms-backend/authentication'],
        ],
        'wazum/visual-permissions/no-accessible-module' => [
            'target' => Wazum\VisualPermissions\ViewAsUser\NoAccessibleModule::class,
            'after' => ['typo3/cms-backend/authentication'],
            'before' => ['typo3/cms-backend/backend-module-validator'],
        ],
        'wazum/visual-permissions/no-accessible-page' => [
            'target' => Wazum\VisualPermissions\ViewAsUser\NoAccessiblePage::class,
            'after' => ['typo3/cms-backend/authentication'],
            'before' => ['typo3/cms-backend/backend-module-validator'],
        ],
    ],
];
