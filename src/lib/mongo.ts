export async function insertDocument(collection: string, document: any) {
  const url = process.env.MONGODB_DATA_API_URL;
  const key = process.env.MONGODB_DATA_API_KEY;
  const dataSource = process.env.MONGODB_DATA_SOURCE || "Cluster0";
  const db = process.env.MONGODB_DATA_DB || "app";

  if (!url || !key) {
    throw new Error("MONGODB_DATA_API_URL or MONGODB_DATA_API_KEY not configured");
  }

  const res = await fetch(`${url}/action/insertOne`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": key,
    },
    body: JSON.stringify({
      dataSource,
      database: db,
      collection,
      document,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Mongo Data API error: ${text}`);
  }

  return res.json();
}
