/**
 * Autenticación usando Prisma con PostgreSQL
 */

import bcrypt from "bcrypt";
import crypto from "crypto";
import { prisma } from "../lib/prisma";

export async function initAuthSchema() {
  // Prisma crea las tablas automáticamente con las migraciones
  // Solo verificamos la conexión
  try {
    await prisma.$connect();
    console.log("✅ Conectado a PostgreSQL con Prisma");
  } catch (error) {
    console.error("❌ Error conectando a PostgreSQL:", error);
    throw error;
  }
}

export async function registerUser(input: {
  name?: string;
  lastname?: string;
  email: string;
  password: string;
}) {
  const { name, lastname, email, password } = input;
  
  // Verificar si el usuario ya existe
  const exists = await prisma.user.findUnique({
    where: { email },
  });
  
  if (exists) {
    throw new Error("El email ya esta registrado");
  }
  
  const hash = await bcrypt.hash(password, 10);
  
  const user = await prisma.user.create({
    data: {
      name: name ?? null,
      lastname: lastname ?? null,
      email,
      passwordHash: hash,
    },
    select: {
      id: true,
      email: true,
    },
  });
  
  return { id: user.id, email: user.email };
}

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
  
  return {
    id: user.id,
    email: user.email,
    role: user.role,
  };
}

export async function createPasswordReset(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  
  if (!user) {
    return null;
  }
  
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
  
  await prisma.passwordReset.create({
    data: {
      userId: user.id,
      token,
      expiresAt,
    },
  });
  
  return { token, userId: user.id };
}

export async function validateResetToken(token: string) {
  const row = await prisma.passwordReset.findUnique({
    where: { token },
  });
  
  if (!row || row.used) {
    return null;
  }
  
  if (row.expiresAt < new Date()) {
    return null;
  }
  
  return {
    id: row.id,
    user_id: row.userId,
    token: row.token,
  };
}

export async function resetPassword(token: string, newPassword: string) {
  const row = await validateResetToken(token);
  
  if (!row) {
    throw new Error("Token invalido o expirado");
  }
  
  const hash = await bcrypt.hash(newPassword, 10);
  
  await prisma.$transaction([
    prisma.user.update({
      where: { id: row.user_id },
      data: { passwordHash: hash },
    }),
    prisma.passwordReset.update({
      where: { id: row.id },
      data: { used: true },
    }),
  ]);
  
  return true;
}
