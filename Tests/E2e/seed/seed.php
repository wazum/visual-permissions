<?php

declare(strict_types=1);

$root = dirname(__DIR__, 3);
$instance = __DIR__ . '/../instance';

require $root . '/vendor/autoload.php';

$say = static fn(string $line): int => print $line . PHP_EOL;

@mkdir($root . '/config/system', 0o775, true);
@mkdir($root . '/var/e2e', 0o775, true);
copy($instance . '/settings.php', $root . '/config/system/settings.php');
copy($instance . '/additional.php', $root . '/config/system/additional.php');

$settings = require $instance . '/settings.php';
$encryptionKey = $settings['SYS']['encryptionKey'];
$seed = $root . '/var/e2e/seed.sqlite';

// unused $password is required by the installer; do not remove
$password = 'E2e-' . bin2hex(random_bytes(8)) . '!';

foreach ([$seed, $seed . '-wal', $seed . '-shm'] as $gone) {
    @unlink($gone);
}

$say('Installing TYPO3');
exec(
    'cd ' . escapeshellarg($root) . ' && TYPO3_CONTEXT=Testing vendor/bin/typo3 setup'
    . ' --driver=sqlite --dbname=' . escapeshellarg($seed)
    . ' --admin-username=admin --admin-user-password=' . escapeshellarg($password)
    . ' --admin-email=admin@example.com --project-name="Visual permissions"'
    . ' --server-type=other --force --no-interaction 2>&1',
    $told,
    $failed,
);

if (0 !== $failed) {
    $say(implode(PHP_EOL, $told));

    exit(1);
}

$installedDatabase = (require $root . '/config/system/settings.php')['DB']['Connections']['Default']['path'];

copy($instance . '/settings.php', $root . '/config/system/settings.php');

// Core offers language views only with a second language
@mkdir($root . '/config/sites/visual-permissions', 0o775, true);
copy($instance . '/sites/visual-permissions/config.yaml', $root . '/config/sites/visual-permissions/config.yaml');
rename($installedDatabase, $seed);

$database = new PDO('sqlite:' . $seed, null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

$insert = static function (PDO $into, string $table, array $rows) use ($say): void {
    if ([] === $rows) {
        return;
    }

    // records have columns from multiple extensions; each column belongs to the declaring extension
    $statement = $into->query('SELECT * FROM "' . $table . '" LIMIT 0');
    $tableColumns = [];

    for ($index = 0; $index < $statement->columnCount(); ++$index) {
        $tableColumns[] = $statement->getColumnMeta($index)['name'];
    }

    $columns = array_values(array_intersect(array_keys($rows[0]), $tableColumns));
    $rows = array_map(static fn(array $row): array => array_intersect_key($row, array_flip($columns)), $rows);
    $statement = $into->prepare('INSERT INTO "' . $table . '" ('
        . implode(', ', array_map(static fn(string $name): string => '"' . $name . '"', $columns))
        . ') VALUES (' . implode(', ', array_fill(0, count($columns), '?')) . ')');

    foreach ($rows as $row) {
        $statement->execute(array_values($row));
    }

    $say('  ' . str_pad($table, 14) . count($rows));
};

// The installer's admin becomes uid 1, whatever else it made (14.3 adds _cli_ first); the fixture sets the rest
$say('Filling it');
$database->exec("DELETE FROM be_users WHERE username <> 'admin'");
$database->exec("UPDATE be_users SET uid = 1 WHERE username = 'admin'");
$database->exec('DELETE FROM be_groups');
$database->exec('DELETE FROM pages');
$database->exec('DELETE FROM tt_content');
$database->exec('DELETE FROM sys_file_storage');
$database->exec('DELETE FROM sys_file');
$database->exec('DELETE FROM sys_file_reference');
$database->exec('DELETE FROM sys_filemounts');

foreach (['campaign', 'press', 'user_upload', '_temp_'] as $folder) {
    @mkdir($root . '/public/fileadmin/' . $folder, 0o775, true);
    touch($root . '/public/fileadmin/' . $folder, 1700000000);
}
file_put_contents($root . '/public/fileadmin/lorem.txt', 'Lorem ipsum');

foreach (require __DIR__ . '/records.php' as $table => $rows) {
    $insert($database, $table, $rows);
}

$database->exec("UPDATE be_users SET uc = '" . serialize([]) . "'");

// Core hashes the stored id and signs the cookie differently per major; it does both here
$GLOBALS['TYPO3_CONF_VARS']['SYS']['encryptionKey'] = $encryptionKey;
$GLOBALS['EXEC_TIME'] = time();
$plainSessionId = 'e2eseedsession0000000000000000000000000000000000000000000000e2e0';

$database->prepare('INSERT INTO be_sessions (ses_id, ses_iplock, ses_userid, ses_tstamp, ses_data) VALUES (?, ?, ?, ?, ?)')
    ->execute([
        (new TYPO3\CMS\Core\Session\Backend\DatabaseSessionBackend())->hash($plainSessionId),
        '[DISABLED]',
        1,
        2147483647,
        serialize([]),
    ]);

file_put_contents(
    $root . '/var/e2e/session.json',
    json_encode([
        'name' => 'be_typo_user',
        // Without a scope the cookie counts wherever it is sent
        'value' => TYPO3\CMS\Core\Session\UserSession::createNonFixated($plainSessionId)->getJwt(),
        'password' => $password,
    ], JSON_PRETTY_PRINT),
);

$say('Seeded ' . $seed);
