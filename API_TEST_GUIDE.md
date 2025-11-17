# 🧪 Guía para Probar los Endpoints API

## 📍 Base URL
```
http://localhost:3001
```

## 🎯 Métodos para Probar Endpoints

### 1. 🌐 Página HTML de Prueba (Más Fácil)
**Accede a:** `http://localhost:3001/api-test`

Esta es una página web interactiva donde puedes probar todos los endpoints haciendo clic en botones.

---

### 2. 🔧 Thunder Client (Extensión VS Code/Cursor) - Recomendado

1. Instala la extensión **Thunder Client** en VS Code/Cursor
2. Abre el panel lateral de Thunder Client
3. Crea una nueva request
4. Configura:
   - **Method**: GET, POST, PUT, DELETE
   - **URL**: `http://localhost:3001/api/productos` (ejemplo)
   - **Headers**: `Content-Type: application/json`
   - **Body** (si es POST/PUT): JSON con los datos

**Ejemplo GET:**
```
GET http://localhost:3001/api/productos
```

**Ejemplo POST:**
```
POST http://localhost:3001/api/productos
Headers: Content-Type: application/json
Body:
{
  "nombre": "Alimento Premium",
  "stock": 100,
  "url_imagen": "https://ejemplo.com/imagen.jpg"
}
```

---

### 3. 💻 cURL (Terminal/CMD/PowerShell)

#### Windows PowerShell:
```powershell
# GET - Listar productos
Invoke-RestMethod -Uri "http://localhost:3001/api/productos" -Method GET

# GET - Obtener un producto
Invoke-RestMethod -Uri "http://localhost:3001/api/productos/1" -Method GET

# POST - Crear producto
$body = @{
    nombre = "Alimento Premium"
    stock = 100
    url_imagen = "https://ejemplo.com/imagen.jpg"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/api/productos" -Method POST -Body $body -ContentType "application/json"

# POST - Crear animal
$body = @{
    nombre = "Luna"
    edad = "2"
    descripcion = "Perro muy cariñoso"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/api/animales" -Method POST -Body $body -ContentType "application/json"
```

#### Linux/Mac (si tienes Git Bash o WSL):
```bash
# GET - Listar productos
curl http://localhost:3001/api/productos

# GET - Obtener un producto
curl http://localhost:3001/api/productos/1

# POST - Crear producto
curl -X POST http://localhost:3001/api/productos \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Alimento Premium","stock":100,"url_imagen":"https://ejemplo.com/imagen.jpg"}'
```

---

### 4. 📱 Postman

1. Descarga e instala [Postman](https://www.postman.com/downloads/)
2. Crea una nueva request
3. Configura:
   - Método HTTP
   - URL completa
   - Headers necesarios
   - Body (si aplica)

---

## 📋 Endpoints Disponibles

### 🔍 Health Check
- **GET** `/api/health` - Verificar que el servidor funciona

### 📦 Productos
- **GET** `/api/productos` - Listar todos los productos
- **GET** `/api/productos/:id` - Obtener un producto por ID
- **POST** `/api/productos` - Crear un producto
- **PUT** `/api/productos/:id` - Actualizar un producto
- **DELETE** `/api/productos/:id` - Eliminar un producto

### 🐾 Animales / Adopciones
- **GET** `/api/animales` - Listar todos los animales
- **GET** `/api/animales/adoptables` - Listar solo animales adoptables
- **GET** `/api/animales/:id` - Obtener un animal por ID
- **POST** `/api/animales` - Crear un animal
- **PUT** `/api/animales/:id` - Actualizar un animal
- **DELETE** `/api/animales/:id` - Eliminar un animal

### 📅 Turnos / Citas
- **GET** `/api/turnos` - Listar todos los turnos
- **GET** `/api/turnos/:id` - Obtener un turno por ID
- **POST** `/api/turnos` - Crear un turno
- **PUT** `/api/turnos/:id` - Actualizar un turno
- **DELETE** `/api/turnos/:id` - Eliminar un turno

### 🛒 Compras
- **GET** `/api/compras` - Listar todas las compras
- **GET** `/api/compras/:id` - Obtener una compra por ID
- **POST** `/api/compras` - Crear una compra
- **DELETE** `/api/compras/:id` - Eliminar una compra

### 📝 Formularios
- **GET** `/api/formularios` - Listar todos los formularios
- **GET** `/api/formularios/:id` - Obtener un formulario por ID
- **POST** `/api/formularios` - Crear un formulario
- **PUT** `/api/formularios/:id` - Actualizar un formulario

### 🔐 Autenticación (Ya existentes)
- **POST** `/api/register` - Registrarse
- **POST** `/api/login` - Iniciar sesión
- **GET** `/api/session` - Verificar sesión
- **POST** `/api/logout` - Cerrar sesión
- **POST** `/api/forgot-password` - Solicitar reseteo de contraseña
- **POST** `/api/reset-password` - Resetear contraseña

---

## 🚀 Pasos para Probar

1. **Asegúrate de que el servidor esté corriendo:**
   ```bash
   # Desde la carpeta del proyecto
   npm run dev
   # o
   node server.ts
   ```

2. **Abre tu navegador y ve a:**
   ```
   http://localhost:3001/api-test
   ```

3. **O usa cualquier herramienta mencionada arriba**

---

## ⚠️ Notas Importantes

- El servidor debe estar corriendo en el puerto **3001**
- Para requests POST/PUT, asegúrate de incluir el header `Content-Type: application/json`
- Algunos endpoints pueden requerir autenticación (sesión activa)
- Los IDs deben ser números válidos

---

## 📝 Ejemplos de Body para POST

### Crear Producto:
```json
{
  "nombre": "Alimento Premium para Perros",
  "stock": 50,
  "url_imagen": "https://ejemplo.com/imagen.jpg"
}
```

### Crear Animal:
```json
{
  "nombre": "Luna",
  "edad": "2",
  "descripcion": "Perro muy cariñoso y juguetón",
  "imagen_m": "https://ejemplo.com/luna.jpg"
}
```

### Crear Turno:
```json
{
  "mascota": 1,
  "motivo": "Consulta general",
  "fecha": "2024-01-15",
  "estado": "pendiente"
}
```

### Crear Compra:
```json
{
  "producto": 1,
  "unidades": 2,
  "precio": 5000
}
```

