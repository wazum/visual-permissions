<?php

declare(strict_types=1);

$GLOBALS['TYPO3_CONF_VARS']['BE']['stylesheets']['visual_permissions']
    = 'EXT:visual_permissions/Resources/Public/Css/';

$GLOBALS['TYPO3_CONF_VARS']['SYS']['formEngine']['nodeRegistry'][1788400000] = [
    'nodeName' => 'singleFieldContainer',
    'priority' => 40,
    'class' => \Wazum\VisualPermissions\Surfaces\RecordForm\AnchorEmittingFieldContainer::class,
];

$GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['t3lib/class.t3lib_tcemain.php']['processDatamapClass']['visual_permissions']
    = \Wazum\VisualPermissions\DataHandling\WriteGuard::class;
$GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['t3lib/class.t3lib_tcemain.php']['processCmdmapClass']['visual_permissions']
    = \Wazum\VisualPermissions\DataHandling\WriteGuard::class;
