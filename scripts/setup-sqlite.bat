@echo off
echo ========================================
echo Configuracion de Base de Datos SQLite
echo ========================================
echo.

REM Verificar si sqlite3 está disponible
where sqlite3 >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: SQLite3 no esta instalado o no esta en el PATH
    echo.
    echo SQLite3 viene pre-instalado con Windows 10/11
    echo Si no lo tienes, puedes instalarlo desde: https://www.sqlite.org/download.html
    echo O usar Prisma para crear las tablas automaticamente
    echo.
    pause
    exit /b 1
)

echo SQLite3 encontrado!
echo.

REM Crear directorio si no existe
if not exist "src\database" mkdir "src\database"

REM Ruta de la base de datos
set DB_PATH=src\database\basededatos.sqlite

echo Creando base de datos en: %DB_PATH%
echo.

REM Crear la base de datos y ejecutar el script SQL
sqlite3 %DB_PATH% < scripts\create-database-sqlite.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Base de datos creada exitosamente!
    echo.
) else (
    echo.
    echo ERROR al crear la base de datos
    pause
    exit /b 1
)

echo Actualizando archivo .env...
echo.

REM Actualizar .env
cd /d "%~dp0.."
set ENV_FILE=.env
set DATABASE_URL=DATABASE_URL="file:./src/database/basededatos.sqlite"

REM Verificar si .env existe y actualizar o crear
if exist %ENV_FILE% (
    REM Reemplazar DATABASE_URL si existe
    powershell -Command "(Get-Content %ENV_FILE%) -replace 'DATABASE_URL=.*', '%DATABASE_URL%' | Set-Content %ENV_FILE%"
) else (
    echo %DATABASE_URL% > %ENV_FILE%
)

echo Archivo .env actualizado
echo.
echo ========================================
echo Configuracion completada!
echo ========================================
echo.
echo Siguiente paso: Ejecuta 'npx prisma generate' y luego 'npx prisma db push'
echo.
pause

