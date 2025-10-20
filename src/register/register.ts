import { isValidEmail, registerUser } from "../auth/auth.js";

const form      = document.getElementById("registerForm") as HTMLFormElement;
const firstName = document.getElementById("firstName")    as HTMLInputElement;
const lastName  = document.getElementById("lastName")     as HTMLInputElement;
const email     = document.getElementById("regEmail")     as HTMLInputElement;
const pass      = document.getElementById("regPass")      as HTMLInputElement;
const pass2     = document.getElementById("regPass2")     as HTMLInputElement;
const errorBox  = document.getElementById("regError")     as HTMLParagraphElement;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  errorBox.textContent = "";

  if (!firstName.value.trim() || !lastName.value.trim()) {
    errorBox.textContent = "Ingresá nombre y apellido.";
    return;
  }
  if (!isValidEmail(email.value.trim())) {
    errorBox.textContent = "Email inválido.";
    return;
  }
  if (pass.value.length < 6) {
    errorBox.textContent = "La contraseña debe tener al menos 6 caracteres.";
    return;
  }
  if (pass.value !== pass2.value) {
    errorBox.textContent = "Las contraseñas no coinciden.";
    return;
  }

  const res = registerUser({
    firstName: firstName.value.trim(),
    lastName : lastName.value.trim(),
    email    : email.value.trim(),
    password : pass.value
  });

  if (res.ok) {
    alert("Registro exitoso. Ahora podés iniciar sesión.");
    form.reset();
    window.location.href = "./login.html";
  } else {
    errorBox.textContent = res.message || "No se pudo registrar el usuario.";
  }
});
