# Scripts de Configuración de Base de Datos

Este directorio contiene scripts para configurar la base de datos PostgreSQL para el proyecto Veterinaria.

## Archivos

### `setup-postgresql.bat` (Windows)
Script de configuración automática para Windows que:
- Verifica que el archivo `.env` esté configurado
- Ejecuta migraciones Prisma (`prisma db push`)
- Genera el cliente Prisma

**Uso:**
```bash
.\scripts\setup-postgresql.bat
```

**Requisitos previos:**
1. PostgreSQL debe estar instalado y corriendo
2. El archivo `.env` debe tener una variable `DATABASE_URL` válida

**Ejemplo de `.env`:**
```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/veterinaria"
SESSION_SECRET="tu_secreto_seguro_aqui"
PORT=3001
```

### `create-database-postgresql.sql`
Script SQL que contiene la definición completa del schema de la base de datos en PostgreSQL.

**Uso manual (si es necesario):**
```bash
psql -U usuario -d veterinaria -f scripts/create-database-postgresql.sql
```

## Flujo de Configuración Recomendado

1. **Instalar PostgreSQL**
   - Descarga desde: https://www.postgresql.org/download/
   - Instala y recuerda la contraseña del usuario `postgres`

2. **Crear base de datos**
   ```bash
   createdb veterinaria
   ```

3. **Configurar `.env`**
   ```env
   DATABASE_URL="postgresql://postgres:tucontraseña@localhost:5432/veterinaria"
   SESSION_SECRET="tu_secreto_seguro"
   PORT=3001
   ```

4. **Ejecutar script de setup**
   ```bash
   npm run setup:db
   ```
   O en Windows:
   ```bash
   .\scripts\setup-postgresql.bat
   ```

5. **Iniciar el servidor**
   ```bash
   npm run dev
   ```

## Schema de Base de Datos

El schema actual incluye las siguientes tablas:

- **users**: Usuarios del sistema
- **password_resets**: Tokens para reseteo de contraseña
- **formulario**: Formularios de adopción
- **productos**: Productos disponibles en tienda
- **compra**: Órdenes de compra
- **animal**: Mascotas disponibles para adopción
- **turno**: Citas veterinarias
- **perfil**: Perfiles de usuarios
- **consultas**: Consultas asociadas a perfiles
- **historial_medico**: Historial médico de animales
- **session**: Gestión de sesiones (express-session)

## Migraciones

Las migraciones se encuentran en `prisma/migrations/`. Para crear una nueva migración después de cambiar el schema:

```bash
npx prisma migrate dev --name nombre_de_la_migracion
```

Para resetear la base de datos (solo desarrollo):

```bash
npx prisma migrate reset
```

## Troubleshooting

### "Error: connect ECONNREFUSED"
PostgreSQL no está corriendo o la URL de conexión es incorrecta.

Verifica:
```bash
# Ver servicio de PostgreSQL (Windows)
tasklist | findstr postgres

# Reiniciar PostgreSQL
services.msc
```

### "Error: Base de datos no existe"
Crea la base de datos:
```bash
createdb veterinaria
```

### "Error: Usuario/contraseña incorrectos"
Verifica la variable `DATABASE_URL` en `.env` y asegúrate de que coincida con tu configuración de PostgreSQL.
