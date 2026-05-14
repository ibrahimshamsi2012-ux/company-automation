import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, properties } = body;

    const API_KEY = process.env.POSTHOG_API_KEY;
    const HOST = process.env.POSTHOG_API_HOST || "https://app.posthog.com";
    if (!API_KEY) return NextResponse.json({ error: "POSTHOG_API_KEY not set" }, { status: 500 });

    const payload = {
      api_key: API_KEY,
      event,
      properties: properties || {},
    };

    const res = await fetch(`${HOST}/capture/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text }, { status: res.status });
    }
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
