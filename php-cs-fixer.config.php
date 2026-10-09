<?php

declare(strict_types=1);

$finder = PhpCsFixer\Finder::create()
    ->in([__DIR__ . '/Classes', __DIR__ . '/Configuration', __DIR__ . '/Tests'])
    ->exclude('E2e/node_modules')
    ->name('*.php');

return (new PhpCsFixer\Config())
    ->setRiskyAllowed(true)
    ->setFinder($finder)
    ->setRules([
        '@Symfony' => true,
        'concat_space' => ['spacing' => 'one'],
        'single_line_throw' => false,
        'no_extra_blank_lines' => ['tokens' => ['curly_brace_block', 'extra']],
        'function_declaration' => ['closure_fn_spacing' => 'none'],
        'declare_strict_types' => true,
        'ordered_class_elements' => [
            'sort_algorithm' => 'none',
            'order' => [
                'use_trait',
                'case',
                'constant_public',
                'constant_protected',
                'constant_private',
                'property_public',
                'property_protected',
                'property_private',
                'construct',
                'destruct',
                'phpunit',
                'method_public',
                'method_protected',
                'method_private',
            ],
        ],
    ]);
