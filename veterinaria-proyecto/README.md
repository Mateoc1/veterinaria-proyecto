# 🩺 Veterinaria “Los Carruseles”

## 📘 Descripción
**Veterinaria Los Carruseles** es una plataforma web que integra **adopción de mascotas**, **tienda online** y **atención médica veterinaria** en un solo lugar.  
Permite a los usuarios registrarse, adoptar, comprar productos, comunicarse con doctores y llevar un historial clínico de sus mascotas.

El sistema define tres roles principales:
- 👤 **Administrador:** gestiona usuarios, productos, adopciones, promociones y estadísticas.
- 🧑‍⚕️ **Doctor:** atiende consultas, actualiza historiales clínicos y administra su agenda.
- 🐶 **Usuario (Cliente):** adopta, compra, aplica cupones y consulta con veterinarios.

---

## 🎯 Objetivos del Proyecto
- Digitalizar los procesos de la veterinaria.  
- Unificar adopción, tienda y atención médica en una misma web.  
- Mejorar la comunicación entre veterinarios y clientes.  
- Facilitar la gestión administrativa y el seguimiento de datos.

---

## 🧩 Funcionalidades Principales
- Registro e inicio de sesión con roles diferenciados.
- Adopción de mascotas mediante formulario validado.
- Tienda online con carrito, cupones y pagos vía **MercadoPago**.
- Chat directo entre usuarios y veterinarios (API de chatbot/WhatsApp).
- Registro de mascotas y gestión del historial clínico.
- Panel de administración con métricas y gestión de contenido.
- Diseño **responsive** adaptable a PC, tablet y móvil.

---

## ⚙️ Tecnologías Utilizadas
**Frontend:**  
- HTML5  
- CSS3  
- EJS (Embedded JavaScript Templates)

**Backend:**  
- TypeScript  
- Node.js + Express  
- APIs externas: MercadoPago, Chatbot (WhatsApp)

**Base de Datos:**  
- SQLite (relacional, ligera y portable)

**Seguridad:**  
- Cifrado de contraseñas con bcrypt o argon2  
- Validación de entradas y consultas seguras  
- Tokens JWT o cookies seguras  
- HTTPS obligatorio

---

## 🧱 Arquitectura del Sistema
El proyecto se organiza bajo una arquitectura modular de **cuatro capas**:
1. **Frontend:** interfaz y vistas EJS.
2. **Backend:** controladores, rutas y lógica de negocio.
3. **Base de Datos:** almacenamiento en SQLite.
4. **Seguridad:** cifrado, validaciones, sesiones y copias de respaldo.

---

## 🗄️ Modelo de Datos (Resumen)
Relaciones principales:
- `usuarios (1:N) mascotas`
- `usuarios (1:N) solicitudes_adopcion`
- `usuarios (1:N) pedidos`
- `pedidos (1:N) detalle_pedido`
- `mascotas (1:N) historial_clinico`
- `usuarios (1:N) historial_clinico` (como doctores)
- `productos (1:N) detalle_pedido`
- `usuarios (1:N) mensajes`

---

## 🧾 Requerimientos Clave

### Funcionales
- Autenticación y roles.  
- CRUD de productos, usuarios y adopciones.  
- Pasarela de pago (MercadoPago).  
- Chat médico entre usuario y doctor.  
- Generación y uso de cupones.  
- Panel administrativo con estadísticas.

### No Funcionales
- Diseño responsive.  
- Encriptación de contraseñas.  
- Backups automáticos.  
- Tiempo de carga < 3 segundos.  
- Alta disponibilidad (99%).  
- Seguridad HTTPS.
