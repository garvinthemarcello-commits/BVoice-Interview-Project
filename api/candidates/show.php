<?php
// Handles /api/candidates/{nim}, rewritten here by api/.htaccess.
require __DIR__ . '/../_lib/http.php';
require __DIR__ . '/../_lib/db.php';
require __DIR__ . '/../_lib/candidates.php';

if (!methodGuard('GET')) return;

$nim = $_GET['nim'] ?? null;

try {
    $row = Query::get(SELECT_WITH_DIVISION . ' WHERE c.nim = ?', [$nim]);

    if (!$row) {
        notFound("No candidate found for NIM \"$nim\"");
        return;
    }

    echo json_encode(['success' => true, 'data' => mapCandidateRow($row)]);
} catch (Throwable $err) {
    serverError($err);
}
