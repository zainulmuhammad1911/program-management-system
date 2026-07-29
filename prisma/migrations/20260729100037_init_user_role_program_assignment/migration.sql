-- CreateEnum
CREATE TYPE "GlobalRole" AS ENUM ('ADMIN');

-- CreateEnum
CREATE TYPE "ProgramRole" AS ENUM ('PROGRAM_MANAGER', 'PROGRAM_OFFICER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "provider_account_id" TEXT,
    "role" "GlobalRole",
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "program_assignments" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "program_id" TEXT NOT NULL,
    "role_in_program" "ProgramRole" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "program_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_provider_account_id_key" ON "users"("provider_account_id");

-- CreateIndex
CREATE INDEX "program_assignments_program_id_idx" ON "program_assignments"("program_id");

-- CreateIndex
CREATE UNIQUE INDEX "program_assignments_user_id_program_id_key" ON "program_assignments"("user_id", "program_id");

-- AddForeignKey
ALTER TABLE "program_assignments" ADD CONSTRAINT "program_assignments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
