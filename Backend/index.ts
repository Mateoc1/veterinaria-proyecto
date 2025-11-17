import "dotenv/config";
import express from "express";
import cors from "cors";
import { registerUser, loginUser, initAuthSchema } from "./auth/auth.js";
import prisma from "./lib/prisma.js";
import path from "path";
import { fileURLToPath } from "url";

// Definir __dirname para módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde frontend
app.use(express.static(path.join(__dirname, 'frontend')));

// Inicializar esquema de autenticación al arrancar
initAuthSchema().catch(console.error);

/*app.get("/", (_req, res) => {
  res.send("Servidor funcionando correctamente 🚀");
});*/


// Esta ruta debe existir o el archivo debe estar en static
/*app.get('/', (req, res) => {
  res.render('login', { title: 'Login' });
});*/

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/vistas/index.html"));
});

app.get("/admin", (_req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/vistas/admin.html"));
});

app.get("/register", (_req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/vistas/register/register.html"));
});

// Rutas para otras vistas
app.get("/adopciones", (_req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/vistas/adopciones/adopciones.html"));
});

app.get("/tienda", (_req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/vistas/tienda/tienda.html"));
});

app.get("/metricas", (_req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/vistas/metricas/metricas.html"));
});

// Simple DB health check
app.get("/db/health", async (_req, res) => {
  try {
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
  console.log(`Servidor disponible en http://localhost:${PORT}`);
});