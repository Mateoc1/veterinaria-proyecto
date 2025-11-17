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

// ---------- REGISTRO ----------

export async function registerUser(input: {
  name?: string;
  lastname?: string;
  email: string;
  password: string;
}) {
  const { name, lastname, email, password } = input;

  // ¿Ya existe un usuario con ese email?
  const existing = await prisma.users.findUnique({
  
  // Verificar si el usuario ya existe
  const exists = await prisma.user.findUnique({
    where: { email },
  });
  
  if (exists) {
    throw new Error("El email ya esta registrado");
  }
  
  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.users.create({
  
  const user = await prisma.user.create({
    data: {
      name: name ?? null,
      lastname: lastname ?? null,
      email,
      password_hash: hash,
      // role y created_at usan sus defaults
    },
  });

  return { id: user.idusuario, email: user.email };
      passwordHash: hash,
    },
    select: {
      id: true,
      email: true,
    },
  });
  
  return { id: user.id, email: user.email };
}

// ---------- LOGIN ----------

export async function loginUser(email: string, password: string) {
  const user = await prisma.users.findUnique({
    where: { email },
  });
  
  if (!user) {
    throw new Error("Credenciales invalidas");
  }

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    throw new Error("Credenciales invalidas");
  }

  return { id: user.idusuario, email: user.email, role: user.role };
  
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

// ---------- CREAR TOKEN DE RESET ----------

export async function createPasswordReset(email: string) {
  const user = await prisma.users.findUnique({
    where: { email },
  });
  
  if (!user) {
    return null;
  }
  
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

  await prisma.password_resets.create({
    data: {
      user_id: user.idusuario,
      reset_token: token,
      expiration_date: expiresAt,
    },
  });

  return { token, userId: user.idusuario };
  
  await prisma.passwordReset.create({
    data: {
      userId: user.id,
      token,
      expiresAt,
    },
  });
  
  return { token, userId: user.id };
}

// ---------- VALIDAR TOKEN ----------

export async function validateResetToken(token: string) {
  const row = await prisma.password_resets.findFirst({
    where: { reset_token: token },
  });

  if (!row) return null;
  if (row.expiration_date && row.expiration_date.getTime() < Date.now()) return null;

  // devolvemos lo que antes devolvía tu función
  
  if (!row || row.used) {
    return null;
  }
  
  if (row.expiresAt < new Date()) {
    return null;
  }
  
  return {
    id: row.id,
    user_id: row.user_id,
    token: row.reset_token,
  };
}

// ---------- RESET PASSWORD ----------

export async function resetPassword(token: string, newPassword: string) {
  const row = await prisma.password_resets.findFirst({
    where: { reset_token: token },
  });

  if (!row || (row.expiration_date && row.expiration_date.getTime() < Date.now())) {
    throw new Error("Token invalido o expirado");
  }

  const hash = await bcrypt.hash(newPassword, 10);

  // actualizar contraseña del usuario
  await prisma.users.update({
    where: { idusuario: row.user_id },
    data: { password_hash: hash },
  });

  // marcar el token como usado (opcional, ya que solo se usa una vez)
  if (row.id) {
    await prisma.password_resets.update({
      where: { id: row.id },
      data: { reset_token: null },
    });
  }

  return true;
}
