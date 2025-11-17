import bcrypt from "bcrypt";
import crypto from "crypto";
import dotenv from "dotenv";
import { prisma } from "../lib/prisma.js";

dotenv.config();

// Esta función ahora no hace nada, pero la dejamos
// para que server.ts pueda seguir llamándola sin romperse.
export async function initAuthSchema() {
  // Con Prisma el esquema lo crean las migraciones,
  // no hace falta crear tablas a mano acá.
}

// ---------- REGISTRO ----------

export async function registerUser(input: {
  name?: string;
  lastname?: string;
  email: string;
  password: string;
}) {
  const { name, lastname, email, password } = input;

  // ¿Ya existe un usuario con ese email?
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    throw new Error("El email ya esta registrado");
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name: name ?? null,
      lastname: lastname ?? null,
      email,
      passwordHash: hash,
      // role y createdAt usan sus defaults
    },
  });

  return { id: user.id, email: user.email };
}

// ---------- LOGIN ----------

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Credenciales invalidas");
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    throw new Error("Credenciales invalidas");
  }

  return { id: user.id, email: user.email, role: user.role };
}

// ---------- CREAR TOKEN DE RESET ----------

export async function createPasswordReset(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) return null;

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

  await prisma.passwordReset.create({
    data: {
      userId: user.id,
      token,
      expiresAt,
      used: false,
    },
  });

  return { token, userId: user.id };
}

// ---------- VALIDAR TOKEN ----------

export async function validateResetToken(token: string) {
  const row = await prisma.passwordReset.findUnique({
    where: { token },
  });

  if (!row) return null;
  if (row.used) return null;
  if (row.expiresAt.getTime() < Date.now()) return null;

  // devolvemos lo que antes devolvía tu función
  return {
    id: row.id,
    user_id: row.userId,
    token: row.token,
  };
}

// ---------- RESET PASSWORD ----------

export async function resetPassword(token: string, newPassword: string) {
  const row = await prisma.passwordReset.findUnique({
    where: { token },
  });

  if (!row || row.used || row.expiresAt.getTime() < Date.now()) {
    throw new Error("Token invalido o expirado");
  }

  const hash = await bcrypt.hash(newPassword, 10);

  // actualizar contraseña del usuario
  await prisma.user.update({
    where: { id: row.userId },
    data: { passwordHash: hash },
  });

  // marcar el token como usado
  await prisma.passwordReset.update({
    where: { id: row.id },
    data: { used: true },
  });

  return true;
}
