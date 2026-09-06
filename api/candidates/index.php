<?php
require __DIR__ . '/../_lib/http.php';
require __DIR__ . '/../_lib/db.php';
require __DIR__ . '/../_lib/candidates.php';

if (!methodGuard('GET')) return;

try {
    $rows = Query::all(SELECT_WITH_DIVISION . ' ORDER BY c.full_name ASC');
    $data = array_map('mapCandidateRow', $rows);
    echo json_encode(['success' => true, 'count' => count($data), 'data' => $data]);
} catch (Throwable $err) {
    serverError($err);
}
