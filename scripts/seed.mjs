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
  console.log('Seed completed. Admin login: allanochieng307@gmail.com / Admin@12345');
};

run().then(()=>db.close());


