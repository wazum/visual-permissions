<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Authorization;

enum AccessVerdict: string
{
    case AdminOnly = 'adminOnly';
    case Allowed = 'allowed';
    case AllowedAndInherited = 'allowedAndInherited';
    case Denied = 'denied';
    case Inherited = 'inherited';
    case NeverEditable = 'neverEditable';
    case NotApplicable = 'notApplicable';
}
