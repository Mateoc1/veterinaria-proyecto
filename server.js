const express = require('express');
const cors = require('cors');
const path = require('path');
const { MercadoPagoConfig, Preference } = require('mercadopago');

const app = express();
const PORT = 3001;

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
const FRONT_DIR = path.resolve(__dirname, "frontend");
app.use("/frontend", express.static(FRONT_DIR));

// Rutas básicas
app.get("/", (req, res) => res.redirect("/frontend/vistas/index.html"));
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Configurar MercadoPago
const client = new MercadoPagoConfig({ 
  accessToken: 'TEST-4222415675317980-091414-78c69ae39b6418219e3c6cb2c3b0eeb4-1187720393'
});

// Ruta para crear preferencia de pago
app.post('/api/pago/crear-preferencia', async (req, res) => {
  try {
    const { productos, total } = req.body;

    if (!productos || productos.length === 0) {
      return res.status(400).json({ error: 'No hay productos' });
    }

    const preference = new Preference(client);

    const body = {
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
    };

    const result = await preference.create({ body });
    res.json({ init_point: result.init_point, id: result.id });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al crear preferencia' });
  }
});

// Webhook
app.post('/api/pago/webhook', (req, res) => {
  console.log('Webhook recibido:', req.body);
  res.status(200).send('OK');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
  console.log(`Accede a: http://localhost:${PORT}/frontend/vistas/index.html`);
});