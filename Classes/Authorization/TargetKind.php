<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Authorization;

enum TargetKind: string
{
    case AdminOnly = 'adminOnly';
    case Allowable = 'allowable';
    case NeverEditable = 'neverEditable';
    case NotApplicable = 'notApplicable';
}
