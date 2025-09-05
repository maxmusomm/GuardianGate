import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createUser } from "@/utils/dbMethods";

type BodyObject = {
  team_leader_name: string;
  organisation: string;
  company_number: string;
};

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    const signedInUser = await currentUser();
    const email = signedInUser?.emailAddresses;
    const body: BodyObject = await request.json();

    const userMataDate = {
      ...body,
      email: email?.[0]?.emailAddress as string,
      id: userId as string,
    };

    const newUser = await createUser(userMataDate);

    return NextResponse.json({ ok: true, user: newUser }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
