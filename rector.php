<?php

declare(strict_types=1);

use Rector\Config\RectorConfig;
use SavinMikhail\AnnotateThrowsRector\AnnotateThrowsRector;
use TYPO3\CMS\Backend\Routing\Exception\RouteNotFoundException;
use TYPO3\CMS\Core\Configuration\Exception\ExtensionConfigurationExtensionNotConfiguredException;
use TYPO3\CMS\Core\Configuration\Exception\ExtensionConfigurationPathDoesNotExistException;
use TYPO3\CMS\Core\Context\Exception\AspectNotFoundException;

return RectorConfig::configure()
    ->withPaths([
        __DIR__ . '/Classes',
        __DIR__ . '/Configuration',
        __DIR__ . '/Tests',
    ])
    ->withConfiguredRule(AnnotateThrowsRector::class, [
        AnnotateThrowsRector::EXCLUDED_EXCEPTION_CLASSES => [
            \Throwable::class,
            \Exception::class,
            \Error::class,
            \RuntimeException::class,
            \LogicException::class,
            \InvalidArgumentException::class,
            AspectNotFoundException::class,
            RouteNotFoundException::class,
            // Core fills a missing setting from ext_conf_template.txt, which holds every one we read
            ExtensionConfigurationExtensionNotConfiguredException::class,
            ExtensionConfigurationPathDoesNotExistException::class,
        ],
    ])
    ->withSkip([
        __DIR__ . '/Tests/E2e/node_modules',
        AnnotateThrowsRector::class => [
            __DIR__ . '/Configuration',
            __DIR__ . '/Tests',
        ],
    ])
    ->withPhpSets(php82: true)
    ->withPreparedSets(
        deadCode: true,
        codeQuality: true,
        typeDeclarations: true,
        privatization: true,
        earlyReturn: true,
    );
