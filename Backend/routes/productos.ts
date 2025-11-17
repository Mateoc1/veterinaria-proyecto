import { Router } from "express";
import prisma from "../lib/prisma.js";

const router = Router();

// GET /api/productos - Obtener todos los productos
router.get("/", async (_req, res) => {
  try {
    const productos = await prisma.productos.findMany({
      orderBy: { idproducto: "asc" },
    });
    res.json({ ok: true, productos });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || "Error al obtener productos" });
  }
});

// GET /api/productos/:id - Obtener un producto por ID
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ ok: false, error: "ID inválido" });
    }
    const producto = await prisma.productos.findUnique({
      where: { idproducto: id },
    });
    if (!producto) {
      return res.status(404).json({ ok: false, error: "Producto no encontrado" });
    }
    res.json({ ok: true, producto });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || "Error al obtener producto" });
  }
});

// POST /api/productos - Crear un nuevo producto
router.post("/", async (req, res) => {
  try {
    const { nombre, url_imagen, stock } = req.body;
    if (!nombre || stock === undefined) {
      return res.status(400).json({ ok: false, error: "Nombre y stock son requeridos" });
    }
    const producto = await prisma.productos.create({
      data: {
        nombre,
        url_imagen: url_imagen || null,
        stock: parseInt(stock) || 0,
      },
    });
    res.status(201).json({ ok: true, producto });
  } catch (e: any) {
    res.status(400).json({ ok: false, error: e.message || "Error al crear producto" });
  }
});

// PUT /api/productos/:id - Actualizar un producto
router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ ok: false, error: "ID inválido" });
    }
    const { nombre, url_imagen, stock } = req.body;
    const producto = await prisma.productos.update({
      where: { idproducto: id },
      data: {
        ...(nombre !== undefined && { nombre }),
        ...(url_imagen !== undefined && { url_imagen }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
      },
    });
    res.json({ ok: true, producto });
  } catch (e: any) {
    if (e.code === "P2025") {
      return res.status(404).json({ ok: false, error: "Producto no encontrado" });
    }
    res.status(400).json({ ok: false, error: e.message || "Error al actualizar producto" });
  }
});

// DELETE /api/productos/:id - Eliminar un producto
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ ok: false, error: "ID inválido" });
    }
    await prisma.productos.delete({
      where: { idproducto: id },
    });
    res.json({ ok: true, message: "Producto eliminado" });
  } catch (e: any) {
    if (e.code === "P2025") {
      return res.status(404).json({ ok: false, error: "Producto no encontrado" });
    }
    res.status(400).json({ ok: false, error: e.message || "Error al eliminar producto" });
  }
});

export default router;

