export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const USERS_KEY = "users";

function loadUsers(): User[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); }
  catch { return []; }
}

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
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
  return { ok: true };
}

export function loginUser(email: string, password: string): { ok: boolean; message?: string } {
  const users = loadUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  return user ? { ok: true } : { ok: false, message: "Email o contraseña incorrectos." };
}
