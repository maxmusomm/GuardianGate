import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getUserById } from "@/utils/dbMethods";

export async function GET() {
  try {
    const authUser = await currentUser();
    if (!authUser)
      return NextResponse.json(
        { ok: false, error: "not_signed_in" },
        { status: 401 }
      );

    const dbUser = await getUserById(authUser.id as string);
    if (!dbUser)
      return NextResponse.json(
        { ok: false, error: "not_found" },
        { status: 404 }
      );

    return NextResponse.json({ ok: true, user: dbUser });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}
