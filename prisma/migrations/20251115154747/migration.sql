/*
  Warnings:

  - Made the column `stock` on table `productos` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "formulario" ADD COLUMN     "apellido" TEXT,
ADD COLUMN     "ciudad" TEXT,
ADD COLUMN     "codigo_postal" INTEGER,
ADD COLUMN     "direccion" TEXT,
ADD COLUMN     "fecha_nacimiento" TEXT,
ADD COLUMN     "mail" TEXT,
ADD COLUMN     "nombre" TEXT,
ADD COLUMN     "numero_documento" INTEGER,
ADD COLUMN     "pais" TEXT,
ADD COLUMN     "provincia" TEXT,
ADD COLUMN     "telefono" INTEGER,
ADD COLUMN     "tipo_documento" TEXT;

-- AlterTable
ALTER TABLE "perfil" ADD COLUMN     "apellido" TEXT,
ADD COLUMN     "mail" TEXT,
ADD COLUMN     "telefono" INTEGER;

-- AlterTable
ALTER TABLE "productos" ALTER COLUMN "stock" SET NOT NULL;
