import "dotenv/config";
import express from "express";
import cors from "cors";
import { registerUser, loginUser, initAuthSchema } from "./auth/auth";
import prisma from "./lib/prisma";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Inicializar esquema de autenticación al arrancar
initAuthSchema().catch(console.error);

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
    res.status(201).json({ ok: true, ...result });
  } catch (e: any) {
    const message = e?.message || "Error en el servidor";
    res.status(400).json({ ok: false, message });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ ok: false, message: "Email y contraseña son requeridos" });
    }
    const result = await loginUser(email, password);
    res.status(200).json({ ok: true, ...result });
  } catch (e: any) {
    const message = e?.message || "Error en el servidor";
    res.status(401).json({ ok: false, message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor disponible en el puerto ${PORT}`);
});
