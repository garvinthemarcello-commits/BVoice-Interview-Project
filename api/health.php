<?php
require __DIR__ . '/_lib/http.php';

if (!methodGuard('GET')) return;

echo json_encode([
    'success' => true,
    'data' => [
        'status' => 'ok',
        'timestamp' => (new DateTime())->format(DateTime::ATOM),
    ],
]);
