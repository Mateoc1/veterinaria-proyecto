import express from "express";
import cors from "cors";
import { registerUser, loginUser } from "./auth/auth";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Servidor funcionando correctamente 🚀");
});

app.post("/auth/register", async (req, res) => {
  try {
    const result = await registerUser(req.body);
    const status = result.ok ? 201 : 400;
    res.status(status).json(result);
  } catch (e) {
    res.status(500).json({ ok: false, message: "Error en el servidor" });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const result = await loginUser(req.body);
    const status = result.ok ? 200 : 401;
    res.status(status).json(result);
  } catch (e) {
    res.status(500).json({ ok: false, message: "Error en el servidor" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor disponible en el puerto ${PORT}`);
});


