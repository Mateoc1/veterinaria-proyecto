import { Router } from "express";
import prisma from "../lib/prisma.js";

const router = Router();

// GET /api/compras - Obtener todas las compras
router.get("/", async (_req, res) => {
  try {
    const compras = await prisma.compra.findMany({
      include: {
        productoRef: true,
      },
      orderBy: { idcompra: "desc" },
    });
    res.json({ ok: true, compras });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || "Error al obtener compras" });
  }
});

// GET /api/compras/:id - Obtener una compra por ID
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ ok: false, error: "ID inválido" });
    }
    const compra = await prisma.compra.findUnique({
      where: { idcompra: id },
      include: {
        productoRef: true,
      },
    });
    if (!compra) {
      return res.status(404).json({ ok: false, error: "Compra no encontrada" });
    }
    res.json({ ok: true, compra });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || "Error al obtener compra" });
  }
});

// POST /api/compras - Crear una nueva compra
router.post("/", async (req, res) => {
  try {
    const { producto, unidades, precio } = req.body;
    if (!producto || !unidades || !precio) {
      return res.status(400).json({ ok: false, error: "Producto, unidades y precio son requeridos" });
    }
    const compra = await prisma.compra.create({
      data: {
        producto: parseInt(producto),
        unidades: parseInt(unidades),
        precio: parseInt(precio),
      },
    });
    res.status(201).json({ ok: true, compra });
  } catch (e: any) {
    res.status(400).json({ ok: false, error: e.message || "Error al crear compra" });
  }
});

// DELETE /api/compras/:id - Eliminar una compra
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ ok: false, error: "ID inválido" });
    }
    await prisma.compra.delete({
      where: { idcompra: id },
    });
    res.json({ ok: true, message: "Compra eliminada" });
  } catch (e: any) {
    if (e.code === "P2025") {
      return res.status(404).json({ ok: false, error: "Compra no encontrada" });
    }
    res.status(400).json({ ok: false, error: e.message || "Error al eliminar compra" });
  }
});

export default router;

