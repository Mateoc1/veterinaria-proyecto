import express from "express";
import session from "express-session";
import SQLiteStoreFactory from "connect-sqlite3";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import {
  initAuthSchema,
  registerUser,
  loginUser,
  createPasswordReset,
  resetPassword,
  validateResetToken
} from "./auth/auth";

import { verifyMailer, sendTestEmail, sendPasswordResetEmail } from "./services/mailer";

dotenv.config();
const app = express();

const PORT = Number(process.env.PORT || 3001);
const SESSION_SECRET = process.env.SESSION_SECRET || "dev_secret";
const DB_PATH = process.env.DATABASE_PATH || "./src/database/basededatos.sqlite";
const APP_BASE_URL = process.env.APP_BASE_URL || `http://localhost:${PORT}`;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const SQLiteStore = SQLiteStoreFactory(session);
app.use(
  session({
    store: new SQLiteStore({
      db: path.basename(DB_PATH),
      dir: path.dirname(DB_PATH),
      table: "sessions"
    }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true, sameSite: "lax", secure: false }
  })
);

const FRONT_DIR = path.resolve(__dirname, "../frontend");
app.use("/frontend", express.static(FRONT_DIR));

app.get("/", (_req, res) => res.redirect("/frontend/vistas/login/login.html"));

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.get("/api/smtp-verify", async (_req, res) => {
  const ok = await verifyMailer();
  res.json({ ok });
});

app.post("/api/smtp-test", async (req, res) => {
  const { to } = req.body || {};
  if (!to) return res.status(400).json({ error: "to requerido" });
  const ok = await sendTestEmail(to);
  res.json({ ok });
});

app.post("/api/register", async (req, res) => {
  try {
    const { name, lastname, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "faltan datos" });
    const user = await registerUser({ name, lastname, email, password });
    req.session.userId = user.id;
    req.session.userEmail = email;
    res.status(201).json({ ok: true, user: { id: user.id, email } });
  } catch (e: any) {
    res.status(400).json({ error: e.message || "error en registro" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await loginUser(email, password);
    req.session.userId = user.id;
    req.session.userEmail = user.email;
    res.json({ ok: true, user });
  } catch (e: any) {
    res.status(401).json({ error: e.message || "credenciales invalidas" });
  }
});

app.get("/api/session", (req, res) => {
  if (req.session.userId)
    return res.json({ loggedIn: true, user: { id: req.session.userId, email: req.session.userEmail } });
  return res.json({ loggedIn: false });
});

app.post("/api/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: "no se pudo cerrar sesion" });
    res.clearCookie("connect.sid");
    res.json({ ok: true });
  });
});

app.post("/api/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "email requerido" });
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
    return res.status(500).json({ error: e.message || "error al solicitar reseteo" });
  }
});

app.get("/api/reset-password/:token", async (req, res) => {
  const token = req.params.token;
  const row = await validateResetToken(token);
  if (!row) return res.status(400).json({ error: "token invalido o expirado" });
  return res.redirect(`/frontend/vistas/login/reset.html?token=${token}`);
});

app.post("/api/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ error: "datos invalidos" });
    await resetPassword(token, password);
    return res.json({ ok: true, message: "contrasena actualizada" });
  } catch (e: any) {
    return res.status(400).json({ error: e.message || "no se pudo actualizar la contrasena" });
  }
});

app.get("/frontend/vistas/register/index.html", (_req, res) => {
  res.redirect(301, "/frontend/vistas/register/register.html");
});

initAuthSchema().then(() => {
  app.listen(PORT, () => console.log(`Servidor iniciado en http://localhost:${PORT}`));
});
