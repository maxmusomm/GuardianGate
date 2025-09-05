import { NextResponse } from "next/server";
import {
  listRecentVisitors,
  createVisitor,
  checkoutVisitorById,
} from "@/utils/dbMethods";

export async function GET() {
  try {
    const list = await listRecentVisitors(200);
    return NextResponse.json(list, { status: 200 });
  } catch (err) {
    console.error("GET /api/visitors error", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = await createVisitor(body);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("POST /api/visitors error", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}

// Use PUT to perform a checkout by id: { id: string }
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body || !body.id)
      return NextResponse.json({ error: "MISSING_ID" }, { status: 400 });
    const updated = await checkoutVisitorById(body.id as string);
    if (!updated)
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (err) {
    console.error("PUT /api/visitors error", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
