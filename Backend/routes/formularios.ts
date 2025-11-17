import { Router } from "express";
import prisma from "../lib/prisma.js";

const router = Router();

// GET /api/formularios - Obtener todos los formularios
router.get("/", async (_req, res) => {
  try {
    const formularios = await prisma.formulario.findMany({
      orderBy: { idformulario: "desc" },
    });
    res.json({ ok: true, formularios });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || "Error al obtener formularios" });
  }
});

// GET /api/formularios/:id - Obtener un formulario por ID
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ ok: false, error: "ID inválido" });
    }
    const formulario = await prisma.formulario.findUnique({
      where: { idformulario: id },
    });
    if (!formulario) {
      return res.status(404).json({ ok: false, error: "Formulario no encontrado" });
    }
    res.json({ ok: true, formulario });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message || "Error al obtener formulario" });
  }
});

// POST /api/formularios - Crear un nuevo formulario
router.post("/", async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      telefono,
      mail,
      fecha_nacimiento,
      direccion,
      ciudad,
      provincia,
      codigo_postal,
      pais,
      tipo_documento,
      numero_documento,
      tipo_vivienda,
      espacio_seguro,
      tiempo_solo,
      personas_encasa,
      familia_deacuerdo,
      otras_mascotas_anteriormente,
      tipo,
      otras_mascotas_actualmente,
      tipo_mascotas_actual,
      recursos,
      vacunar_y_esterilizar,
      encargado_cuidado,
      sitio_animal_solo,
      rol_del_animal,
      estado,
    } = req.body;

    if (!tipo_vivienda || !espacio_seguro || !estado) {
      return res.status(400).json({ ok: false, error: "Campos requeridos faltantes" });
    }

    const formulario = await prisma.formulario.create({
      data: {
        nombre: nombre || null,
        apellido: apellido || null,
        telefono: telefono ? parseInt(telefono) : null,
        mail: mail || null,
        fecha_nacimiento: fecha_nacimiento || null,
        direccion: direccion || null,
        ciudad: ciudad || null,
        provincia: provincia || null,
        codigo_postal: codigo_postal ? parseInt(codigo_postal) : null,
        pais: pais || null,
        tipo_documento: tipo_documento || null,
        numero_documento: numero_documento ? parseInt(numero_documento) : null,
        tipo_vivienda,
        espacio_seguro,
        tiempo_solo: parseInt(tiempo_solo) || 0,
        personas_encasa: parseInt(personas_encasa) || 0,
        familia_deacuerdo,
        otras_mascotas_anteriormente,
        tipo,
        otras_mascotas_actualmente: parseInt(otras_mascotas_actualmente) || 0,
        tipo_mascotas_actual,
        recursos,
        vacunar_y_esterilizar,
        encargado_cuidado,
        sitio_animal_solo,
        rol_del_animal,
        estado,
      },
    });
    res.status(201).json({ ok: true, formulario });
  } catch (e: any) {
    res.status(400).json({ ok: false, error: e.message || "Error al crear formulario" });
  }
});

// PUT /api/formularios/:id - Actualizar estado de formulario
router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ ok: false, error: "ID inválido" });
    }
    const { estado } = req.body;
    const formulario = await prisma.formulario.update({
      where: { idformulario: id },
      data: {
        ...(estado !== undefined && { estado }),
      },
    });
    res.json({ ok: true, formulario });
  } catch (e: any) {
    if (e.code === "P2025") {
      return res.status(404).json({ ok: false, error: "Formulario no encontrado" });
    }
    res.status(400).json({ ok: false, error: e.message || "Error al actualizar formulario" });
  }
});

export default router;

