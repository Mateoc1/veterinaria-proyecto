/**
 * Rutas del Carrito
 */

import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

// Middleware para verificar autenticación
function requireAuth(req: any, res: any, next: any) {
  if (!req.session.userId) {
    return res.status(401).json({ ok: false, error: "Usuario no autenticado" });
  }
  next();
}

// GET /api/cart - Obtener el carrito del usuario
router.get("/", requireAuth, async (req: any, res) => {
  try {
    const userId = req.session.userId;
    const cartItems = await prisma.cart_item.findMany({
      where: { user_id: userId },
      include: {
        product: {
          select: {
            idproducto: true,
            nombre: true,
            precio: true,
            stock: true
          }
        }
      }
    });

    const items = cartItems.map(item => ({
      id: item.product.idproducto,
      nombre: item.product.nombre,
      precio: item.product.precio,
      cantidad: item.quantity,
      stock: item.product.stock
    }));

    res.json({ ok: true, data: { items } });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || "Error al obtener carrito" });
  }
});

// POST /api/cart - Agregar producto al carrito
router.post("/", requireAuth, async (req: any, res) => {
  try {
    const userId = req.session.userId;
    const { productId, quantity = 1 } = req.body;

    if (!productId || quantity <= 0) {
      return res.status(400).json({ ok: false, error: "Datos inválidos" });
    }

    // Verificar que el producto existe y tiene stock
    const product = await prisma.productos.findUnique({
      where: { idproducto: productId }
    });

    if (!product) {
      return res.status(404).json({ ok: false, error: "Producto no encontrado" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ ok: false, error: "Stock insuficiente" });
    }

    // Agregar o actualizar item en el carrito
    await prisma.cart_item.upsert({
      where: {
        user_id_product_id: {
          user_id: userId,
          product_id: productId
        }
      },
      update: {
        quantity: {
          increment: quantity
        }
      },
      create: {
        user_id: userId,
        product_id: productId,
        quantity: quantity
      }
    });

    res.json({ ok: true, message: "Producto agregado al carrito" });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || "Error al agregar al carrito" });
  }
});

// PUT /api/cart/:productId - Actualizar cantidad de un producto
router.put("/:productId", requireAuth, async (req: any, res) => {
  try {
    const userId = req.session.userId;
    const productId = parseInt(req.params.productId);
    const { quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({ ok: false, error: "Cantidad debe ser mayor a 0" });
    }

    const updated = await prisma.cart_item.updateMany({
      where: {
        user_id: userId,
        product_id: productId
      },
      data: {
        quantity: quantity
      }
    });

    if (updated.count === 0) {
      return res.status(404).json({ ok: false, error: "Item no encontrado en el carrito" });
    }

    res.json({ ok: true, message: "Carrito actualizado" });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || "Error al actualizar carrito" });
  }
});

// DELETE /api/cart/:productId - Eliminar producto del carrito
router.delete("/:productId", requireAuth, async (req: any, res) => {
  try {
    const userId = req.session.userId;
    const productId = parseInt(req.params.productId);

    await prisma.cart_item.deleteMany({
      where: {
        user_id: userId,
        product_id: productId
      }
    });

    res.json({ ok: true, message: "Producto eliminado del carrito" });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || "Error al eliminar del carrito" });
  }
});

// DELETE /api/cart - Vaciar carrito
router.delete("/", requireAuth, async (req: any, res) => {
  try {
    const userId = req.session.userId;

    await prisma.cart_item.deleteMany({
      where: {
        user_id: userId
      }
    });

    res.json({ ok: true, message: "Carrito vaciado" });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || "Error al vaciar carrito" });
  }
});

export default router;

