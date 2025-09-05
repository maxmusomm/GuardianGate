-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "team_leader_name" TEXT NOT NULL,
    "organisation" TEXT NOT NULL,
    "company_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
