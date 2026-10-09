<?php

$EM_CONF[$_EXTKEY] = [
    'title' => 'Visual Permissions',
    'description' => 'Edit TYPO3 backend group permissions directly on the relevant screens.',
    'category' => 'be',
    'author' => 'Wolfgang Klinger',
    'author_email' => 'wolfgang@wazum.com',
    'state' => 'alpha',
    'version' => '0.1.0',
    'constraints' => [
        'depends' => [
            'typo3' => '13.4.0-14.3.99',
            'beuser' => '13.4.0-14.3.99',
            'php' => '8.2.0-8.5.99',
        ],
        'conflicts' => [],
        'suggests' => [],
    ],
];
