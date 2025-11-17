/**
 * Rutas de Mascotas (Adopciones) - Usando Prisma
 */

import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

// GET /api/pets - Obtener todas las mascotas
router.get("/", async (_req, res) => {
  try {
    const pets = await prisma.pet.findMany({
      orderBy: { createdAt: "desc" },
    });
    
    const formatted = pets.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      especie: p.especie,
      foto: p.foto || "",
      adoptable: p.adoptable,
    }));
    
    res.json({ ok: true, data: formatted });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || "Error al obtener mascotas" });
  }
});

// GET /api/pets/:id - Obtener una mascota por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pet = await prisma.pet.findUnique({
      where: { id },
    });
    
    if (!pet) {
      return res.status(404).json({ ok: false, error: "Mascota no encontrada" });
    }
    
    res.json({
      ok: true,
      data: {
        id: pet.id,
        nombre: pet.nombre,
        especie: pet.especie,
        foto: pet.foto || "",
        adoptable: pet.adoptable,
      },
    });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || "Error al obtener mascota" });
  }
});

// POST /api/pets - Crear una nueva mascota
router.post("/", async (req, res) => {
  try {
    const { nombre, especie, foto, adoptable } = req.body;
    
    if (!nombre || !especie) {
      return res.status(400).json({ ok: false, error: "Nombre y especie son requeridos" });
    }

    const id = "m-" + Math.random().toString(36).slice(2, 9);
    
    const pet = await prisma.pet.create({
      data: {
        id,
        nombre: nombre.trim(),
        especie: especie.trim(),
        foto: foto?.trim() || null,
        adoptable: Boolean(adoptable),
      },
    });

    res.json({
      ok: true,
      data: {
        id: pet.id,
        nombre: pet.nombre,
        especie: pet.especie,
        foto: pet.foto || "",
        adoptable: pet.adoptable,
      },
    });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || "Error al crear mascota" });
  }
});

// PUT /api/pets/:id - Actualizar una mascota
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, especie, foto, adoptable } = req.body;

    const updateData: any = {};
    
    if (nombre !== undefined) updateData.nombre = nombre.trim();
    if (especie !== undefined) updateData.especie = especie.trim();
    if (foto !== undefined) updateData.foto = foto?.trim() || null;
    if (adoptable !== undefined) updateData.adoptable = Boolean(adoptable);

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ ok: false, error: "No hay campos para actualizar" });
    }

    await prisma.pet.update({
      where: { id },
      data: updateData,
    });

    res.json({ ok: true, message: "Mascota actualizada correctamente" });
  } catch (e: any) {
    if (e.code === "P2025") {
      return res.status(404).json({ ok: false, error: "Mascota no encontrada" });
    }
    res.status(500).json({ ok: false, error: e.message || "Error al actualizar mascota" });
  }
});

// DELETE /api/pets/:id - Eliminar una mascota
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.pet.delete({
      where: { id },
    });

    res.json({ ok: true, message: "Mascota eliminada correctamente" });
  } catch (e: any) {
    if (e.code === "P2025") {
      return res.status(404).json({ ok: false, error: "Mascota no encontrada" });
    }
    res.status(500).json({ ok: false, error: e.message || "Error al eliminar mascota" });
  }
});

export default router;
