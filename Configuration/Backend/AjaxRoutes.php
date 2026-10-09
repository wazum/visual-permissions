<?php

declare(strict_types=1);

use Wazum\VisualPermissions\AllowValues\AllowFileOperationsController;
use Wazum\VisualPermissions\AllowValues\AllowPageTypesController;
use Wazum\VisualPermissions\AllowValues\AllowValuesController;
use Wazum\VisualPermissions\EditOtherPermissions\OtherPermissionsController;
use Wazum\VisualPermissions\GrantFields\GrantFieldsController;
use Wazum\VisualPermissions\GrantModules\GrantModulesController;
use Wazum\VisualPermissions\GrantTables\GrantTablesController;
use Wazum\VisualPermissions\Inspect\InspectController;
use Wazum\VisualPermissions\MountBranches\Folders\FolderTreeController;
use Wazum\VisualPermissions\MountBranches\Folders\MountFoldersController;
use Wazum\VisualPermissions\MountBranches\Pages\MountPagesController;
use Wazum\VisualPermissions\Surfaces\RecordForm\OpenDocumentController;
use Wazum\VisualPermissions\ViewAsUser\SwitchUserController;
use Wazum\VisualPermissions\ViewAsUser\ViewableUsersController;

// Sorted by key. Every route is for administrators, except the two the viewed user calls.
// A write that changes what others may do asks for the password again, in core's own group
// for user management: the group fields it writes ask in that group too, and one password
// has to cover both.
return [
    'visual_permissions_allow_file_operations' => [
        'path' => '/visual-permissions/allow-file-operations',
        'target' => AllowFileOperationsController::class . '::write',
        'access' => 'admin',
        'sudoMode' => [
            'group' => 'be.userManagement',
        ],
    ],
    'visual_permissions_allow_page_types' => [
        'path' => '/visual-permissions/allow-page-types',
        'target' => AllowPageTypesController::class . '::write',
        'access' => 'admin',
        'sudoMode' => [
            'group' => 'be.userManagement',
        ],
    ],
    'visual_permissions_allow_values' => [
        'path' => '/visual-permissions/allow-values',
        'target' => AllowValuesController::class . '::write',
        'access' => 'admin',
        'sudoMode' => [
            'group' => 'be.userManagement',
        ],
    ],
    'visual_permissions_file_operations' => [
        'path' => '/visual-permissions/file-operations',
        'target' => AllowFileOperationsController::class . '::choices',
        'access' => 'admin',
    ],
    'visual_permissions_folder_tree' => [
        'path' => '/visual-permissions/folder-tree',
        'target' => FolderTreeController::class . '::tree',
        'access' => 'admin',
    ],
    'visual_permissions_grant_fields' => [
        'path' => '/visual-permissions/grant-fields',
        'target' => GrantFieldsController::class . '::write',
        'access' => 'admin',
        'sudoMode' => [
            'group' => 'be.userManagement',
        ],
    ],
    'visual_permissions_grant_modules' => [
        'path' => '/visual-permissions/grant-modules',
        'target' => GrantModulesController::class . '::write',
        'access' => 'admin',
        'sudoMode' => [
            'group' => 'be.userManagement',
        ],
    ],
    'visual_permissions_grant_tables' => [
        'path' => '/visual-permissions/grant-tables',
        'target' => GrantTablesController::class . '::write',
        'access' => 'admin',
        'sudoMode' => [
            'group' => 'be.userManagement',
        ],
    ],
    'visual_permissions_inspect' => [
        'path' => '/visual-permissions/inspect',
        'target' => InspectController::class . '::inspect',
        'access' => 'admin',
    ],
    'visual_permissions_mount_folders' => [
        'path' => '/visual-permissions/mount-folders',
        'target' => MountFoldersController::class . '::write',
        'access' => 'admin',
        'sudoMode' => [
            'group' => 'be.userManagement',
        ],
    ],
    'visual_permissions_mount_pages' => [
        'path' => '/visual-permissions/mount-pages',
        'target' => MountPagesController::class . '::write',
        'access' => 'admin',
        'sudoMode' => [
            'group' => 'be.userManagement',
        ],
    ],
    'visual_permissions_open_document' => [
        'path' => '/visual-permissions/open-document',
        'target' => OpenDocumentController::class . '::url',
    ],
    'visual_permissions_other_permissions' => [
        'path' => '/visual-permissions/other-permissions',
        'target' => OtherPermissionsController::class . '::form',
        'access' => 'admin',
    ],
    // Reached by leaving the page rather than by asking from it, so nothing of that page can
    // answer late and take the session the handover just set.
    'visual_permissions_view_as_user' => [
        'path' => '/visual-permissions/view-as-user',
        'target' => SwitchUserController::class . '::switchUser',
        'access' => 'admin',
    ],
    'visual_permissions_viewable_users' => [
        'path' => '/visual-permissions/viewable-users',
        'target' => ViewableUsersController::class . '::list',
        'access' => 'admin',
    ],
    'visual_permissions_write_other_permissions' => [
        'path' => '/visual-permissions/write-other-permissions',
        'target' => OtherPermissionsController::class . '::write',
        'access' => 'admin',
        'sudoMode' => [
            'group' => 'be.userManagement',
        ],
    ],
];
