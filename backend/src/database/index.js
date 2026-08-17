/**
 * SQLite connection singleton.
 * Uses sqlite3 (async) with a thin promise-based wrapper so controllers
 * can use async/await. The database file is created at data/bvoice.db.
 */

const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const DATA_DIR = path.join(__dirname, '../../data');
const DB_PATH = path.join(DATA_DIR, 'bvoice.db');

// Ensure the data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const db = new sqlite3.Database(DB_PATH);

// Recommended pragmas
db.run('PRAGMA journal_mode = WAL');
db.run('PRAGMA foreign_keys = ON');

/**
 * Run the schema file so tables exist before any query.
 */
function initSchema() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf-8');
  db.exec(sql);
}

initSchema();

/**
 * Promise-based helpers wrapping the sqlite3 callback API.
 */
const query = {
  /** SELECT many rows. */
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  /** SELECT one row. */
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  /** INSERT / UPDATE / DELETE — returns { lastID, changes }. */
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  },
};

module.exports = db;
module.exports.query = query;
