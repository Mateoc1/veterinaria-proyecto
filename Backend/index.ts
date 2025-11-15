import express from "express";
import cors from "cors";
import { registerUser, loginUser } from "./auth/auth";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Servidor funcionando correctamente");
});

app.post("/auth/register", async (req, res) => {
  try {
    const result = await registerUser(req.body);

    return res.status(201).json({
      ok: true,
      message: "Usuario registrado correctamente",
      user: result
    });

  } catch (e: any) {
    return res.status(400).json({
      ok: false,
      message: e.message || "Error en el servidor"
    });
  }
});


app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await loginUser(email, password);

    return res.status(200).json({
      ok: true,
      user
    });

  } catch (e: any) {
    return res.status(401).json({
      ok: false,
      message: e.message || "Credenciales inválidas"
    });
  }
});


app.listen(PORT, () => {
  console.log(`Servidor disponible en el puerto ${PORT}`);
});
