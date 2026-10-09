<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Tests\Functional\Fixtures;

use TYPO3\CMS\Backend\Form\Element\AbstractFormElement;

final class LabellessElement extends AbstractFormElement
{
    /**
     * @return array<string, mixed>
     */
    public function render(): array
    {
        /** @var array<string, mixed> $result */
        $result = $this->initializeResultArray();
        $result['html'] = '<div class="table-fit"><table class="table"><tr><td>A report</td></tr></table></div>';

        return $result;
    }
}
