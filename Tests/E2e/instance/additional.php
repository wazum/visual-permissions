<?php

declare(strict_types=1);

$named = $_SERVER['HTTP_X_VPERM_DATABASE'] ?? getenv('VPERM_DATABASE');
$itsDatabase = is_string($named) && 1 === preg_match('/^\d+$/', $named)
    ? 'typo3-' . $named . '.sqlite'
    : 'seed.sqlite';

// path is absolute; relative paths would be read from the request dir
$GLOBALS['TYPO3_CONF_VARS']['DB']['Connections']['Default']['path']
    = TYPO3\CMS\Core\Core\Environment::getProjectPath() . '/var/e2e/' . $itsDatabase;
