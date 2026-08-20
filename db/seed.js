/**
 * Applies the schema and seeds divisions + sample candidates.
 * Run with: npm run db:seed
 * Requires POSTGRES_URL (or DATABASE_URL) in the environment.
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pg from 'pg';

const { Pool } = pg;

const __dirname = dirname(fileURLToPath(import.meta.url));

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
if (!connectionString) {
  console.error('Missing POSTGRES_URL (or DATABASE_URL) environment variable.');
  process.exitCode = 1;
  process.exit();
}

const pool = new Pool({
  connectionString,
  ssl: connectionString.includes('sslmode=') ? undefined : { rejectUnauthorized: false },
});

const DIVISIONS = [
  { name: 'Announcer',    description: 'The voice behind the mic — bringing energy and stories to every broadcast.' },
  { name: 'Marketing',    description: 'Building the brand, reaching audiences, and driving creative campaigns.' },
  { name: 'Creative',     description: 'Designing visuals, concepts, and the look that defines our identity.' },
  { name: 'Reporter',     description: 'Covering events and crafting the stories that keep our community informed.' },
  { name: 'Music Lister', description: 'Curating playlists and discovering fresh tracks for every show.' },
  { name: 'Operator',     description: 'Managing the technical backbone that keeps every transmission running smooth.' },
];

// 40 realistic Indonesian candidates with 10-digit NIMs (BINUS-style).
// 25 accepted (assigned a division) + 15 rejected (division = null).
// Short demo NIMs are preserved at the top for quick manual testing:
//   123 = Marketing (passed)   1234  = Announcer   12345 = Creative
//   999 = failed               12346 = Reporter    12347 = Music Lister
//                             12348 = Operator
const CANDIDATES = [
  // ── Short demo NIMs (kept for quick testing) ──────────────────────────
  { nim: '123',       full_name: 'Andi Pratama',     email: 'andi.pratama@binus.ac.id',        phone: '0812-1111-2222', passed: true,  divisionName: 'Marketing',    interviewDate: '2025-01-15 10:00' },
  { nim: '999',       full_name: 'Budi Santoso',     email: 'budi.santoso@binus.ac.id',        phone: '0813-2222-3333', passed: false, divisionName: null,           interviewDate: '2025-01-15 14:00' },
  { nim: '1234',      full_name: 'Citra Lestari',    email: 'citra.lestari@binus.ac.id',       phone: '0813-3333-4444', passed: true,  divisionName: 'Announcer',    interviewDate: '2025-01-16 09:30' },
  { nim: '12345',     full_name: 'Dewi Anggraini',   email: 'dewi.anggraini@binus.ac.id',      phone: '0815-5555-6666', passed: true,  divisionName: 'Creative',     interviewDate: '2025-01-16 13:00' },
  { nim: '12346',     full_name: 'Fajar Nugraha',    email: 'fajar.nugraha@binus.ac.id',       phone: '0817-7777-8888', passed: true,  divisionName: 'Reporter',     interviewDate: '2025-01-17 15:30' },
  { nim: '12347',     full_name: 'Gita Maharani',    email: 'gita.maharani@binus.ac.id',       phone: '0818-9999-0000', passed: true,  divisionName: 'Music Lister', interviewDate: '2025-01-18 10:15' },
  { nim: '12348',     full_name: 'Hadi Kurniawan',   email: 'hadi.kurniawan@binus.ac.id',      phone: '0819-1234-5678', passed: true,  divisionName: 'Operator',     interviewDate: '2025-01-18 14:45' },

  // ── Accepted (25 total, including the 6 demo NIMs above = 19 more) ────
  { nim: '3002717134', full_name: 'Rangga Wijaya',     email: 'rangga.wijaya@binus.ac.id',       phone: '0812-3456-7890', passed: true,  divisionName: 'Announcer',    interviewDate: '2025-02-03 09:00' },
  { nim: '3002717156', full_name: 'Salsabila Putri',   email: 'salsabila.putri@binus.ac.id',     phone: '0813-4567-8901', passed: true,  divisionName: 'Announcer',    interviewDate: '2025-02-03 10:30' },
  { nim: '3002717189', full_name: 'Yoga Permana',      email: 'yoga.permana@binus.ac.id',        phone: '0857-1234-5678', passed: true,  divisionName: 'Announcer',    interviewDate: '2025-02-03 13:00' },
  { nim: '3002717212', full_name: 'Nabila Rahmawati',  email: 'nabila.rahmawati@binus.ac.id',    phone: '0821-2345-6789', passed: true,  divisionName: 'Announcer',    interviewDate: '2025-02-04 09:30' },

  { nim: '3002717234', full_name: 'Reza Aditya',       email: 'reza.aditya@binus.ac.id',         phone: '0815-6789-0123', passed: true,  divisionName: 'Marketing',    interviewDate: '2025-02-04 11:00' },
  { nim: '3002717258', full_name: 'Tiara Kusuma',      email: 'tiara.kusuma@binus.ac.id',        phone: '0817-8901-2345', passed: true,  divisionName: 'Marketing',    interviewDate: '2025-02-04 14:00' },
  { nim: '3002717271', full_name: 'Bagas Saputra',     email: 'bagas.saputra@binus.ac.id',       phone: '0819-0123-4567', passed: true,  divisionName: 'Marketing',    interviewDate: '2025-02-05 09:00' },

  { nim: '3002717318', full_name: 'Galang Pratomo',    email: 'galang.pratomo@binus.ac.id',      phone: '0813-8901-2345', passed: true,  divisionName: 'Creative',     interviewDate: '2025-02-06 10:00' },
  { nim: '3002717342', full_name: 'Kirana Maharani',   email: 'kirana.maharani@binus.ac.id',     phone: '0856-9012-3456', passed: true,  divisionName: 'Creative',     interviewDate: '2025-02-06 13:00' },
  { nim: '3002717365', full_name: 'Dimas Anggara',     email: 'dimas.anggara@binus.ac.id',       phone: '0822-3456-7890', passed: true,  divisionName: 'Creative',     interviewDate: '2025-02-07 09:30' },

  { nim: '3002717402', full_name: 'Rizki Ramadhan',    email: 'rizki.ramadhan@binus.ac.id',      phone: '0812-9012-3456', passed: true,  divisionName: 'Reporter',     interviewDate: '2025-02-10 09:00' },
  { nim: '3002717426', full_name: 'Putri Aisyah',      email: 'putri.aisyah@binus.ac.id',        phone: '0813-0123-4567', passed: true,  divisionName: 'Reporter',     interviewDate: '2025-02-10 11:30' },

  { nim: '3002717473', full_name: 'Sekar Ayu',         email: 'sekar.ayu@binus.ac.id',           phone: '0815-3456-7890', passed: true,  divisionName: 'Music Lister', interviewDate: '2025-02-12 09:30' },
  { nim: '3002717497', full_name: 'Bayu Setiawan',     email: 'bayu.setiawan@binus.ac.id',       phone: '0817-4567-8901', passed: true,  divisionName: 'Music Lister', interviewDate: '2025-02-12 13:00' },

  { nim: '3002717534', full_name: 'Eko Susanto',       email: 'eko.susanto@binus.ac.id',         phone: '0812-6789-0123', passed: true,  divisionName: 'Operator',     interviewDate: '2025-02-14 09:00' },
  { nim: '3002717558', full_name: 'Diah Pitaloka',     email: 'diah.pitaloka@binus.ac.id',       phone: '0813-7890-1234', passed: true,  divisionName: 'Operator',     interviewDate: '2025-02-14 13:30' },
  { nim: '3002717571', full_name: 'Teguh Iman',        email: 'teguh.iman@binus.ac.id',          phone: '0856-8901-2345', passed: true,  divisionName: 'Operator',     interviewDate: '2025-02-17 10:00' },

  { nim: '3002717588', full_name: 'Adelia Kencana',    email: 'adelia.kencana@binus.ac.id',      phone: '0821-0123-4567', passed: true,  divisionName: 'Music Lister', interviewDate: '2025-02-13 14:00' },
  { nim: '3002717601', full_name: 'Pranata Wibowo',    email: 'pranata.wibowo@binus.ac.id',      phone: '0838-2345-6789', passed: true,  divisionName: 'Reporter',     interviewDate: '2025-02-11 13:30' },

  // ── Rejected (15 total, including the 1 demo NIM above = 14 more) ─────
  { nim: '3002717618', full_name: 'Joko Prabowo',      email: 'joko.prabowo@binus.ac.id',        phone: '0812-1122-3344', passed: false, divisionName: null,           interviewDate: '2025-02-18 09:30' },
  { nim: '3002717632', full_name: 'Wulan Sari',        email: 'wulan.sari@binus.ac.id',          phone: '0813-2233-4455', passed: false, divisionName: null,           interviewDate: '2025-02-18 11:00' },
  { nim: '3002717645', full_name: 'Ferry Gunawan',     email: 'ferry.gunawan@binus.ac.id',       phone: '0857-3344-5566', passed: false, divisionName: null,           interviewDate: '2025-02-18 13:30' },
  { nim: '3002717669', full_name: 'Ratna Dewi',        email: 'ratna.dewi@binus.ac.id',          phone: '0815-4455-6677', passed: false, divisionName: null,           interviewDate: '2025-02-19 09:00' },
  { nim: '3002717683', full_name: 'Surya Hartanto',    email: 'surya.hartanto@binus.ac.id',      phone: '0817-5566-7788', passed: false, divisionName: null,           interviewDate: '2025-02-19 10:30' },
  { nim: '3002717706', full_name: 'Maya Lestari',      email: 'maya.lestari@binus.ac.id',        phone: '0819-6677-8899', passed: false, divisionName: null,           interviewDate: '2025-02-19 13:00' },
  { nim: '3002717720', full_name: 'Ilham Maulana',     email: 'ilham.maulana@binus.ac.id',       phone: '0812-7788-9900', passed: false, divisionName: null,           interviewDate: '2025-02-20 09:30' },
  { nim: '3002717743', full_name: 'Cahya Utami',       email: 'cahya.utami@binus.ac.id',         phone: '0813-8899-0011', passed: false, divisionName: null,           interviewDate: '2025-02-20 11:00' },
  { nim: '3002717767', full_name: 'Rudi Hartono',      email: 'rudi.hartono@binus.ac.id',        phone: '0821-9900-1122', passed: false, divisionName: null,           interviewDate: '2025-02-20 14:00' },
  { nim: '3002717780', full_name: 'Siti Nurhaliza',    email: 'siti.nurhaliza@binus.ac.id',      phone: '0856-0011-2233', passed: false, divisionName: null,           interviewDate: '2025-02-21 09:00' },
  { nim: '3002717804', full_name: 'Aldo Saputra',      email: 'aldo.saputra@binus.ac.id',        phone: '0815-1122-3344', passed: false, divisionName: null,           interviewDate: '2025-02-21 10:30' },
  { nim: '3002717828', full_name: 'Kartika Sari',      email: 'kartika.sari@binus.ac.id',        phone: '0817-2233-4455', passed: false, divisionName: null,           interviewDate: '2025-02-21 13:30' },
  { nim: '3002717841', full_name: 'Hendra Wijaya',     email: 'hendra.wijaya@binus.ac.id',       phone: '0819-3344-5566', passed: false, divisionName: null,           interviewDate: '2025-02-24 09:00' },
  { nim: '3002717865', full_name: 'Lina Marlina',      email: 'lina.marlina@binus.ac.id',        phone: '0812-4455-6677', passed: false, divisionName: null,           interviewDate: '2025-02-24 11:00' },
];

async function seed() {
  console.log('Applying schema…');
  const schemaSql = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
  await pool.query(schemaSql);

  console.log('Seeding database…');
  await pool.query('DELETE FROM candidates');
  await pool.query('DELETE FROM divisions');

  for (const d of DIVISIONS) {
    await pool.query('INSERT INTO divisions (name, description) VALUES ($1, $2)', [d.name, d.description]);
  }

  const divisionByName = async (name) => {
    if (!name) return null;
    const { rows } = await pool.query('SELECT id FROM divisions WHERE name = $1', [name]);
    return rows[0] ? rows[0].id : null;
  };

  for (const c of CANDIDATES) {
    const divisionId = await divisionByName(c.divisionName);
    await pool.query(
      `INSERT INTO candidates
         (nim, full_name, email, phone_number, division_id, passed, interview_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [c.nim, c.full_name, c.email, c.phone, divisionId, c.passed, c.interviewDate],
    );
  }

  console.log(`Seeded ${DIVISIONS.length} divisions and ${CANDIDATES.length} candidates.`);
}

seed()
  .catch((err) => {
    console.error('Seed failed:', err.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
