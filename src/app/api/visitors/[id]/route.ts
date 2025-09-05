import { NextResponse } from "next/server";
import { checkoutVisitorById } from "@/utils/dbMethods";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const updated = await checkoutVisitorById(id);
    if (!updated)
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error(`PATCH /api/visitors/${params.id} error`, err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
