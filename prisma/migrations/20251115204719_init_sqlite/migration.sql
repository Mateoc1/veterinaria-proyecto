-- CreateTable
CREATE TABLE "cliente" (
    "idusuario" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mail" TEXT NOT NULL,
    "contraseña" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "formulario" (
    "idformulario" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT,
    "apellido" TEXT,
    "telefono" INTEGER,
    "mail" TEXT,
    "fecha_nacimiento" TEXT,
    "direccion" TEXT,
    "ciudad" TEXT,
    "provincia" TEXT,
    "codigo_postal" INTEGER,
    "pais" TEXT,
    "tipo_documento" TEXT,
    "numero_documento" INTEGER,
    "tipo_vivienda" TEXT NOT NULL,
    "espacio_seguro" TEXT NOT NULL,
    "tiempo_solo" INTEGER NOT NULL,
    "personas_encasa" INTEGER NOT NULL,
    "familia_deacuerdo" TEXT NOT NULL,
    "otras_mascotas_anteriormente" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "otras_mascotas_actualmente" INTEGER NOT NULL,
    "tipo_mascotas_actual" TEXT NOT NULL,
    "recursos" TEXT NOT NULL,
    "vacunar_y_esterilizar" TEXT NOT NULL,
    "encargado_cuidado" TEXT NOT NULL,
    "sitio_animal_solo" TEXT NOT NULL,
    "rol_del_animal" TEXT NOT NULL,
    "estado" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "productos" (
    "idproducto" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT,
    "url_imagen" TEXT,
    "stock" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "compra" (
    "idcompra" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "producto" INTEGER,
    "unidades" INTEGER,
    "precio" INTEGER,
    CONSTRAINT "compra_producto_fkey" FOREIGN KEY ("producto") REFERENCES "productos" ("idproducto") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "animal" (
    "idanimal" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT,
    "edad" INTEGER,
    "descripcion" TEXT,
    "imagen_m" TEXT,
    "dueño" INTEGER,
    CONSTRAINT "animal_dueño_fkey" FOREIGN KEY ("dueño") REFERENCES "cliente" ("idusuario") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "turno" (
    "idturno" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mascota" INTEGER,
    "motivo" TEXT,
    "fecha" TEXT,
    "estado" TEXT NOT NULL,
    CONSTRAINT "turno_mascota_fkey" FOREIGN KEY ("mascota") REFERENCES "animal" ("idanimal") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "perfil" (
    "idperfil" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT,
    "apellido" TEXT,
    "telefono" INTEGER,
    "mail" TEXT,
    "mascota" INTEGER,
    CONSTRAINT "perfil_mascota_fkey" FOREIGN KEY ("mascota") REFERENCES "animal" ("idanimal") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "consultas" (
    "idconsulta" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" INTEGER,
    "descripcion" TEXT,
    CONSTRAINT "consultas_nombre_fkey" FOREIGN KEY ("nombre") REFERENCES "perfil" ("idperfil") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "historial_medico" (
    "idhistorial" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mascota" INTEGER,
    "turnos_pasados" TEXT,
    "vacunas" TEXT,
    CONSTRAINT "historial_medico_mascota_fkey" FOREIGN KEY ("mascota") REFERENCES "animal" ("idanimal") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "lastname" TEXT,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "password_resets" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" DATETIME NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "password_resets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "password_resets_token_key" ON "password_resets"("token");
