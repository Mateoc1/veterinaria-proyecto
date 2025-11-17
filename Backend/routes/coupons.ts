/**
 * Rutas de Cupones - Usando Prisma
 */

import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

// GET /api/coupons - Obtener todos los cupones activos
router.get("/", async (_req, res) => {
  try {
    const cupones = await prisma.coupon.findMany({
      where: { active: true },
      select: { code: true },
    });
    
    const codes = cupones.map((c) => c.code);
    
    // Si no hay cupones, retornar los por defecto
    if (codes.length === 0) {
      return res.json({ ok: true, data: ["vte10", "perro"] });
    }
    
    res.json({ ok: true, data: codes });
  } catch {
    // Si hay error (tabla no existe), retornar cupones por defecto
    res.json({ ok: true, data: ["vte10", "perro"] });
  }
});

// POST /api/coupons/validate - Validar un cupón
router.post("/validate", async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ ok: false, error: "Código de cupón requerido" });
    }

    try {
      const cupon = await prisma.coupon.findFirst({
        where: {
          code: code.trim().toLowerCase(),
          active: true,
        },
      });
      
      if (cupon) {
        return res.json({ ok: true, data: { valid: true, discount: 20 } });
      }
    } catch {
      // Si la tabla no existe, validar contra cupones por defecto
      const defaultCoupons = ["vte10", "perro"];
      if (defaultCoupons.includes(code.trim().toLowerCase())) {
        return res.json({ ok: true, data: { valid: true, discount: 20 } });
      }
    }

    res.json({ ok: true, data: { valid: false, discount: 0 } });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || "Error al validar cupón" });
  }
});

// POST /api/coupons - Crear un nuevo cupón
router.post("/", async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ ok: false, error: "Código de cupón requerido" });
    }

    try {
      await prisma.coupon.create({
        data: {
          code: code.trim().toLowerCase(),
        },
      });
      
      res.json({ ok: true, message: "Cupón creado correctamente" });
    } catch (e: any) {
      if (e.code === "P2002") {
        return res.status(400).json({ ok: false, error: "El cupón ya existe" });
      }
      throw e;
    }
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || "Error al crear cupón" });
  }
});

// DELETE /api/coupons/:code - Eliminar (desactivar) un cupón
router.delete("/:code", async (req, res) => {
  try {
    const code = decodeURIComponent(req.params.code);
    
    const result = await prisma.coupon.updateMany({
      where: {
        code: code.trim().toLowerCase(),
        active: true,
      },
      data: {
        active: false,
      },
    });
    
    if (result.count === 0) {
      return res.status(404).json({ ok: false, error: "Cupón no encontrado" });
    }
    
    res.json({ ok: true, message: "Cupón eliminado correctamente" });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || "Error al eliminar cupón" });
  }
});

export default router;
