<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Surfaces\RecordForm;

use TYPO3\CMS\Backend\Form\Container\SingleFieldContainer;
use Wazum\VisualPermissions\AllowValues\ValueChoices;

/**
 * @phpstan-import-type SelectConfiguration from ValueChoices
 */
final class AnchorEmittingFieldContainer extends SingleFieldContainer
{
    /**
     * @return array<string, mixed>
     */
    public function render(): array
    {
        /** @var array<string, mixed> $result */
        $result = parent::render();

        /** @var string $table */
        $table = $this->data['tableName'];
        /** @var string $fieldName */
        $fieldName = $this->data['fieldName'];
        /** @var string $html */
        $html = $result['html'];
        /** @var array{uid?: string|int} $record */
        $record = $this->data['databaseRow'];
        $uid = $record['uid'] ?? '';

        $renderer = new FieldAnchorRenderer();
        $result['html'] = $renderer->wrap(
            $this->labelled($html, $fieldName) . $this->otherKinds($renderer, $fieldName, $table . '-' . $uid . '-' . $fieldName),
            $table,
            $fieldName,
            $uid,
            $this->inlineParent(),
            $this->allows($fieldName),
            $this->choices($fieldName),
        );

        return $result;
    }

    private function labelled(string $html, string $fieldName): string
    {
        if ('' === trim($html) || str_contains($html, 'form-label') || !$this->getBackendUserAuthentication()->isAdmin()) {
            return $html;
        }

        /** @var array{columns?: array<string, array{label?: string}>} $processedTca */
        $processedTca = $this->data['processedTca'];
        $label = $this->getLanguageService()->sL($processedTca['columns'][$fieldName]['label'] ?? $fieldName);

        return '<label class="form-label">' . htmlspecialchars($label, ENT_QUOTES) . '</label>' . $html;
    }

    // Each record is drawn with the fields of its own type, so what the other types show is listed after them
    private function otherKinds(FieldAnchorRenderer $renderer, string $fieldName, string $holder): string
    {
        /**
         * @var array{columns?: array<string, array{
         *     config?: array{type?: string, foreign_table?: string},
         *     children?: list<array{recordTypeValue?: string|int}>
         * }>} $processedTca
         */
        $processedTca = $this->data['processedTca'];
        $configuration = $processedTca['columns'][$fieldName]['config'] ?? [];
        if (!$this->getBackendUserAuthentication()->isAdmin() || !\in_array($configuration['type'] ?? '', ['inline', 'file'], true)) {
            return '';
        }

        $childTable = $configuration['foreign_table'] ?? '';
        /**
         * @var array<string, array{ctrl?: array{title?: string}, columns?: array<string, array{label?: string}>}> $tableConfigurations
         */
        $tableConfigurations = $GLOBALS['TCA'];
        $language = $this->getLanguageService();

        $held = array_map(
            static fn(array $child): string => (string) ($child['recordTypeValue'] ?? ''),
            $processedTca['columns'][$fieldName]['children'] ?? [],
        );

        $labels = [];
        foreach ((new FormFields())->shownOnlyByTypesOtherThan($childTable, $held) as $childField) {
            $labels[$childField] = $language->sL($tableConfigurations[$childTable]['columns'][$childField]['label'] ?? $childField);
        }

        return $renderer->otherKinds(
            \sprintf(
                $language->sL('LLL:EXT:visual_permissions/Resources/Private/Language/locallang.xlf:grantFields.otherKinds'),
                $language->sL($tableConfigurations[$childTable]['ctrl']['title'] ?? $childTable),
            ),
            $childTable,
            $labels,
            $holder,
        );
    }

    private function inlineParent(): string
    {
        /** @var string $table */
        $table = $this->data['inlineParentTableName'] ?? '';
        /** @var string|int $uid */
        $uid = $this->data['inlineParentUid'] ?? '';
        /** @var string $fieldName */
        $fieldName = $this->data['inlineParentFieldName'] ?? '';

        return '' === $table ? '' : $table . '-' . $uid . '-' . $fieldName;
    }

    private function allows(string $fieldName): string
    {
        if ('pages' === $this->data['tableName'] && 'doktype' === $fieldName) {
            return 'pageTypes';
        }

        /** @var array{columns?: array<string, array{config?: array{authMode?: string}}>} $processedTca */
        $processedTca = $this->data['processedTca'];

        return isset($processedTca['columns'][$fieldName]['config']['authMode']) ? 'fieldValues' : '';
    }

    /**
     * @return array<string, mixed>
     */
    private function choices(string $fieldName): array
    {
        $allows = $this->allows($fieldName);
        if ('' === $allows) {
            return [];
        }

        /**
         * @var array{columns: array<string, array{config: SelectConfiguration}>} $processedTca
         */
        $processedTca = $this->data['processedTca'];

        return (new ValueChoices($this->getLanguageService()))->of($allows, $processedTca['columns'][$fieldName]['config']);
    }
}
