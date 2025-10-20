const loginForm = document.getElementById("loginForm") as HTMLFormElement | null;
const loginError = document.getElementById("loginError") as HTMLParagraphElement | null;

loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (loginError) loginError.textContent = "";

  const email = (document.getElementById("loginEmail") as HTMLInputElement).value.trim();
  const password = (document.getElementById("loginPass") as HTMLInputElement).value;

  try {
    const resp = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await resp.json();
    if (!data.ok) {
      if (loginError) loginError.textContent = data.message || "Credenciales inválidas";
      return;
    }
    alert(`Bienvenida/o ${data.user.firstName}`);
    // window.location.href = "./dashboard.html";
  } catch {
    if (loginError) loginError.textContent = "Error de red.";
  }
});
