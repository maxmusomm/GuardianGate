import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { updateUser } from "@/utils/dbMethods";

export async function PUT(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json(
        { ok: false, error: "not_signed_in" },
        { status: 401 }
      );

    const body = await request.json();
    const allowed: Partial<{
      team_leader_name: string;
      organisation: string;
      company_number: string;
    }> = body || {};

    const payload: any = {};
    if (typeof allowed.team_leader_name === "string")
      payload.teamLeaderName = allowed.team_leader_name;
    if (typeof allowed.organisation === "string")
      payload.organisation = allowed.organisation;
    if (typeof allowed.company_number === "string")
      payload.companyNumber = allowed.company_number;

    const updated = await updateUser(userId, payload);
    if (!updated)
      return NextResponse.json(
        { ok: false, error: "update_failed" },
        { status: 500 }
      );

    return NextResponse.json({ ok: true, user: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}
