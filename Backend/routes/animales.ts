import { Router } from "express";
import prisma from "../lib/prisma.js";

const router = Router();

// GET /api/animales - Obtener todos los animales
router.get("/", async (_req, res) => {
  try {
    const animales = await prisma.animal.findMany({
      include: {
        duenoRef: {
          select: { idusuario: true, email: true },
        },
      },
      orderBy: { idanimal: "asc" },
    });
    res.json({ ok: true, animales });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || "Error al obtener animales" });
  }
});

// GET /api/animales/adoptables - Obtener animales adoptables (sin dueño)
router.get("/adoptables", async (_req, res) => {
  try {
    const animales = await prisma.animal.findMany({
      where: { dueno: null },
      orderBy: { idanimal: "asc" },
    });
    res.json({ ok: true, animales });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || "Error al obtener animales adoptables" });
  }
});

// GET /api/animales/:id - Obtener un animal por ID
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ ok: false, error: "ID inválido" });
    }
    const animal = await prisma.animal.findUnique({
      where: { idanimal: id },
      include: {
        duenoRef: {
          select: { idusuario: true, email: true },
        },
        historiales: true,
        turnos: true,
      },
    });
    if (!animal) {
      return res.status(404).json({ ok: false, error: "Animal no encontrado" });
    }
    res.json({ ok: true, animal });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || "Error al obtener animal" });
  }
});

// POST /api/animales - Crear un nuevo animal
router.post("/", async (req, res) => {
  try {
    const { nombre, edad, descripcion, imagen_m, dueno } = req.body;
    if (!nombre) {
      return res.status(400).json({ ok: false, error: "Nombre es requerido" });
    }
    const animal = await prisma.animal.create({
      data: {
        nombre,
        edad: edad ? parseInt(edad) : null,
        descripcion: descripcion || null,
        imagen_m: imagen_m || null,
        dueno: dueno ? parseInt(dueno) : null,
      },
    });
    res.status(201).json({ ok: true, animal });
  } catch (e: any) {
    res.status(400).json({ ok: false, error: e.message || "Error al crear animal" });
  }
});

// PUT /api/animales/:id - Actualizar un animal
router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ ok: false, error: "ID inválido" });
    }
    const { nombre, edad, descripcion, imagen_m, dueno } = req.body;
    const animal = await prisma.animal.update({
      where: { idanimal: id },
      data: {
        ...(nombre !== undefined && { nombre }),
        ...(edad !== undefined && { edad: edad ? parseInt(edad) : null }),
        ...(descripcion !== undefined && { descripcion }),
        ...(imagen_m !== undefined && { imagen_m }),
        ...(dueno !== undefined && { dueno: dueno ? parseInt(dueno) : null }),
      },
    });
    res.json({ ok: true, animal });
  } catch (e: any) {
    if (e.code === "P2025") {
      return res.status(404).json({ ok: false, error: "Animal no encontrado" });
    }
    res.status(400).json({ ok: false, error: e.message || "Error al actualizar animal" });
  }
});

// DELETE /api/animales/:id - Eliminar un animal
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ ok: false, error: "ID inválido" });
    }
    await prisma.animal.delete({
      where: { idanimal: id },
    });
    res.json({ ok: true, message: "Animal eliminado" });
  } catch (e: any) {
    if (e.code === "P2025") {
      return res.status(404).json({ ok: false, error: "Animal no encontrado" });
    }
    res.status(400).json({ ok: false, error: e.message || "Error al eliminar animal" });
  }
});

export default router;

