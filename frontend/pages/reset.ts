/**
 * Página de Reset Password - Lógica del cliente
 */

import { api } from "../services/api";

function qs<T extends Element>(sel: string): T {
  const el = document.querySelector(sel);
  if (!el) throw new Error(`Elemento no encontrado: ${sel}`);
  return el as T;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = qs<HTMLFormElement>("#resetForm");
  const passwordInput = qs<HTMLInputElement>("#password");
  const confirmInput = qs<HTMLInputElement>("#confirm");
  const msgEl = qs<HTMLParagraphElement>("#msg");

  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  if (!token) {
    msgEl.textContent = "Token no válido";
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msgEl.textContent = "";

    const password = passwordInput.value;
    const confirm = confirmInput.value;

    if (password !== confirm) {
      msgEl.textContent = "Las contrasenas no coinciden";
      return;
    }

    try {
      const response = await api.resetPassword(token, password);
      if (response.ok) {
        msgEl.textContent = "Contrasena actualizada";
        setTimeout(() => {
          window.location.href = "/frontend/vistas/login/login.html";
        }, 1000);
      } else {
        msgEl.textContent = response.error || "Error";
      }
    } catch (err: any) {
      msgEl.textContent = err.message || "Error de red";
    }
  });
});

