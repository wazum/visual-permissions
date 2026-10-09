<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\AllowValues;

use TYPO3\CMS\Core\Localization\LanguageService;

/**
 * @phpstan-type TcaItem array{label: string, value: string|int, icon?: string|null, group?: string}
 * @phpstan-type SelectConfiguration array{items?: list<TcaItem>, itemGroups?: array<string, string>}
 */
final readonly class ValueChoices
{
    public const DIVIDER = '--div--';

    public function __construct(private LanguageService $language)
    {
    }

    /**
     * @param SelectConfiguration $configuration the field's configuration as the form drew it
     *
     * @return array{title: string, groups: list<array{label: string, values: list<array{value: string, label: string, icon: string}>}>}
     */
    public function of(string $allows, array $configuration): array
    {
        $groups = [];
        $heading = '';
        foreach ($configuration['items'] ?? [] as $item) {
            if (self::DIVIDER === $item['value']) {
                $heading = $item['label'];

                continue;
            }

            $group = $item['group'] ?? $heading;
            $groups[$group] ??= ['label' => $this->language->sL($configuration['itemGroups'][$group] ?? $group), 'values' => []];
            $groups[$group]['values'][] = [
                'value' => (string) $item['value'],
                'label' => $this->language->sL($item['label']),
                'icon' => $item['icon'] ?? '',
            ];
        }

        return ['title' => $this->language->sL($this->titleOf($allows)), 'groups' => array_values($groups)];
    }

    private function titleOf(string $allows): string
    {
        return 'LLL:EXT:visual_permissions/Resources/Private/Language/locallang.xlf:allowedValues.title.' . $allows;
    }
}
