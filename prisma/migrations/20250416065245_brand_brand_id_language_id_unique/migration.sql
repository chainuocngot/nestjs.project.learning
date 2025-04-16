/*
  Warnings:

  - Added the required column `name` to the `Brand` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Brand" ADD COLUMN     "name" VARCHAR(500) NOT NULL;

CREATE UNIQUE INDEX brand_brand_id_language_id_unique
ON "BrandTranslation" ("brandId", "languageId")
WHERE "deletedAt" IS NULL;