<?php
/**
 * PDO MySQL connection, shared across requests via a static instance.
 * Query helpers mirror the old Postgres wrapper's shape (all/get/run) so
 * the JS controller logic ports over with minimal changes.
 */

function getPdo(): PDO
{
    static $pdo = null;

    if ($pdo === null) {
        $config = require __DIR__ . '/../config.php';

        $dsn = "mysql:host={$config['host']};dbname={$config['name']};charset=utf8mb4";
        $pdo = new PDO($dsn, $config['user'], $config['pass'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    }

    return $pdo;
}

class Query
{
    /** SELECT many rows. */
    public static function all(string $sql, array $params = []): array
    {
        $stmt = getPdo()->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    /** SELECT one row (or null). */
    public static function get(string $sql, array $params = []): ?array
    {
        $stmt = getPdo()->prepare($sql);
        $stmt->execute($params);
        $row = $stmt->fetch();
        return $row === false ? null : $row;
    }

    /** INSERT / UPDATE / DELETE. */
    public static function run(string $sql, array $params = []): array
    {
        $stmt = getPdo()->prepare($sql);
        $stmt->execute($params);
        return ['rowCount' => $stmt->rowCount()];
    }
}
