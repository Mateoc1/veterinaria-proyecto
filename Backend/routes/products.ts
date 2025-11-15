/**
 * Rutas de Productos
 */

import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

// GET /api/products - Obtener todos los productos
router.get("/", async (_req, res) => {
  try {
    // Por ahora retornamos productos hardcodeados
    // En el futuro se pueden obtener de la BD
    const products = [
      { id: 1, nombre: "Alimento para perros", precio: 3500 },
      { id: 2, nombre: "Juguete para gato", precio: 1200 },
      { id: 3, nombre: "Shampoo para mascotas", precio: 2500 },
    ];
    res.json({ ok: true, data: products });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || "Error al obtener productos" });
  }
});

// GET /api/products/:id - Obtener un producto por ID
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    // Por ahora retornamos productos hardcodeados
    const products = [
      { id: 1, nombre: "Alimento para perros", precio: 3500 },
      { id: 2, nombre: "Juguete para gato", precio: 1200 },
      { id: 3, nombre: "Shampoo para mascotas", precio: 2500 },
    ];
    const product = products.find(p => p.id === id);
    if (!product) {
      return res.status(404).json({ ok: false, error: "Producto no encontrado" });
    }
    res.json({ ok: true, data: product });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || "Error al obtener producto" });
  }
});

export default router;

