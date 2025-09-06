import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import {
  listRecentVisitors,
  createVisitor,
  checkoutVisitorById,
} from "@/utils/dbMethods";
import { z } from "zod";

const visitorSchema = z.object({
  name: z.string().min(2),
  idNumber: z.string().min(2),
  phoneNumber: z.string().min(10),
  purposeOfVisit: z.string().min(2),
  personForVisit: z.string().min(2),
  organisation: z.string().min(2).optional(),
});

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
    const parsed = visitorSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "invalid_payload" },
        { status: 400 }
      );
    }

    const authUser = await currentUser();
    const hostId = authUser?.id ?? null;

    const payload = {
      ...parsed.data,
      organisation: parsed.data.organisation ?? null,
      hostId,
    };

    const created = await createVisitor(payload as any);

    return NextResponse.json({ ok: true, visitor: created }, { status: 201 });
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
