<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\BackendGroups;

/**
 * @phpstan-import-type ChainStep from InheritanceChain
 */
final readonly class GroupCatalogue
{
    public function __construct(
        private BackendGroups $groups,
    ) {
    }

    /**
     * @return array<int, array{title: string, disabled: bool, inherits: list<ChainStep>}>
     *
     * @throws \Doctrine\DBAL\Exception
     */
    public function all(): array
    {
        $records = $this->groups->all();

        $groups = [];
        foreach ($records as $id => $record) {
            $groups[$id] = [
                'title' => $record['title'],
                'disabled' => $record['disabled'],
                'inherits' => array_slice(InheritanceChain::startingAt($id, $records)->steps, 1),
            ];
        }

        return $groups;
    }
}
