<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Configuration;

use TYPO3\CMS\Core\Configuration\ExtensionConfiguration;

final readonly class Settings
{
    public function __construct(
        private ExtensionConfiguration $extensionConfiguration,
    ) {
    }

    public function animation(): bool
    {
        return $this->flag('animation');
    }

    public function toggleKey(): string
    {
        return $this->key('shortcut/toggle');
    }

    public function switchUserKey(): string
    {
        return $this->key('shortcut/switchUser');
    }

    public function keysOnButtons(): bool
    {
        return $this->flag('shortcut/show');
    }

    private function flag(string $path): bool
    {
        return (bool) $this->extensionConfiguration->get('visual_permissions', $path);
    }

    private function key(string $path): string
    {
        $value = $this->extensionConfiguration->get('visual_permissions', $path);
        $key = \is_string($value) ? strtolower(trim($value)) : '';

        return 1 === \strlen($key) ? $key : '';
    }
}
