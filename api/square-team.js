export default async function handler(req, res) {
  // Allow requests from the browser
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { token, location_ids } = req.body;
  if (!token) return res.status(400).json({ error: "Missing token" });

  try {
    const body = location_ids?.length ? { location_ids } : {};
    const response = await fetch("https://connect.squareup.com/v2/team-members/search", {
      method: "POST",
      headers: {
        "Authorization":  `Bearer ${token}`,
        "Content-Type":   "application/json",
        "Square-Version": "2025-05-21",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
