"use client";

import { useState } from "react";

export default function ResendForm() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const send = async () => {
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/integrations/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, html }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "send failed");
      setMsg("Sent");
    } catch (err: any) {
      setMsg(err.message || String(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2 max-w-md">
      <input placeholder="to" value={to} onChange={(e) => setTo(e.target.value)} className="w-full p-2 rounded" />
      <input placeholder="subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full p-2 rounded" />
      <textarea placeholder="html" value={html} onChange={(e) => setHtml(e.target.value)} className="w-full p-2 rounded h-28" />
      <div className="flex items-center space-x-2">
        <button onClick={send} disabled={busy} className="px-4 py-2 bg-blue-600 text-white rounded">
          {busy ? "Sending..." : "Send"}
        </button>
        <span className="text-sm text-gray-400">{msg}</span>
      </div>
    </div>
  );
}
