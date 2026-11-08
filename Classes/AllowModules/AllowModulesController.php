<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\AllowModules;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Backend\Module\ModuleInterface;
use TYPO3\CMS\Backend\Module\ModuleProvider;
use TYPO3\CMS\Backend\Module\ModuleRegistry;
use TYPO3\CMS\Core\Authentication\BackendUserAuthentication;
use TYPO3\CMS\Core\Http\JsonResponse;
use TYPO3\CMS\Core\Localization\LanguageServiceFactory;
use Wazum\VisualPermissions\Authorization\AllowOperations;
use Wazum\VisualPermissions\Authorization\Scope;
use Wazum\VisualPermissions\Authorization\TargetKind;
use Wazum\VisualPermissions\BackendGroups\BackendGroups;
use Wazum\VisualPermissions\Write\GroupWriteController;

/**
 * @extends GroupWriteController<array{target: string, add: bool}>
 */
final readonly class AllowModulesController extends GroupWriteController
{
    public function __construct(
        BackendGroups $groups,
        private ModuleCatalogue $catalogue,
        private ModuleProvider $provider,
        private ModuleRegistry $registry,
        private LanguageServiceFactory $languages,
    ) {
        parent::__construct($groups);
    }

    public function choices(ServerRequestInterface $request): ResponseInterface
    {
        /**
         * @var BackendUserAuthentication $administrator
         */
        $administrator = $request->getAttribute('backend.user');
        $language = $this->languages->createFromUserPreferences($administrator);
        $inMenu = $this->inMenu($administrator);
        $groups = [];
        foreach ($this->catalogue->all() as $identifier => $kind) {
            if (TargetKind::Allowable !== $kind || \in_array($identifier, $inMenu, true)) {
                continue;
            }

            $module = $this->registry->getModule($identifier);
            $main = $module;
            $path = [];
            while (($parent = $main->getParentModule()) instanceof ModuleInterface) {
                array_unshift($path, $language->sL($main->getTitle()));
                $main = $parent;
            }

            $groups[$language->sL($main->getTitle())][] = [
                'value' => $identifier,
                'label' => implode(' › ', $path),
                'icon' => $module->getIconIdentifier(),
                'parent' => $module->getParentIdentifier(),
            ];
        }

        return new JsonResponse(['title' => $language->sL(
            'LLL:EXT:visual_permissions/Resources/Private/Language/locallang.xlf:allowModules.outside.title',
        ), 'groups' => array_map(
            static fn(string $label, array $values): array => ['label' => $label, 'values' => $values],
            array_keys($groups),
            array_values($groups),
        )]);
    }

    protected function operationsFrom(mixed $sent): ?array
    {
        return AllowOperations::from($sent, 'module', $this->allowable(...));
    }

    /**
     * @throws \Doctrine\DBAL\Exception
     */
    protected function answerFor(ServerRequestInterface $request, int $groupId, array $operations): array
    {
        $held = [...$this->groups->listOf($groupId, Scope::Modules), ...array_column($operations, 'target')];
        $parents = array_filter($this->parentsOf($operations), static fn(array $parent): bool => !\in_array($parent['target'], $held, true));
        if ([] === $parents) {
            return [];
        }

        /**
         * @var BackendUserAuthentication $administrator
         */
        $administrator = $request->getAttribute('backend.user');
        $language = $this->languages->createFromUserPreferences($administrator);

        return ['alsoAllowed' => array_values(array_map(
            fn(array $parent): string => $language->sL($this->registry->getModule($parent['target'])->getTitle()),
            $parents,
        ))];
    }

    /**
     * @throws \Doctrine\DBAL\Exception
     */
    protected function writeOperations(int $groupId, array $operations): bool
    {
        return $this->groups->change(
            $groupId,
            Scope::Modules,
            [...$operations, ...$this->parentsOf($operations), ...$this->childrenOf($operations)],
        );
    }

    /**
     * The sidebar shows two levels.
     *
     * @return list<string>
     */
    private function inMenu(BackendUserAuthentication $administrator): array
    {
        $shown = [];
        foreach ($this->provider->getModulesForModuleMenu($administrator) as $main) {
            $shown[] = $main->getIdentifier();
            foreach ($main->getSubModules() as $sub) {
                $shown[] = $sub->getIdentifier();
            }
        }

        return $shown;
    }

    private function allowable(string $module): bool
    {
        return TargetKind::Allowable === ($this->catalogue->all()[$module] ?? null);
    }

    /**
     * @param list<array{target: string, add: bool}> $operations
     *
     * @return list<array{target: string, add: bool}>
     */
    private function parentsOf(array $operations): array
    {
        $parents = [];
        foreach ($operations as $operation) {
            if (!$operation['add']) {
                continue;
            }

            $parent = $this->registry->getModule($operation['target'])->getParentModule();
            while ($parent instanceof ModuleInterface && $this->allowable($parent->getIdentifier())) {
                $parents[$parent->getIdentifier()] = ['target' => $parent->getIdentifier(), 'add' => true];
                $parent = $parent->getParentModule();
            }
        }

        return array_values($parents);
    }

    /**
     * @param list<array{target: string, add: bool}> $operations
     *
     * @return list<array{target: string, add: bool}>
     */
    private function childrenOf(array $operations): array
    {
        $children = [];
        foreach ($operations as $operation) {
            if ($operation['add'] || !$this->registry->hasModule($operation['target'])) {
                continue;
            }

            $below = $this->registry->getModule($operation['target'])->getSubModules();
            while ([] !== $below) {
                $module = array_shift($below);
                $children[$module->getIdentifier()] = ['target' => $module->getIdentifier(), 'add' => false];
                $below = [...$below, ...$module->getSubModules()];
            }
        }

        return array_values($children);
    }
}
