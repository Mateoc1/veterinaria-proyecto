import "dotenv/config";
import express from "express";
import cors from "cors";
import { registerUser, loginUser } from "./auth/auth";
import prisma from "./lib/prisma";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Servidor funcionando correctamente 🚀");
});

// Simple DB health check
app.get("/db/health", async (_req, res) => {
  try {
    // Run a lightweight query to test connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      ok: true, 
      message: "DB connection OK",
      database: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'unknown'
    });
  } catch (e: any) {
    const errorMessage = e?.message || String(e);
    const errorCode = e?.code || 'UNKNOWN';
    res.status(500).json({ 
      ok: false, 
      message: "DB connection failed", 
      error: errorMessage,
      code: errorCode,
      hint: "Verifica que PostgreSQL esté corriendo y que la URL en .env sea correcta"
    });
  }
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
