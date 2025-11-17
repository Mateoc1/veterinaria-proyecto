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

-- AddForeignKey
ALTER TABLE "animal" ADD CONSTRAINT "animal_perfilId_fkey" FOREIGN KEY ("perfilId") REFERENCES "perfil"("idperfil") ON DELETE SET NULL ON UPDATE CASCADE;
