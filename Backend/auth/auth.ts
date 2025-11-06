import bcrypt from "bcrypt";
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const DB_PATH = process.env.DATABASE_PATH || "./src/database/basededatos.sqlite";

let dbPromise: Promise<Database<sqlite3.Database, sqlite3.Statement>> | null = null;

export function getDb() {
  if (!dbPromise) {
    dbPromise = open({
      filename: DB_PATH,
      driver: sqlite3.Database,
    });
  }
  return dbPromise;
}

export async function initAuthSchema() {
  const db = await getDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      lastname TEXT,
      email TEXT UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS password_resets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires_at DATETIME NOT NULL,
      used INTEGER DEFAULT 0,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);
}

export async function registerUser(input: {
  name?: string;
  lastname?: string;
  email: string;
  password: string;
}) {
  const db = await getDb();
  const { name, lastname, email, password } = input;
  const exists = await db.get(`SELECT id FROM users WHERE email = ?`, [email]);
  if (exists) {
    throw new Error("El email ya esta registrado");
  }
  const hash = await bcrypt.hash(password, 10);
  const result = await db.run(
    `INSERT INTO users (name, lastname, email, password_hash) VALUES (?, ?, ?, ?)`,
    [name ?? null, lastname ?? null, email, hash]
  );
  return { id: result.lastID, email };
}

export async function loginUser(email: string, password: string) {
  const db = await getDb();
  const user = await db.get(`SELECT * FROM users WHERE email = ?`, [email]);
  if (!user) throw new Error("Credenciales invalidas");
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) throw new Error("Credenciales invalidas");
  return { id: user.id, email: user.email, role: user.role };
}

export async function createPasswordReset(email: string) {
  const db = await getDb();
  const user = await db.get(`SELECT id FROM users WHERE email = ?`, [email]);
  if (!user) return null;
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  await db.run(
    `INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)`,
    [user.id, token, expiresAt.toISOString()]
  );
  return { token, userId: user.id };
}

export async function validateResetToken(token: string) {
  const db = await getDb();
  const row = await db.get(
    `SELECT * FROM password_resets WHERE token = ? AND used = 0`,
    [token]
  );
  if (!row) return null;
  const isExpired = new Date(row.expires_at).getTime() < Date.now();
  if (isExpired) return null;
  return row as { id: number; user_id: number; token: string };
}

export async function resetPassword(token: string, newPassword: string) {
  const db = await getDb();
  const row = await validateResetToken(token);
  if (!row) throw new Error("Token invalido o expirado");
  const hash = await bcrypt.hash(newPassword, 10);
  await db.run(`UPDATE users SET password_hash = ? WHERE id = ?`, [hash, row.user_id]);
  await db.run(`UPDATE password_resets SET used = 1 WHERE id = ?`, [row.id]);
  return true;
}
