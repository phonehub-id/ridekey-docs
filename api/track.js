import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  const ip =
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "unknown";

  const today = new Date().toISOString().split("T")[0];

  const totalKey = "motolock:total";
  const uniqueKey = `motolock:unique:${ip}:${today}`;

  let total = (await kv.get(totalKey)) || 0;
  total++;
  await kv.set(totalKey, total);

  let already = await kv.get(uniqueKey);
  let isUnique = false;

  if (!already) {
    await kv.set(uniqueKey, true);
    isUnique = true;
  }

  res.status(200).json({
    total_visits: total,
    unique_today: isUnique
  });
}
