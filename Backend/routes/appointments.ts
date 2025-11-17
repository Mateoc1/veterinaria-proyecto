/**
 * Rutas de Citas/Appointments - Usando Prisma
 */

import { Router, Request } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

// GET /api/appointments - Obtener todas las citas
router.get("/", async (req: Request, res) => {
  try {
    const userId = req.session?.userId;
    
    const appointments = await prisma.appointment.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { fecha: "desc" },
      /*include: {
        
       /* pet: {
          select: {
            id: true,
            nombre: true,
            especie: true,
          },
        },
      },*/
    });

    res.json({ ok: true, data: appointments });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || "Error al obtener citas" });
  }
});

// POST /api/appointments - Crear una nueva cita
router.post("/", async (req: Request, res) => {
  try {
    const { petId, motivo } = req.body;
    
    if (!petId || !motivo) {
      return res.status(400).json({ ok: false, error: "petId y motivo son requeridos" });
    }

    const userId = req.session?.userId || null;
    const id = "c-" + Date.now();

    const appointment = await prisma.appointment.create({
      data: {
        id,
        userId,
        petId,
        motivo: motivo.trim(),
      },
    });

    res.json({
      ok: true,
      data: {
        id: appointment.id,
        petId: appointment.petId,
        motivo: appointment.motivo,
        fecha: appointment.fecha.toISOString(),
      },
    });
  } catch (e: any) {
    if (e.code === "P2003") {
      return res.status(400).json({ ok: false, error: "Mascota no encontrada" });
    }
    res.status(500).json({ ok: false, error: e.message || "Error al crear cita" });
  }
});

export default router;
