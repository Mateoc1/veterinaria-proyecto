import { Router } from "express";
import prisma from "../lib/prisma.js";

const router = Router();

// GET /api/turnos - Obtener todos los turnos
router.get("/", async (_req, res) => {
  try {
    const turnos = await prisma.turno.findMany({
      include: {
        mascotaRef: {
          select: { idanimal: true, nombre: true },
        },
      },
      orderBy: { idturno: "desc" },
    });
    res.json({ ok: true, turnos });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || "Error al obtener turnos" });
  }
});

// GET /api/turnos/:id - Obtener un turno por ID
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ ok: false, error: "ID inválido" });
    }
    const turno = await prisma.turno.findUnique({
      where: { idturno: id },
      include: {
        mascotaRef: true,
      },
    });
    if (!turno) {
      return res.status(404).json({ ok: false, error: "Turno no encontrado" });
    }
    res.json({ ok: true, turno });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || "Error al obtener turno" });
  }
});

// POST /api/turnos - Crear un nuevo turno
router.post("/", async (req, res) => {
  try {
    const { mascota, motivo, fecha, estado } = req.body;
    if (!mascota || !motivo || !estado) {
      return res.status(400).json({ ok: false, error: "Mascota, motivo y estado son requeridos" });
    }
    const turno = await prisma.turno.create({
      data: {
        mascota: parseInt(mascota),
        motivo: motivo || null,
        fecha: fecha || null,
        estado: estado,
      },
    });
    res.status(201).json({ ok: true, turno });
  } catch (e: any) {
    res.status(400).json({ ok: false, error: e.message || "Error al crear turno" });
  }
});

// PUT /api/turnos/:id - Actualizar un turno
router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ ok: false, error: "ID inválido" });
    }
    const { mascota, motivo, fecha, estado } = req.body;
    const turno = await prisma.turno.update({
      where: { idturno: id },
      data: {
        ...(mascota !== undefined && { mascota: parseInt(mascota) }),
        ...(motivo !== undefined && { motivo }),
        ...(fecha !== undefined && { fecha }),
        ...(estado !== undefined && { estado }),
      },
    });
    res.json({ ok: true, turno });
  } catch (e: any) {
    if (e.code === "P2025") {
      return res.status(404).json({ ok: false, error: "Turno no encontrado" });
    }
    res.status(400).json({ ok: false, error: e.message || "Error al actualizar turno" });
  }
});

// DELETE /api/turnos/:id - Eliminar un turno
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ ok: false, error: "ID inválido" });
    }
    await prisma.turno.delete({
      where: { idturno: id },
    });
    res.json({ ok: true, message: "Turno eliminado" });
  } catch (e: any) {
    if (e.code === "P2025") {
      return res.status(404).json({ ok: false, error: "Turno no encontrado" });
    }
    res.status(400).json({ ok: false, error: e.message || "Error al eliminar turno" });
  }
});

export default router;

