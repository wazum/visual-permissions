<?php

declare(strict_types=1);

return [
    'BE' => [
        'debug' => true,
        // a suite can log in as often as it likes; no rate limit
        'loginRateLimit' => 0,
        'sessionTimeout' => 31536000,
        'installToolPassword' => '$2y$12$Q8Zt7FjvZrN9pJ8p2S0OuuU2E0O9lOQzKQ0Q3Zz1Jm5nR6Wv3Xk9C',
        'passwordHashing' => [
            'className' => TYPO3\CMS\Core\Crypto\PasswordHashing\BcryptPasswordHash::class,
            'options' => ['cost' => 10],
        ],
    ],
    'DB' => [
        'Connections' => [
            'Default' => [
                'driver' => 'pdo_sqlite',
                'path' => 'var/e2e/seed.sqlite',
            ],
        ],
    ],
    'EXTENSIONS' => [
        'backend' => ['loginHighlightColor' => '#f49700'],
        'visual_permissions' => ['animation' => '1'],
    ],
    'GFX' => [
        'processor_enabled' => false,
    ],
    'LOG' => [
        'writerConfiguration' => [
            TYPO3\CMS\Core\Log\LogLevel::WARNING => [
                TYPO3\CMS\Core\Log\Writer\FileWriter::class => ['logFileInfix' => 'e2e'],
            ],
        ],
    ],
    'SYS' => [
        'devIPmask' => '*',
        'displayErrors' => 1,
        'encryptionKey' => 'e2e0000000000000000000000000000000000000000000000000000000000e2e',
        'exceptionalErrors' => 4096,
        'features' => [
            'security.backend.enforceReferrer' => false,
        ],
        'sitename' => 'Visual permissions',
        'systemMaintainers' => [1],
        'trustedHostsPattern' => '.*',
    ],
];
