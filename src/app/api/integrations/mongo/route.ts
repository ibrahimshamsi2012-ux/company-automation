import { NextRequest, NextResponse } from "next/server";
import { insertDocument } from "@/lib/mongo";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { collection = "assessments", document } = body;
    if (!document) return NextResponse.json({ error: "missing document" }, { status: 400 });

    const result = await insertDocument(collection, document);
    return NextResponse.json({ ok: true, result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
