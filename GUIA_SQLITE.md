# 🗄️ Guía: Configuración de SQLite

## ¿Por qué SQLite?

SQLite es perfecto para este proyecto porque:
- ✅ **No requiere instalación** de servidor de base de datos
- ✅ **No requiere configuración** complicada
- ✅ **Archivo único** - toda la base de datos está en un archivo
- ✅ **Ligero y rápido** para desarrollo y aplicaciones pequeñas/medianas
- ✅ **Ya está incluido** en el proyecto

## Configuración Actual

Tu proyecto ya está configurado para usar SQLite:
- **Ubicación de la BD**: `src/database/basededatos.sqlite`
- **Schema de Prisma**: Configurado para SQLite
- **Cliente de Prisma**: Generado para SQLite

## Crear la Base de Datos

### Opción 1: Usar Prisma (Recomendado - Más fácil)

```bash
# 1. Asegúrate de que el .env tenga:
DATABASE_URL="file:./src/database/basededatos.sqlite"

# 2. Genera el cliente (si no lo has hecho)
npx prisma generate

# 3. Crea las tablas automáticamente
npx prisma db push
```

¡Listo! Las tablas se crearán automáticamente basándose en tu `schema.prisma`.

### Opción 2: Usar el script SQL manual

```bash
# 1. Asegúrate de tener sqlite3 instalado
sqlite3 --version

# 2. Ejecuta el script
sqlite3 src/database/basededatos.sqlite < scripts/create-database-sqlite.sql
```

### Opción 3: Usar el script automático (Windows)

```bash
cd scripts
.\setup-sqlite.bat
```

## Verificar que Funciona

```bash
# 1. Inicia el servidor
npm run dev

# 2. En Postman, prueba:
GET http://localhost:3000/db/health

# 3. Deberías ver:
{
  "ok": true,
  "message": "DB connection OK"
}
```

## Ventajas de SQLite vs PostgreSQL

| Característica | SQLite | PostgreSQL |
|----------------|--------|------------|
| Instalación | No requiere | Requiere instalación |
| Configuración | Ninguna | Requiere configuración |
| Archivo | Un solo archivo | Múltiples archivos |
| Escalabilidad | Pequeña/Media | Grande |
| Uso | Desarrollo/Producción pequeña | Producción grande |

## Comandos Útiles

### Ver el contenido de la base de datos

```bash
# Con sqlite3
sqlite3 src/database/basededatos.sqlite
.tables          # Ver todas las tablas
.schema cliente  # Ver estructura de una tabla
SELECT * FROM cliente;  # Ver datos
.quit           # Salir
```

### Con Prisma Studio (Interfaz gráfica)

```bash
npx prisma studio
```

Esto abrirá una interfaz web en `http://localhost:5555` donde puedes ver y editar los datos.

### Resetear la base de datos

```bash
# Borra el archivo y vuelve a crearlo
rm src/database/basededatos.sqlite
npx prisma db push
```

## Migraciones con Prisma

Aunque SQLite es más simple, puedes usar migraciones de Prisma:

```bash
# Crear una migración
npx prisma migrate dev --name nombre_de_la_migracion

# Aplicar migraciones
npx prisma migrate deploy
```

## Solución de Problemas

### Error: "database is locked"
- Cierra todas las conexiones a la base de datos
- Reinicia el servidor
- Asegúrate de que no hay otros procesos usando la BD

### Error: "no such table"
- Ejecuta `npx prisma db push` para crear las tablas
- Verifica que el archivo `basededatos.sqlite` existe

### Error: "foreign key constraint failed"
- SQLite requiere habilitar foreign keys
- El script SQL ya lo hace con `PRAGMA foreign_keys = ON;`
- Prisma lo maneja automáticamente

## Próximos Pasos

1. ✅ Base de datos configurada
2. ✅ Tablas creadas
3. ✅ Backend conectado
4. 🚀 ¡Comienza a desarrollar!

## Notas Importantes

- **Backup**: El archivo `basededatos.sqlite` es tu base de datos completa. Haz backup regularmente.
- **Git**: Considera agregar `*.sqlite` al `.gitignore` si contiene datos sensibles
- **Producción**: Para producción, considera migrar a PostgreSQL si necesitas mayor escalabilidad

¡Tu proyecto está listo para usar SQLite! 🎉

