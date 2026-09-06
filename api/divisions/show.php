<?php
// Handles /api/divisions/{id}, rewritten here by api/.htaccess.
require __DIR__ . '/../_lib/http.php';
require __DIR__ . '/../_lib/db.php';

if (!methodGuard('GET')) return;

$id = $_GET['id'] ?? null;

try {
    $row = Query::get('SELECT id, name, description, created_at FROM divisions WHERE id = ?', [$id]);

    if (!$row) {
        notFound("Division with ID \"$id\" not found");
        return;
    }

    echo json_encode(['success' => true, 'data' => $row]);
} catch (Throwable $err) {
    serverError($err);
}
