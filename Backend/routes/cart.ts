/**
 * Rutas del Carrito
 */

import { Router } from "express";

const router = Router();

// Por ahora el carrito se maneja en el cliente
// En el futuro se puede persistir en la BD asociado a la sesión

// GET /api/cart - Obtener el carrito del usuario
router.get("/", async (req, res) => {
  try {
    // Por ahora retornamos un carrito vacío
    // En el futuro se puede obtener de la BD usando req.session.userId
    res.json({ ok: true, data: { items: [] } });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || "Error al obtener carrito" });
  }
});

// POST /api/cart - Agregar producto al carrito
router.post("/", async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    // Por ahora solo validamos
    // En el futuro se puede guardar en la BD
    res.json({ ok: true, message: "Producto agregado al carrito" });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || "Error al agregar al carrito" });
  }
});

// PUT /api/cart/:productId - Actualizar cantidad de un producto
router.put("/:productId", async (req, res) => {
  try {
    const { quantity } = req.body;
    // Por ahora solo validamos
    res.json({ ok: true, message: "Carrito actualizado" });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || "Error al actualizar carrito" });
  }
});

// DELETE /api/cart/:productId - Eliminar producto del carrito
router.delete("/:productId", async (req, res) => {
  try {
    // Por ahora solo validamos
    res.json({ ok: true, message: "Producto eliminado del carrito" });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || "Error al eliminar del carrito" });
  }
});

// DELETE /api/cart - Vaciar carrito
router.delete("/", async (req, res) => {
  try {
    // Por ahora solo validamos
    res.json({ ok: true, message: "Carrito vaciado" });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || "Error al vaciar carrito" });
  }
});

export default router;

