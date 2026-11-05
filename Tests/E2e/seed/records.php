<?php

declare(strict_types=1);

$now = 1700000000;
$page = static fn(int $uid, int $pid, string $title, int $sorting, bool $root = false, int $translates = 0): array => [
    'uid' => $uid,
    'pid' => $pid,
    'tstamp' => $now,
    'crdate' => $now,
    'deleted' => 0,
    'hidden' => 0,
    'doktype' => 1,
    'title' => $title,
    'slug' => '/' . strtolower(str_replace(' ', '-', $title)),
    'sorting' => $sorting,
    'is_siteroot' => $root ? 1 : 0,
    'sys_language_uid' => 0 === $translates ? 0 : 1,
    'l10n_parent' => $translates,
    'perms_userid' => 1,
    'perms_groupid' => 0,
    'perms_user' => 31,
    'perms_group' => 31,
    'perms_everybody' => 31,
];

$element = static fn(int $uid, int $pid, string $header, int $sorting, string $kind = 'text'): array => [
    'uid' => $uid,
    'pid' => $pid,
    'tstamp' => $now,
    'crdate' => $now,
    'deleted' => 0,
    'hidden' => 0,
    'CType' => $kind,
    'header' => $header,
    'bodytext' => '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>',
    'sorting' => $sorting,
    'colPos' => 0,
];

$group = static fn(int $uid, string $title, string $subgroup = '', string $modules = ''): array => [
    'uid' => $uid,
    'pid' => 0,
    'tstamp' => $now,
    'crdate' => $now,
    'deleted' => 0,
    'hidden' => 0,
    'title' => $title,
    'subgroup' => $subgroup,
    'groupMods' => $modules,
    'db_mountpoints' => '',
    // a group with subgroups grants nothing itself, so what it has is told apart as inherited
    'tables_select' => '' === $subgroup ? 'pages,tt_content' : '',
    'tables_modify' => '' === $subgroup ? 'pages,tt_content' : '',
    // core marks the title of a page as everyone's, so a grant of it says nothing; nav_title
    // is one a group is given, and the suite needs a field the group may edit
    'non_exclude_fields' => '' === $subgroup ? 'pages:nav_title,tt_content:header' : '',
    'explicit_allowdeny' => '' === $subgroup ? 'tt_content:CType:text' : '',
];

$user = static fn(int $uid, string $username, string $groups): array => [
    'uid' => $uid,
    'pid' => 0,
    'tstamp' => $now,
    'crdate' => $now,
    'deleted' => 0,
    'disable' => 0,
    'starttime' => 0,
    'endtime' => 0,
    'admin' => 0,
    'username' => $username,
    'password' => '$argon2i$v=19$m=65536,t=16,p=1$b0dSWVVoYVFBSWZkMHBMbg$hLpMVdcqCVDLPvA+5BYhkxqkQVQhHPDSc0SOvOCWRJ4',
    'usergroup' => $groups,
    'uc' => '',
];

return [
    'be_users' => [
        $user(2, 'ipsum', '5'),
        $user(3, 'lorem', '6'),
    ],
    'be_groups' => [
        $group(5, 'Aliquam', '', 'web_layout'),
        $group(6, 'Consectetur', '', 'web_list'),
        // a grant of theirs is inherited rather than their own; do not override
        $group(7, 'Dolor', '5'),
        $group(8, 'Elit', '6,7'),
    ],
    'pages' => [
        $page(1, 0, 'Lorem', 256, true),
        $page(25, 1, 'Ipsum', 256),
        $page(26, 25, 'Dolor', 256),
        $page(27, 26, 'Sit', 256),
        $page(30, 1, 'Amet', 512),
        $page(31, 30, 'Consectetur', 256),
        $page(40, 1, 'Adipiscing', 768),
        // Core offers its language views only for a translated page
        $page(125, 1, 'Ipsum auf Deutsch', 256, translates: 25),
    ],
    'tt_content' => [
        $element(1, 25, 'Lorem ipsum', 256),
        $element(2, 25, 'Dolor sit amet', 512),
        // only this kind carries media, and a file reference needs a record to hang on
        $element(3, 25, 'Consectetur', 768, 'textmedia'),
    ],
    // a record of a table the group may not write, so the form carries one it cannot reach
    'sys_file_storage' => [[
        'uid' => 1,
        'pid' => 0,
        'tstamp' => $now,
        'crdate' => $now,
        'deleted' => 0,
        'name' => 'fileadmin',
        'driver' => 'Local',
        'configuration' => '<?xml version="1.0" encoding="utf-8" standalone="yes" ?>'
            . '<T3FlexForms><data><sheet index="sDEF"><language index="lDEF">'
            . '<field index="basePath"><value index="vDEF">fileadmin/</value></field>'
            . '<field index="pathType"><value index="vDEF">relative</value></field>'
            . '</language></sheet></data></T3FlexForms>',
        'is_default' => 1,
        'is_browsable' => 1,
        'is_public' => 1,
        'is_writable' => 1,
        'is_online' => 1,
    ]],
    'sys_filemounts' => [[
        'uid' => 1,
        'pid' => 0,
        'tstamp' => $now,
        'crdate' => $now,
        'deleted' => 0,
        'hidden' => 0,
        'title' => 'Campaign',
        'identifier' => '1:/campaign/',
        'read_only' => 0,
    ]],
    'sys_file' => [[
        'uid' => 1,
        'pid' => 0,
        'tstamp' => $now,
        'storage' => 1,
        'identifier' => '/lorem.txt',
        'identifier_hash' => sha1('/lorem.txt'),
        'folder_hash' => sha1('/'),
        'extension' => 'txt',
        'mime_type' => 'text/plain',
        'name' => 'lorem.txt',
        'size' => 11,
        'type' => 1,
    ]],
    'sys_file_reference' => [[
        'uid' => 1,
        'pid' => 25,
        'tstamp' => $now,
        'crdate' => $now,
        'deleted' => 0,
        'hidden' => 0,
        'uid_local' => 1,
        'uid_foreign' => 3,
        'tablenames' => 'tt_content',
        'fieldname' => 'assets',
        'sorting_foreign' => 1,
        'title' => 'Lorem',
    ]],
];
