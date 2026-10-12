<?php

declare(strict_types=1);

return [
    'module_tree_parent' => [
        'parent' => 'help',
        'access' => 'user',
        'path' => '/module/help/module-tree',
        'labels' => ['title' => 'Module tree'],
        'appearance' => ['dependsOnSubmodules' => true],
        'showSubmoduleOverview' => true,
    ],
    'module_tree_child' => [
        'parent' => 'module_tree_parent',
        'access' => 'user',
        'path' => '/module/help/module-tree/child',
        'labels' => ['title' => 'Module tree child'],
        'routes' => ['_default' => ['target' => 'module_tree_child']],
    ],
];
