<?php

declare(strict_types=1);

use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;

ExtensionManagementUtility::addTCAcolumns('be_groups', [
    'tx_groupregions_regions' => [
        'label' => 'Regions',
        'config' => [
            'type' => 'select',
            'renderType' => 'selectCheckBox',
            'items' => [
                ['label' => 'North', 'value' => 'north'],
                ['label' => 'South', 'value' => 'south'],
            ],
        ],
    ],
]);

ExtensionManagementUtility::addToAllTCAtypes('be_groups', 'tx_groupregions_regions');
