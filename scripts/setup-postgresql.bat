@echo off
echo ========================================
echo Configuracion de Base de Datos PostgreSQL
echo ========================================
echo.

REM Cambiar al directorio del proyecto
cd /d "%~dp0.."

REM Verificar si .env existe
if not exist .env (
    echo ERROR: Archivo .env no encontrado
    echo.
    echo Crear archivo .env con la configuracion de PostgreSQL:
    echo DATABASE_URL="postgresql://neondb_owner:npg_do65TQRkyAwH@ep-aged-bird-acxzocl5-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    echo PORT=3001
    echo.
    pause
    exit /b 1
)

echo Archivo .env encontrado
echo.

REM Verificar que DATABASE_URL esté configurado
findstr /R "DATABASE_URL=" .env >nul
if %ERRORLEVEL% NEQ 0 (
    echo ADVERTENCIA: DATABASE_URL no está configurado en .env
    echo.
    echo Agrega la siguiente línea a tu archivo .env:
    echo DATABASE_URL="postgresql://neondb_owner:npg_do65TQRkyAwH@ep-aged-bird-acxzocl5-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    echo.
    pause
)

echo Verificando conexión a PostgreSQL...
echo.

REM Ejecutar migraciones con Prisma
echo Ejecutando migraciones de base de datos...
call npx prisma db push --skip-generate

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: No se pudo conectar a la base de datos
    echo.
    echo Verifica que:
    echo 1. PostgreSQL esté instalado y en ejecución
    echo 2. DATABASE_URL en .env sea correcto
    echo 3. La base de datos PostgreSQL exista y sea accesible
    echo.
    pause
    exit /b 1
)

echo.
echo Generando cliente Prisma...
call npx prisma generate

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Configuracion completada exitosamente!
    echo ========================================
    echo.
    echo Base de datos: PostgreSQL
    echo Migraciones: Aplicadas
    echo Cliente Prisma: Generado
    echo.
    echo Para iniciar el servidor:
    echo   npm run dev
    echo.
) else (
    echo.
    echo ERROR: No se pudo generar el cliente Prisma
    echo.
    pause
    exit /b 1
)

pause

