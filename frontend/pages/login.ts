/**
 * Página de Login - Lógica del cliente
 */

import { api } from "../services/api";

function qs<T extends Element>(sel: string): T {
  const el = document.querySelector(sel);
  if (!el) throw new Error(`Elemento no encontrado: ${sel}`);
  return el as T;
}

async function checkSession() {
  const response = await api.getSession();
  if (response.ok && response.data?.loggedIn) {
    window.location.href = "/";
  }
}

async function doLogin(email: string, password: string) {
  const response = await api.login(email, password);
  if (!response.ok) {
    throw new Error(response.error || "Error de login");
  }
  return response.data;
}

async function requestPasswordReset(email: string) {
  const response = await api.forgotPassword(email);
  if (!response.ok) {
    throw new Error(response.error || "No se pudo solicitar el reseteo");
  }
  return response.data;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

document.addEventListener("DOMContentLoaded", async () => {
  await checkSession();

  const form = qs<HTMLFormElement>("#loginForm");
  const emailInput = qs<HTMLInputElement>("#loginEmail");
  const passInput = qs<HTMLInputElement>("#loginPass");
  const errorEl = qs<HTMLParagraphElement>("#loginError");
  const recoverBtn = qs<HTMLButtonElement>("#recoverBtn");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.textContent = "";
    const email = emailInput.value.trim();
    const password = passInput.value;

    if (!email || !password) {
      errorEl.textContent = "Completa email y contrasena";
      return;
    }
    try {
      await doLogin(email, password);
      window.location.href = "/";
    } catch (err: any) {
      errorEl.textContent = err.message || "Credenciales invalidas";
    }
  });

  recoverBtn.addEventListener("click", async () => {
    errorEl.textContent = "";
    const email = prompt("Ingresar email para recuperar contrasena:");
    if (!email) return;
    const trimmed = email.trim();
    if (!isValidEmail(trimmed)) {
      errorEl.textContent = "Email invalido";
      return;
    }
    try {
      await requestPasswordReset(trimmed);
      alert("Si el email existe recibiras instrucciones");
    } catch (err: any) {
      errorEl.textContent = err.message || "No se pudo solicitar el reseteo";
    }
  });
});

