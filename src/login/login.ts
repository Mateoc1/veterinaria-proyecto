import { loginUser } from "../auth/auth.js";

const form = document.getElementById("loginForm") as HTMLFormElement;
const emailInput = document.getElementById("loginEmail") as HTMLInputElement;
const passInput  = document.getElementById("loginPass") as HTMLInputElement;
const errorBox   = document.getElementById("loginError") as HTMLParagraphElement;
const recoverBtn = document.getElementById("recoverBtn") as HTMLButtonElement;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  errorBox.textContent = "";

  const email = emailInput.value.trim();
  const pass  = passInput.value;

  if (!email || !pass) {
    errorBox.textContent = "Completá email y contraseña.";
    return;
  }

  const res = loginUser(email, pass);
  if (res.ok) {
    alert("¡Bienvenido!");
    form.reset();
  } else {
    errorBox.textContent = res.message || "No se pudo iniciar sesión.";
  }
});

recoverBtn.addEventListener("click", () => {
  alert("Recuperación de contraseña aún no implementada.");
});
