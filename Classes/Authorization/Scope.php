<?php

declare(strict_types=1);

namespace Wazum\VisualPermissions\Authorization;

enum Scope: string
{
    case Fields = 'fields';
    case FieldValues = 'fieldValues';
    case FileMounts = 'fileMounts';
    case FileOperations = 'fileOperations';
    case Modules = 'modules';
    case PageMounts = 'pageMounts';
    case PageTypes = 'pageTypes';
    case TablesModify = 'tablesModify';
    case TablesSelect = 'tablesSelect';
}
