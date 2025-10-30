import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbFile = process.env.DB_FILE || path.join(dataDir, 'app.db');
const db = new Database(dbFile);

db.exec(`
  CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
  );
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role_id INTEGER NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
    FOREIGN KEY(role_id) REFERENCES roles(id)
  );
  CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    campus TEXT NOT NULL,
    category TEXT NOT NULL,
    priority TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Open',
    location TEXT DEFAULT '',
    created_by INTEGER,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
  );
  CREATE TABLE IF NOT EXISTS campuses (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    lat TEXT NOT NULL,
    lon TEXT NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
  );
  CREATE TABLE IF NOT EXISTS training_programs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    campus TEXT,
    date_text TEXT,
    source TEXT NOT NULL DEFAULT 'pdf',
    created_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
  );
`);

const roleNames = ['administrator','staff','participants','student'];
for (const name of roleNames) {
  try {
    db.prepare('INSERT INTO roles (name) VALUES (?)').run(name);
  } catch {}
}

function getRoleId(name){
  const row = db.prepare('SELECT id FROM roles WHERE name = ?').get(name);
  return row?.id;
}

async function ensureUser(name, email, password, roleName){
  const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (exists) return;
  const hash = await bcrypt.hash(password, 10);
  db.prepare('INSERT INTO users (name,email,password_hash,role_id) VALUES (?,?,?,?)')
    .run(name, email, hash, getRoleId(roleName));
}

const run = async () => {
  await ensureUser('System Administrator', 'allanochieng307@gmail.com', 'Admin@12345', 'administrator');
  await ensureUser('Staff One', 'staff1@ksg.ac.ke', 'Password@123', 'staff');
  await ensureUser('Participant One', 'participant1@example.com', 'Password@123', 'participants');
  await ensureUser('Student One', 'student1@example.com', 'Password@123', 'student');
  // Seed campuses
  const campuses = [
    { id: 'nairobi', name: 'Nairobi', lat: '-1.2921', lon: '36.8219' },
    { id: 'mombasa', name: 'Mombasa', lat: '-4.0435', lon: '39.6682' },
    { id: 'baringo', name: 'Baringo', lat: '0.4667', lon: '35.9667' },
    { id: 'embu', name: 'Embu', lat: '-0.5326', lon: '37.459' },
    { id: 'matuga', name: 'Matuga', lat: '-4.335', lon: '39.56' },
  ];
  for (const c of campuses) {
    try { db.prepare('INSERT INTO campuses (id,name,lat,lon) VALUES (?,?,?,?)').run(c.id, c.name, c.lat, c.lon); } catch {}
  }
  // Seed training programs from PDF text (best-effort)
  try {
    const pdfMod = await import('pdf-parse');
    const pdfParse = pdfMod.default ?? pdfMod;
    const fs = await import('node:fs');
    const path = await import('node:path');
    const p = path.join(process.cwd(), 'public', 'docs', 'ksg_training_calender.pdf');
    if (fs.existsSync(p)) {
      const buf = fs.readFileSync(p);
      const parsed = await pdfParse(buf);
      const lines = String(parsed.text || '')
        .split(/\r?\n/)
        .map(l => l.trim())
        .filter(l => l.length > 8 && /[A-Za-z]/.test(l));
      // Heuristic: take unique, non-trivial lines as titles; limit to 150 to avoid noise
      const seen = new Set();
      const rows = [];
      for (const line of lines) {
        const key = line.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        rows.push({ title: line, campus: '', date_text: '' });
        if (rows.length >= 150) break;
      }
      const insert = db.prepare('INSERT INTO training_programs (title,campus,date_text,source) VALUES (?,?,?,?)');
      for (const r of rows) { try { insert.run(r.title, r.campus, r.date_text, 'pdf'); } catch {} }
    }
  } catch {}
  console.log('Seed completed. Admin login: allanochieng307@gmail.com / Admin@12345');
};

run().then(()=>db.close());


