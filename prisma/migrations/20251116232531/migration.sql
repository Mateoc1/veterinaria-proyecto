/*
  Warnings:

  - You are about to drop the column `created_at` on the `password_resets` table. All the data in the column will be lost.
  - You are about to drop the column `expires_at` on the `password_resets` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `password_resets` table. All the data in the column will be lost.
  - You are about to drop the column `used` on the `password_resets` table. All the data in the column will be lost.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `appointments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cliente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `coupons` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `products` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `eventos` to the `formulario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."animal" DROP CONSTRAINT "animal_dueño_fkey";

-- DropForeignKey
ALTER TABLE "public"."appointments" DROP CONSTRAINT "appointments_pet_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."appointments" DROP CONSTRAINT "appointments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."password_resets" DROP CONSTRAINT "password_resets_user_id_fkey";

-- DropIndex
DROP INDEX "public"."password_resets_token_key";

-- AlterTable
ALTER TABLE "formulario" ADD COLUMN     "eventos" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "password_resets" DROP COLUMN "created_at",
DROP COLUMN "expires_at",
DROP COLUMN "token",
DROP COLUMN "used",
ADD COLUMN     "expiration_date" TIMESTAMP(3),
ADD COLUMN     "reset_token" TEXT;

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "id",
ADD COLUMN     "idusuario" SERIAL NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("idusuario");

-- DropTable
DROP TABLE "public"."appointments";

-- DropTable
DROP TABLE "public"."cliente";

-- DropTable
DROP TABLE "public"."coupons";

-- DropTable
DROP TABLE "public"."pets";

-- DropTable
DROP TABLE "public"."products";

-- AddForeignKey
ALTER TABLE "animal" ADD CONSTRAINT "animal_dueño_fkey" FOREIGN KEY ("dueño") REFERENCES "users"("idusuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_resets" ADD CONSTRAINT "password_resets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("idusuario") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE historial_medico
ADD CONSTRAINT historial_medico_mascota_fkey
FOREIGN KEY (mascota)
REFERENCES animal(idanimal)
ON DELETE SET NULL;
