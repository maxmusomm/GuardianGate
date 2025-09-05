import { NextResponse } from "next/server";
import { getUserByEmail } from "@/utils/dbMethods";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!email)
      return NextResponse.json(
        { ok: false, error: "invalid_email", message: "Email is required" },
        { status: 400 }
      );
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
      return NextResponse.json(
        { ok: false, error: "invalid_email", message: "Enter a valid email" },
        { status: 400 }
      );
    if (!password)
      return NextResponse.json(
        { ok: false, error: "no_password", message: "Password is required" },
        { status: 400 }
      );

    const user = await getUserByEmail(email);
    if (!user)
      return NextResponse.json(
        {
          ok: false,
          error: "not_found",
          message: "No account with that email",
        },
        { status: 404 }
      );

    const argon2 = await import("argon2");
    const ok = await argon2.verify(user.password, password);
    if (!ok)
      return NextResponse.json(
        { ok: false, error: "wrong_password", message: "Incorrect password" },
        { status: 401 }
      );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "server_error", message: "Server error" },
      { status: 500 }
    );
  }
}
