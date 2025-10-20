import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const DATA_DIR = path.join(__dirname, "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

// cargar usuarios desde users.json
function loadUsers(): User[] {
  try {
    if (!existsSync(USERS_FILE)) {
      // crea un archivo vacio si no existe
      mkdirSync(DATA_DIR, { recursive: true });
      writeFileSync(USERS_FILE, "[]", "utf8");
      return [];
    }

    const data = readFileSync(USERS_FILE, "utf8");
    return JSON.parse(data || "[]");
  } catch (error) {
    console.error("Error al cargar usuarios:", error);
    return [];
  }
}
// esto guarda los usuarios en users.json
function saveUsers(users: User[]): void {
  try {
    mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
  } catch (error) {
    console.error("Error al guardar usuarios:", error);
  }
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function registerUser(newUser: User): { ok: boolean; message?: string } {
  const users = loadUsers();

  if (users.some(u => u.email.toLowerCase() === newUser.email.toLowerCase())) {
    return { ok: false, message: "El email ya está registrado." };
  }

  users.push(newUser);
  saveUsers(users);
  return { ok: true, message: "Usuario registrado con éxito." };
}

export function loginUser(email: string, password: string): { ok: boolean; message?: string } {
  const users = loadUsers();

  const user = users.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  return user
    ? { ok: true, message: "Inicio de sesión exitoso." }
    : { ok: false, message: "Email o contraseña incorrectos." };
}
