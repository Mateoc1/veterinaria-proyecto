/**
 * Rutas de Productos
 */

import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

// GET /api/products - Obtener todos los productos
router.get("/", async (_req, res) => {
  try {
    const products = await prisma.productos.findMany({
      select: {
        idproducto: true,
        nombre: true,
        precio: true,
        stock: true,
        url_imagen: true
      }
    });
    
    const formattedProducts = products.map(p => ({
      id: p.idproducto,
      nombre: p.nombre,
      precio: p.precio,
      stock: p.stock,
      url_imagen: p.url_imagen
    }));
    
    res.json({ ok: true, data: formattedProducts });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || "Error al obtener productos" });
  }
});

// GET /api/products/:id - Obtener un producto por ID
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const product = await prisma.productos.findUnique({
      where: { idproducto: id },
      select: {
        idproducto: true,
        nombre: true,
        precio: true,
        stock: true,
        url_imagen: true
      }
    });
    
    if (!product) {
      return res.status(404).json({ ok: false, error: "Producto no encontrado" });
    }
    
    const formattedProduct = {
      id: product.idproducto,
      nombre: product.nombre,
      precio: product.precio,
      stock: product.stock,
      url_imagen: product.url_imagen
    };
    
    res.json({ ok: true, data: formattedProduct });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || "Error al obtener producto" });
  }
});

export default router;

