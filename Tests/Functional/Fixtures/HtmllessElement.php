<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Functional\Fixtures;

use TYPO3\CMS\Backend\Form\Element\AbstractFormElement;

final class HtmllessElement extends AbstractFormElement
{
    /**
     * @return array<string, mixed>
     */
    public function render(): array
    {
        /** @var array<string, mixed> $result */
        $result = $this->initializeResultArray();
        $result['html'] = null;

        return $result;
    }
}
