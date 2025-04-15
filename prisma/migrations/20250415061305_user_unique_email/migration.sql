-- DropIndex
DROP INDEX "User_email_key";

-- DropIndex
DROP INDEX "User_totpSecret_key";

CREATE UNIQUE INDEX user_email_unique
ON "User" (email)
WHERE "deletedAt" IS NULL;