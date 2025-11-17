-- DropForeignKey
ALTER TABLE "public"."password_resets" DROP CONSTRAINT "password_resets_user_id_fkey";

-- AddForeignKey
ALTER TABLE "password_resets" ADD CONSTRAINT "password_resets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("idusuario") ON DELETE CASCADE ON UPDATE CASCADE;
