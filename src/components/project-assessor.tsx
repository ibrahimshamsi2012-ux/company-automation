"use client";

import { useState } from "react";

export function ProjectAssessor() {
  const [projectUrl, setProjectUrl] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/ai/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectUrl, description, email }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Request failed");
      setResult(json.result);
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 rounded-2xl">
      <h3 className="font-bold text-lg mb-4">Project Assessor</h3>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="text-sm text-gray-300">Your Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1 p-2 rounded bg-[#0b1220]" placeholder="you@company.com" />
        </div>
        <div>
          <label className="text-sm text-gray-300">Project Repo / URL</label>
          <input value={projectUrl} onChange={(e) => setProjectUrl(e.target.value)} className="w-full mt-1 p-2 rounded bg-[#0b1220]" placeholder="https://github.com/..." />
        </div>
        <div>
          <label className="text-sm text-gray-300">Short Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full mt-1 p-2 rounded bg-[#0b1220]" rows={3} />
        </div>
        <div className="flex items-center space-x-2">
          <button disabled={loading} className="px-4 py-2 bg-blue-600 rounded text-white font-bold">{loading ? "Assessing..." : "Assess Project"}</button>
        </div>
      </form>

      {error && <div className="mt-4 text-red-400">{error}</div>}

      {result && (
        <div className="mt-6 bg-[#07101a] p-4 rounded">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-bold">{result.score ?? "—"}</div>
              <div className="text-sm text-gray-400">Score (0-100)</div>
            </div>
            <div className="max-w-lg text-sm text-gray-300">{result.summary}</div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-bold">Strengths</h4>
              <ul className="list-disc list-inside text-sm text-gray-300">
                {(result.strengths || []).map((s: string, i: number) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-bold">Risks</h4>
              <ul className="list-disc list-inside text-sm text-gray-300">
                {(result.risks || []).map((s: string, i: number) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectAssessor;
