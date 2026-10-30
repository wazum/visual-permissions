<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Surfaces\RecordForm;

use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Backend\Form\FormDataProviderInterface;
use TYPO3\CMS\Core\Authentication\BackendUserAuthentication;
use Wazum\VisualPermissions\Configuration\PermissionMode;

final class SwitchedValues implements FormDataProviderInterface
{
    /**
     * @param array<string, mixed> $result
     *
     * @return array<string, mixed>
     */
    public function addData(array $result): array
    {
        if (!PermissionMode::isOn($this->getBackendUser())) {
            return $result;
        }

        /** @var array{request: ServerRequestInterface, tableName: string, databaseRow: array{uid: int|string}, processedTca: array{ctrl: array{type?: string}, columns: array<string, array{onChange?: string}>}} $result */
        /** @var array{vperm?: array{value?: array<string, array<int|string, mixed>>}} $query */
        $query = $result['request']->getQueryParams();
        $switched = $query['vperm']['value'][$result['tableName']][$result['databaseRow']['uid']] ?? null;
        if (!is_array($switched)) {
            return $result;
        }

        $processedTca = $result['processedTca'];
        $switches = array_filter(
            $switched,
            static fn(mixed $value, int|string $fieldName): bool => is_string($value) && TypeSwitch::is($processedTca, (string) $fieldName),
            ARRAY_FILTER_USE_BOTH,
        );
        $result['databaseRow'] = array_replace($result['databaseRow'], $switches);

        return $result;
    }

    private function getBackendUser(): BackendUserAuthentication
    {
        /**
         * @var BackendUserAuthentication $backendUser
         */
        $backendUser = $GLOBALS['BE_USER'];

        return $backendUser;
    }
}
