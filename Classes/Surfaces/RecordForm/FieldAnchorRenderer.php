<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Surfaces\RecordForm;

final readonly class FieldAnchorRenderer
{
    /**
     * @param array<string, mixed> $choices
     */
    public function wrap(
        string $html,
        string $table,
        string $fieldName,
        string|int $uid = '',
        string $inside = '',
        string $allows = '',
        array $choices = [],
    ): string {
        if ('' === trim($html)) {
            return $html;
        }

        return sprintf(
            '<fieldset class="vperm-anchor" data-vperm-token="%s" data-vperm-field="%s" data-vperm-inside="%s"%s>%s</fieldset>',
            htmlspecialchars($table . ':' . $fieldName, ENT_QUOTES),
            htmlspecialchars($table . '-' . $uid . '-' . $fieldName, ENT_QUOTES),
            htmlspecialchars($inside, ENT_QUOTES),
            '' === $allows ? '' : sprintf(
                ' data-vperm-allows="%s" data-vperm-choices="%s"',
                htmlspecialchars($allows, ENT_QUOTES),
                htmlspecialchars(json_encode($choices, JSON_THROW_ON_ERROR), ENT_QUOTES),
            ),
            $html,
        );
    }

    /**
     * @param array<string, string> $labels field name => label
     */
    public function otherKinds(string $heading, string $table, array $labels, string $inside): string
    {
        if ([] === $labels) {
            return '';
        }

        $rows = '';
        foreach ($labels as $fieldName => $label) {
            $rows .= '<div class="form-group">' . $this->wrap(
                '<label class="form-label">' . htmlspecialchars($label, ENT_QUOTES) . '</label>',
                $table,
                $fieldName,
                inside: $inside,
            ) . '</div>';
        }

        return sprintf(
            '<div class="vperm-other-kinds"><div class="form-section-headline">%s</div>%s</div>',
            htmlspecialchars($heading, ENT_QUOTES),
            $rows,
        );
    }
}
