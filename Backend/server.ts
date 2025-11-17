/**
 * Servidor principal - Solo lógica del servidor
 */

/// <reference path="./types/express-session.d.ts" />

import express, { Express, Request, Response } from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Helper para acceder a las propiedades de sesión personalizadas
type SessionWithUser = {
  userId?: number;
  userEmail?: string;
  userRole?: string;
} & session.SessionData;
import {
  initAuthSchema,
  registerUser,
  loginUser,
  createPasswordReset,
  resetPassword,
  validateResetToken
} from "./auth/auth.js";

import { verifyMailer, sendTestEmail, sendPasswordResetEmail } from "./services/mailer.js";
import productosRouter from "./routes/productos.js";
import animalesRouter from "./routes/animales.js";
import turnosRouter from "./routes/turnos.js";
import comprasRouter from "./routes/compras.js";
import formulariosRouter from "./routes/formularios.js";

// Importar rutas
import productsRouter from "./routes/products.js";
import cartRouter from "./routes/cart.js";
import couponsRouter from "./routes/coupons.js";
import petsRouter from "./routes/pets.js";
import appointmentsRouter from "./routes/appointments.js";

dotenv.config();


// Definir __dirname para módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();




const PORT = Number(process.env.PORT || 3001);
const SESSION_SECRET = process.env.SESSION_SECRET || "dev_secret";
const APP_BASE_URL = process.env.APP_BASE_URL || `http://localhost:${PORT}`;

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de sesiones con PostgreSQL
const PgSession = connectPgSimple(session as any);
app.use(
  (session as any)({
    store: new PgSession({
      conString: process.env.DATABASE_URL,
      tableName: "session",
      createTableIfMissing: true,
    }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true, sameSite: "lax", secure: false }
  })
);

// CORREGIR RUTA: desde dist/Backend/ necesitamos ir a ../frontend/vistas
// __dirname será dist/Backend cuando está compilado
const FRONT_DIR = path.resolve(__dirname, "../../frontend/vistas");
const STYLES_DIR = path.resolve(__dirname, "../../frontend/styles");
console.log("FRONT_DIR configurado como:", FRONT_DIR);
console.log("STYLES_DIR configurado como:", STYLES_DIR);

// Configurar EJS como motor de vistas
app.set("view engine", "ejs");
app.set("views", FRONT_DIR);

// DEFINIR RUTAS DIRECTAMENTE PRIMERO (ANTES de static files y routers)
app.get("/api/test-direct", (_req, res) => {
  console.log("✅ Ruta /api/test-direct fue llamada");
  res.json({ ok: true, message: "Ruta directa funciona!" });
});

app.get("/api/productos", async (_req, res) => {
  try {
    console.log("✅ Ruta /api/productos (directa) fue llamada");
    const prisma = (await import("./lib/prisma.js")).default;
    const productos = await prisma.productos.findMany({
      orderBy: { idproducto: "asc" },
    });
    res.json({ ok: true, productos });
  } catch (e: any) {
    console.error("Error en /api/productos (directa):", e);
    res.status(500).json({ ok: false, error: e.message || "Error al obtener productos" });
  }
});

app.get("/api/animales", async (_req, res) => {
  try {
    console.log("✅ Ruta /api/animales (directa) fue llamada");
    const prisma = (await import("./lib/prisma.js")).default;
    const animales = await prisma.animal.findMany({
      orderBy: { idanimal: "asc" },
    });
    res.json({ ok: true, animales });
  } catch (e: any) {
    console.error("Error en /api/animales (directa):", e);
    res.status(500).json({ ok: false, error: e.message || "Error al obtener animales" });
  }
});

console.log("✓ Rutas directas de API montadas");

// NOTA: Las rutas de productos y animales están definidas directamente arriba
// Los routers se pueden usar más adelante si se necesitan

// Montar otros routers (turnos, compras, formularios) que no tienen rutas directas
console.log("\n=== Montando routers adicionales ===");
try {
  app.use("/api/turnos", turnosRouter);
  console.log("✓ Router /api/turnos montado");
  
  app.use("/api/compras", comprasRouter);
  console.log("✓ Router /api/compras montado");
  
  app.use("/api/formularios", formulariosRouter);
  console.log("✓ Router /api/formularios montado");
  
  console.log("=== Routers adicionales montados ===\n");
} catch (error: any) {
  console.error("❌ Error al montar routers:", error);
  console.error("Stack:", error.stack);
}

// Ahora montar archivos estáticos DESPUÉS de las rutas de API
// Servir CSS y otros assets desde /styles
app.use("/styles", express.static(STYLES_DIR));
// Servir archivos estáticos desde vistas
app.use(express.static(FRONT_DIR));
// También servir desde frontend para rutas absolutas
app.use("/frontend", express.static(path.resolve(__dirname, "../../frontend")));

// Rutas de páginas 
app.get("/login", (_req, res) => {
  res.render("login/login", { error: null });
});


app.get("/register", (_req, res) => {
  res.sendFile(path.join(FRONT_DIR, "register/register.html"));
});

app.get("/admin", (req, res) => {
  // Verificar que el usuario tenga rol de admin
  const session = req.session as SessionWithUser;
  if (session.userRole !== "admin") {
    return res.redirect("/login");
  }
  res.sendFile(path.join(FRONT_DIR, "admin.html"));
});

app.get("/doc", (req, res) => {
  // Verificar que el usuario tenga rol de doctor/veterinario
  const session = req.session as SessionWithUser;
  if (session.userRole !== "doctor" && session.userRole !== "veterinario") {
    return res.redirect("/login");
  }
  res.sendFile(path.join(FRONT_DIR, "doc.html"));
});



app.get("/adopciones",(_req, res) => {
  res.sendFile(path.join(FRONT_DIR, "adopciones/adopciones.html"));
});


app.get("/tienda",(_req, res) => {
  res.sendFile(path.join(FRONT_DIR, "tienda/tienda.html"));
});




app.get("/api-test", (_req, res) => {
  res.sendFile(path.join(FRONT_DIR, "api-test.html"));
});


// Health check
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Rutas de autenticación
app.post("/api/register", async (req, res) => {
  try {
    const { name, lastname, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ ok: false, error: "faltan datos" });
    const user = await registerUser({ name, lastname, email, password });
    const session = req.session as SessionWithUser;
    session.userId = user.id;
    session.userEmail = email;
    res.status(201).json({ ok: true, data: { id: user.id, email } });
  } catch (e: any) {
    res.status(400).json({ ok: false, error: e.message || "error en registro" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await loginUser(email, password);
    const session = req.session as SessionWithUser;
    session.userId = user.id;
    session.userEmail = user.email;
    session.userRole = user.role;

    // Redirigir según el rol del usuario
    let redirectUrl = "/";
    if (user.role === "admin") {
      redirectUrl = "/admin";
    } else if (user.role === "doctor" || user.role === "veterinario") {
      redirectUrl = "/doc";
    } else {
      redirectUrl = "/"; // usuario normal -> index.html
    }

    res.json({ ok: true, user, redirect: redirectUrl });
  } catch (e: any) {
    res.status(401).json({ ok: false, error: e.message || "credenciales invalidas" });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(FRONT_DIR, "index.html"));
});

app.get("/api/session", (req, res) => {
  const session = req.session as SessionWithUser;
  if (session.userId) {
    return res.json({ 
      loggedIn: true, 
      user: { 
        id: session.userId, 
        email: session.userEmail,
        role: session.userRole 
      } 
    });
  }
  return res.json({ loggedIn: false });
});

app.post("/api/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ ok: false, error: "no se pudo cerrar sesion" });
    res.clearCookie("connect.sid");
    res.json({ ok: true });
  });
});

app.post("/api/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ ok: false, error: "email requerido" });
    const result = await createPasswordReset(email);
    if (result) {
      const resetUrl = `${APP_BASE_URL}/api/reset-password/${result.token}`;
      const sent = await sendPasswordResetEmail(email, resetUrl);
      console.log("forgot sent:", sent);
    } else {
      console.log("forgot user not found");
    }
    return res.json({ ok: true, message: "si el email existe se enviaron instrucciones" });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e.message || "error al solicitar reseteo" });
  }
});

app.get("/api/reset-password/:token", async (req, res) => {
  const token = req.params.token;
  const row = await validateResetToken(token);
  if (!row) return res.status(400).json({ ok: false, error: "token invalido o expirado" });
  return res.redirect(`/frontend/vistas/login/reset.html?token=${token}`);
});

app.post("/api/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ ok: false, error: "datos invalidos" });
    await resetPassword(token, password);
    return res.json({ ok: true, message: "contrasena actualizada" });
  } catch (e: any) {
    return res.status(400).json({ ok: false, error: e.message || "no se pudo actualizar la contrasena" });
  }
});

// Rutas de email (testing)
app.get("/api/smtp-verify", async (_req, res) => {
  const ok = await verifyMailer();
  res.json({ ok });
});

app.post("/api/smtp-test", async (req, res) => {
  const { to } = req.body || {};
  if (!to) return res.status(400).json({ ok: false, error: "to requerido" });
  const ok = await sendTestEmail(to);
  res.json({ ok });
});

// Rutas de API (modulares)
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/coupons", couponsRouter);
app.use("/api/pets", petsRouter);
app.use("/api/appointments", appointmentsRouter);

// Redirects
app.get("/frontend/vistas/register/index.html", (_req, res) => {
  res.redirect(301, "/frontend/vistas/register/register.html");
});


// Middleware para debug: mostrar todas las rutas registradas
app.use((req, res, next) => {
  if (req.url === '/debug-routes') {
    const routes: any[] = [];
    app._router?.stack?.forEach((middleware: any) => {
      if (middleware.route) {
        routes.push({
          path: middleware.route.path,
          methods: Object.keys(middleware.route.methods)
        });
      } else if (middleware.name === 'router') {
        routes.push({
          path: middleware.regexp.toString(),
          router: true
        });
      }
    });
    return res.json({ routes, appRouter: !!app._router });
  }
  next();
});

initAuthSchema().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀 Servidor iniciado en http://localhost:${PORT}`);
    console.log(`\n📋 Endpoints disponibles:`);
    console.log(`  - GET  /api/health`);
    console.log(`  - GET  /api/productos`);
    console.log(`  - GET  /api/animales`);
    console.log(`  - GET  /api/turnos`);
    console.log(`  - GET  /api/compras`);
    console.log(`  - GET  /api/formularios`);
    console.log(`  - GET  /api-test (página de pruebas)`);
    console.log(`  - GET  /debug-routes (debug: ver rutas registradas)`);
    console.log(`📁 Frontend disponible en /frontend`);
    console.log(`🔌 API disponible en /api\n`);
  });
}).catch((error) => {
  console.error("❌ Error al iniciar el servidor:", error);
  console.error("Stack:", error.stack);
  process.exit(1);
});
