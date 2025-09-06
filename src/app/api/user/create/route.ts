import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createUser, getUserById } from "@/utils/dbMethods";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json(
        { ok: false, error: "not_signed_in" },
        { status: 401 }
      );

    // If a DB user already exists for this Clerk id, return conflict
    const existing = await getUserById(userId);
    if (existing)
      return NextResponse.json(
        { ok: false, error: "already_exists" },
        { status: 409 }
      );

    const body = await request.json();
    const allowed: Partial<{
      team_leader_name: string;
      organisation: string;
      company_number: string;
    }> = body || {};

    if (
      typeof allowed.team_leader_name !== "string" ||
      typeof allowed.organisation !== "string"
    ) {
      return NextResponse.json(
        { ok: false, error: "invalid_payload" },
        { status: 400 }
      );
    }

    const signedIn = await currentUser();
    const email = signedIn?.emailAddresses?.[0]?.emailAddress as
      | string
      | undefined;

    const payload = {
      id: userId as string,
      team_leader_name: allowed.team_leader_name,
      organisation: allowed.organisation,
      company_number:
        (typeof allowed.company_number === "string" &&
          allowed.company_number) ||
        "",
      email: email || "",
    };

    const created = await createUser(payload as any);
    return NextResponse.json({ ok: true, user: created }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}
