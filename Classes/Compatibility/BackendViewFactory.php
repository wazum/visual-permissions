<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Compatibility;

use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Backend\View\BackendViewFactory as CoreBackendViewFactory;
use TYPO3\CMS\Core\Information\Typo3Version;
use TYPO3\CMS\Core\View\ViewInterface;
use TYPO3\CMS\Fluid\View\FluidViewAdapter;

final readonly class BackendViewFactory
{
    private const PACKAGE = 'wazum/visual-permissions';

    public function __construct(
        private CoreBackendViewFactory $coreFactory,
        private Typo3Version $typo3Version,
    ) {
    }

    public function create(ServerRequestInterface $request): ViewInterface
    {
        $view = $this->coreFactory->create($request, [self::PACKAGE]);
        if ($this->typo3Version->getMajorVersion() < 14 && $view instanceof FluidViewAdapter) {
            $view->getRenderingContext()->getTemplatePaths()->setFormat('fluid.html');
        }

        return $view;
    }
}
