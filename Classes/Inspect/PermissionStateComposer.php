<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Inspect;

use Wazum\VisualPermissions\Authorization\AccessVerdict;
use Wazum\VisualPermissions\Authorization\Verdicts;
use Wazum\VisualPermissions\BackendGroups\InheritanceChain;
use Wazum\VisualPermissions\GrantFields\FieldCatalogue;
use Wazum\VisualPermissions\GrantModules\ModuleCatalogue;
use Wazum\VisualPermissions\GrantTables\TableCatalogue;

/**
 * @phpstan-import-type ChainStep from InheritanceChain
 */
final readonly class PermissionStateComposer
{
    public function __construct(
        private Verdicts $verdicts,
        private FieldCatalogue $fieldCatalogue,
        private ModuleCatalogue $moduleCatalogue,
        private TableCatalogue $tableCatalogue,
    ) {
    }

    /**
     * @param array<int, array{
     *     title: string,
     *     subgroups: list<int>,
     *     fields?: list<string>,
     *     modules?: list<string>,
     *     pageMounts?: list<int>,
     *     fileMounts?: list<string>,
     *     tablesModify?: list<string>,
     *     tablesSelect?: list<string>,
     *     fieldValues?: list<string>,
     *     pageTypes?: list<string>,
     *     fileOperations?: list<string>
     * }>             $groups
     * @param list<string> $tables
     *
     * @return array{
     *     group: array{id: int, title: string},
     *     chain: list<ChainStep>,
     *     scopes: array{
     *         fields: array{targets: array<string, string>, givenBy: array<string, list<int>>},
     *         fieldValues: array{targets: array<string, string>},
     *         modules: array{targets: array<string, string>},
     *         pageMounts: array{targets: array<int, string>},
     *         pageTypes: array{targets: array<string, string>},
     *         fileMounts: array{targets: array<string, string>},
     *         fileOperations: array{targets: array<string, string>},
     *         tablesModify: array{targets: array<string, string>},
     *         tablesSelect: array{targets: array<string, string>}
     *     }
     * }
     */
    public function compose(int $groupId, array $groups, array $tables = []): array
    {
        $chain = InheritanceChain::startingAt($groupId, $groups);
        $chainIds = array_column($chain->steps, 'groupId');

        $fields = [];
        $fieldValues = [];
        $fileMounts = [];
        $fileOperations = [];
        $modules = [];
        $pageMounts = [];
        $pageTypes = [];
        $tablesModify = [];
        $tablesSelect = [];
        foreach ($chainIds as $id) {
            $fields[$id] = $groups[$id]['fields'] ?? [];
            $fieldValues[$id] = $groups[$id]['fieldValues'] ?? [];
            $fileMounts[$id] = $groups[$id]['fileMounts'] ?? [];
            $fileOperations[$id] = $groups[$id]['fileOperations'] ?? [];
            $modules[$id] = $groups[$id]['modules'] ?? [];
            $pageMounts[$id] = $groups[$id]['pageMounts'] ?? [];
            $pageTypes[$id] = $groups[$id]['pageTypes'] ?? [];
            $tablesModify[$id] = $groups[$id]['tablesModify'] ?? [];
            // Core folds tables_modify into tables_select: whoever may write a table may read it
            $tablesSelect[$id] = [...$groups[$id]['tablesSelect'] ?? [], ...$tablesModify[$id]];
        }

        $fieldTargets = [];
        foreach ($tables as $table) {
            $fieldTargets += $this->fieldCatalogue->of($table);
        }

        return [
            'group' => ['id' => $groupId, 'title' => $groups[$groupId]['title']],
            'chain' => $chain->steps,
            'scopes' => [
                'fields' => $this->values(
                    array_intersect_key($this->verdicts->resolve($chainIds, $fields, $fieldTargets), $fieldTargets),
                ) + ['givenBy' => array_intersect_key($this->verdicts->givenBy($chainIds, $fields), $fieldTargets)],
                'fieldValues' => $this->values($this->verdicts->resolve($chainIds, $fieldValues)),
                'fileMounts' => $this->values($this->verdicts->resolve($chainIds, $fileMounts)),
                'fileOperations' => $this->values($this->verdicts->resolve($chainIds, $fileOperations)),
                'modules' => $this->values($this->verdicts->resolve($chainIds, $modules, $this->moduleCatalogue->all())),
                'pageMounts' => $this->values($this->verdicts->resolve($chainIds, $pageMounts)),
                'pageTypes' => $this->values($this->verdicts->resolve($chainIds, $pageTypes)),
                'tablesModify' => $this->values(
                    $this->verdicts->resolve($chainIds, $tablesModify, $this->tableCatalogue->all()),
                ),
                'tablesSelect' => $this->values(
                    $this->verdicts->resolve($chainIds, $tablesSelect, $this->tableCatalogue->all()),
                ),
            ],
        ];
    }

    /**
     * @template Target of array-key
     *
     * @param array<Target, AccessVerdict> $verdicts
     *
     * @return array{targets: array<Target, string>}
     */
    private function values(array $verdicts): array
    {
        return ['targets' => array_map(static fn(AccessVerdict $verdict): string => $verdict->value, $verdicts)];
    }
}
