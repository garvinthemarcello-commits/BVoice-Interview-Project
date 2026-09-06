<?php
/**
 * Small helpers shared by every /api handler: consistent JSON envelopes,
 * a method guard, and a catch-all error responder.
 */

header('Content-Type: application/json');

function methodGuard(string $allowed): bool
{
    if ($_SERVER['REQUEST_METHOD'] !== $allowed) {
        header("Allow: $allowed");
        http_response_code(405);
        echo json_encode(['success' => false, 'error' => ['message' => 'Method not allowed', 'code' => 405]]);
        return false;
    }
    return true;
}

function notFound(string $message): void
{
    http_response_code(404);
    echo json_encode(['success' => false, 'error' => ['message' => $message, 'code' => 404]]);
}

function serverError(Throwable $err): void
{
    error_log((string) $err);
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => ['message' => 'Internal server error', 'code' => 500]]);
}
