const form = document.getElementById("registerForm") as HTMLFormElement;
const errP = document.getElementById("regError") as HTMLParagraphElement;

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  errP.textContent = "";

  const firstName = (document.getElementById("firstName") as HTMLInputElement).value.trim();
  const lastName  = (document.getElementById("lastName") as HTMLInputElement).value.trim();
  const email     = (document.getElementById("regEmail") as HTMLInputElement).value.trim();
  const pass      = (document.getElementById("regPass") as HTMLInputElement).value;
  const pass2     = (document.getElementById("regPass2") as HTMLInputElement).value;

  if (pass !== pass2) {
    errP.textContent = "Las contraseñas no coinciden.";
    return;
  }

  try {
    const resp = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password: pass }),
    });
    const data = await resp.json();
    if (!data.ok) {
      errP.textContent = data.message || "No se pudo registrar el usuario.";
      return;
    }
    alert("Usuario creado. Ahora podés iniciar sesión.");
    window.location.href = "./index.html";
  } catch (err) {
    errP.textContent = "Error de red.";
  }
});
