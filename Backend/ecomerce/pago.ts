// @ts-nocheck
import express from 'express';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const router = express.Router();

const client = new MercadoPagoConfig({ 
  accessToken: 'TEST-4222415675317980-091414-78c69ae39b6418219e3c6cb2c3b0eeb4-1187720393'
});

router.post('/crear-preferencia', async (req, res) => {
  try {
    const { productos } = req.body;

    if (!productos || productos.length === 0) {
      return res.status(400).json({ error: 'No hay productos' });
    }

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: productos.map((p) => ({
          title: p.nombre,
          quantity: p.cantidad,
          unit_price: p.precio,
          currency_id: 'ARS'
        })),
        back_urls: {
          success: `${req.protocol}://${req.get('host')}/frontend/vistas/tienda/success.html`,
          failure: `${req.protocol}://${req.get('host')}/frontend/vistas/tienda/failure.html`,
          pending: `${req.protocol}://${req.get('host')}/frontend/vistas/tienda/pending.html`
        },
        auto_return: 'approved'
      }
    });

    res.json({ init_point: result.init_point, id: result.id });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al crear preferencia' });
  }
});

router.post('/webhook', (req, res) => {
  console.log('Webhook:', req.body);
  res.status(200).send('OK');
});

export default router;