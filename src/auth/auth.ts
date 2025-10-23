import { readFileSync, writeFileSync } from "fs";
import path from "path";
import bcrypt from "bcrypt";

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string; // bcrypt hash
}

const USERS_FILE = path.join(process.cwd(), "users.json");

function loadUsers(): User[] {
  try {
    const raw = readFileSync(USERS_FILE, "utf-8");
    return JSON.parse(raw) as User[];
  } catch {
    return [];
  }
}

function saveUsers(users: User[]) {
  writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}

export async function registerUser(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  const { firstName, lastName, email, password } = data;

  if (!firstName || !lastName || !email || !password) {
    return { ok: false, message: "Faltan datos" };
  }

  const users = loadUsers();
  const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return { ok: false, message: "El email ya está registrado." };
  }

  const rounds = 12;
  const passwordHash = await bcrypt.hash(password, rounds);

  users.push({ firstName, lastName, email, passwordHash });
  saveUsers(users);

  return { ok: true, message: "Usuario creado" };
}

export async function loginUser(data: { email: string; password: string }) {
  const { email, password } = data;
  const users = loadUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return { ok: false, message: "Email o contraseña incorrectos." };
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return { ok: false, message: "Email o contraseña incorrectos." };
  }

  return {
    ok: true,
    message: "Login correcto",
    user: { firstName: user.firstName, lastName: user.lastName, email: user.email },
  };
}
