<?php
require __DIR__ . '/../_lib/http.php';
require __DIR__ . '/../_lib/db.php';

if (!methodGuard('GET')) return;

try {
    $rows = Query::all('SELECT id, name, description, created_at FROM divisions ORDER BY id ASC');
    echo json_encode(['success' => true, 'count' => count($rows), 'data' => $rows]);
} catch (Throwable $err) {
    serverError($err);
}
