/**
 * Rutas de Pagos con MercadoPago
 */

import { Router } from "express";
import { MercadoPagoConfig, Preference } from "mercadopago";
import prisma from "../lib/prisma";

const router = Router();

// Configurar MercadoPago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || "",
  options: { timeout: 5000 }
});

const preference = new Preference(client);

// Middleware para verificar autenticación
function requireAuth(req: any, res: any, next: any) {
  if (!req.session.userId) {
    return res.status(401).json({ ok: false, error: "Usuario no autenticado" });
  }
  next();
}

// POST /api/payments/create-preference - Crear preferencia de pago
router.post("/create-preference", requireAuth, async (req: any, res) => {
  try {
    const userId = req.session.userId;
    
    // Obtener items del carrito
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

    if (cartItems.length === 0) {
      return res.status(400).json({ ok: false, error: "El carrito está vacío" });
    }

    // Verificar stock disponible
    for (const item of cartItems) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({ 
          ok: false, 
          error: `Stock insuficiente para ${item.product.nombre}` 
        });
      }
    }

    // Crear items para MercadoPago
    const items = cartItems.map(item => ({
      id: item.product.idproducto.toString(),
      title: item.product.nombre || "Producto",
      quantity: item.quantity,
      unit_price: Number(item.product.precio),
      currency_id: "ARS"
    }));

    // Crear orden en la base de datos
    const totalAmount = cartItems.reduce((sum, item) => 
      sum + (Number(item.product.precio) * item.quantity), 0
    );

    const order = await prisma.order.create({
      data: {
        user_id: userId,
        total_amount: totalAmount,
        status: "pending",
        order_items: {
          create: cartItems.map(item => ({
            product_id: item.product.idproducto,
            quantity: item.quantity,
            price: Number(item.product.precio)
          }))
        }
      }
    });

    // Crear preferencia de MercadoPago
    const preferenceData = {
      items: items,
      back_urls: {
        success: `${process.env.APP_BASE_URL || "http://localhost:3001"}/api/payments/success`,
        failure: `${process.env.APP_BASE_URL || "http://localhost:3001"}/api/payments/failure`,
        pending: `${process.env.APP_BASE_URL || "http://localhost:3001"}/api/payments/pending`
      },
      auto_return: "approved" as const,
      external_reference: order.id.toString(),
      notification_url: `${process.env.APP_BASE_URL || "http://localhost:3001"}/api/payments/webhook`
    };

    const response = await preference.create({ body: preferenceData });

    res.json({
      ok: true,
      data: {
        preference_id: response.id,
        init_point: response.init_point,
        sandbox_init_point: response.sandbox_init_point,
        order_id: order.id
      }
    });

  } catch (e: any) {
    console.error("Error creating payment preference:", e);
    res.status(500).json({ ok: false, error: e.message || "Error al crear preferencia de pago" });
  }
});

// GET /api/payments/success - Página de éxito
router.get("/success", async (req, res) => {
  try {
    const { collection_id, collection_status, external_reference } = req.query;
    
    if (external_reference && collection_status === "approved") {
      // Actualizar orden como pagada
      await prisma.order.update({
        where: { id: parseInt(external_reference as string) },
        data: {
          status: "paid",
          payment_id: collection_id as string,
          payment_status: collection_status as string
        }
      });

      // Obtener detalles de la orden para actualizar stock
      const order = await prisma.order.findUnique({
        where: { id: parseInt(external_reference as string) },
        include: { order_items: true }
      });

      if (order) {
        // Actualizar stock de productos
        for (const item of order.order_items) {
          await prisma.productos.update({
            where: { idproducto: item.product_id },
            data: {
              stock: {
                decrement: item.quantity
              }
            }
          });
        }

        // Limpiar carrito del usuario
        await prisma.cart_item.deleteMany({
          where: { user_id: order.user_id }
        });
      }
    }

    res.redirect("/frontend/vistas/tienda/tienda.html?payment=success");
  } catch (e: any) {
    console.error("Error processing payment success:", e);
    res.redirect("/frontend/vistas/tienda/tienda.html?payment=error");
  }
});

// GET /api/payments/failure - Página de fallo
router.get("/failure", async (req, res) => {
  res.redirect("/frontend/vistas/tienda/tienda.html?payment=failure");
});

// GET /api/payments/pending - Página de pendiente
router.get("/pending", async (req, res) => {
  res.redirect("/frontend/vistas/tienda/tienda.html?payment=pending");
});

// POST /api/payments/webhook - Webhook de notificaciones
router.post("/webhook", async (req, res) => {
  try {
    const { type, data } = req.body;
    
    if (type === "payment") {
      // Aquí se puede procesar la notificación de pago
      console.log("Payment notification received:", data);
    }
    
    res.status(200).send("OK");
  } catch (e: any) {
    console.error("Error processing webhook:", e);
    res.status(500).send("Error");
  }
});

export default router;