-- CreateTable
CREATE TABLE "users" (
    "idusuario" SERIAL NOT NULL,
    "name" TEXT,
    "lastname" TEXT,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("idusuario")
);

-- CreateTable
CREATE TABLE "formulario" (
    "idformulario" SERIAL NOT NULL,
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
    "eventos" TEXT NOT NULL,
    "otras_mascotas_actualmente" INTEGER NOT NULL,
    "tipo_mascotas_actual" TEXT NOT NULL,
    "recursos" TEXT NOT NULL,
    "vacunar_y_esterilizar" TEXT NOT NULL,
    "encargado_cuidado" TEXT NOT NULL,
    "sitio_animal_solo" TEXT NOT NULL,
    "rol_del_animal" TEXT NOT NULL,
    "estado" TEXT NOT NULL,

    CONSTRAINT "formulario_pkey" PRIMARY KEY ("idformulario")
);

-- CreateTable
CREATE TABLE "productos" (
    "idproducto" SERIAL NOT NULL,
    "nombre" TEXT,
    "url_imagen" TEXT,
    "stock" INTEGER NOT NULL,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("idproducto")
);

-- CreateTable
CREATE TABLE "compra" (
    "idcompra" SERIAL NOT NULL,
    "producto" INTEGER,
    "unidades" INTEGER,
    "precio" INTEGER,

    CONSTRAINT "compra_pkey" PRIMARY KEY ("idcompra")
);

-- CreateTable
CREATE TABLE "animal" (
    "idanimal" SERIAL NOT NULL,
    "nombre" TEXT,
    "edad" INTEGER,
    "descripcion" TEXT,
    "imagen_m" TEXT,
    "dueño" INTEGER,

    CONSTRAINT "animal_pkey" PRIMARY KEY ("idanimal")
);

-- CreateTable
CREATE TABLE "turno" (
    "idturno" SERIAL NOT NULL,
    "mascota" INTEGER,
    "motivo" TEXT,
    "fecha" TEXT,
    "estado" TEXT NOT NULL,

    CONSTRAINT "turno_pkey" PRIMARY KEY ("idturno")
);

-- CreateTable
CREATE TABLE "perfil" (
    "idperfil" SERIAL NOT NULL,
    "nombre" TEXT,
    "apellido" TEXT,
    "telefono" INTEGER,
    "mail" TEXT,
    "mascota" INTEGER,

    CONSTRAINT "perfil_pkey" PRIMARY KEY ("idperfil")
);

-- CreateTable
CREATE TABLE "consultas" (
    "idconsulta" SERIAL NOT NULL,
    "nombre" INTEGER,
    "descripcion" TEXT,

    CONSTRAINT "consultas_pkey" PRIMARY KEY ("idconsulta")
);

-- CreateTable
CREATE TABLE "historial_medico" (
    "idhistorial" SERIAL NOT NULL,
    "mascota" INTEGER,
    "turnos_pasados" TEXT,
    "vacunas" TEXT,

    CONSTRAINT "historial_medico_pkey" PRIMARY KEY ("idhistorial")
);

-- CreateTable
CREATE TABLE "password_resets" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "reset_token" TEXT,
    "expiration_date" TIMESTAMP(3),

    CONSTRAINT "password_resets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "compra" ADD CONSTRAINT "compra_producto_fkey" FOREIGN KEY ("producto") REFERENCES "productos"("idproducto") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animal" ADD CONSTRAINT "animal_dueño_fkey" FOREIGN KEY ("dueño") REFERENCES "users"("idusuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turno" ADD CONSTRAINT "turno_mascota_fkey" FOREIGN KEY ("mascota") REFERENCES "animal"("idanimal") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfil" ADD CONSTRAINT "perfil_mascota_fkey" FOREIGN KEY ("mascota") REFERENCES "animal"("idanimal") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultas" ADD CONSTRAINT "consultas_nombre_fkey" FOREIGN KEY ("nombre") REFERENCES "perfil"("idperfil") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_medico" ADD CONSTRAINT "historial_medico_mascota_fkey" FOREIGN KEY ("mascota") REFERENCES "animal"("idanimal") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_resets" ADD CONSTRAINT "password_resets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("idusuario") ON DELETE RESTRICT ON UPDATE CASCADE;
