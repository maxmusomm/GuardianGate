-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "team_leader_name" TEXT NOT NULL,
    "organisation" TEXT NOT NULL,
    "company_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."visitors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "idNumber" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "purpose_of_visit" TEXT NOT NULL,
    "person_for_visit" TEXT NOT NULL,
    "organisation" TEXT,
    "host_id" TEXT,
    "checked_in_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checked_out_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visitors_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."visitors" ADD CONSTRAINT "visitors_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
