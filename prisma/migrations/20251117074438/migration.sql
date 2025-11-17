/*
  Warnings:

  - You are about to drop the column `mascota` on the `perfil` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."perfil" DROP CONSTRAINT "perfil_mascota_fkey";

-- AlterTable
ALTER TABLE "animal" ADD COLUMN     "perfilId" INTEGER;

-- AlterTable
ALTER TABLE "perfil" DROP COLUMN "mascota";

-- CreateTable
CREATE TABLE "pets" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "especie" TEXT NOT NULL,
    "foto" TEXT,
    "adoptable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" TEXT NOT NULL,
    "userId" INTEGER,
    "petId" TEXT,
    "motivo" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupons" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "coupons_code_key" ON "coupons"("code");

-- AddForeignKey
ALTER TABLE "animal" ADD CONSTRAINT "animal_perfilId_fkey" FOREIGN KEY ("perfilId") REFERENCES "perfil"("idperfil") ON DELETE SET NULL ON UPDATE CASCADE;
