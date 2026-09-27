const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function getOverview() {
  const res = await fetch(`${API_URL}/overview`);
  if (!res.ok) throw new Error(`Overview request failed (${res.status})`);
  return res.json();
}

export async function detectDeforestation(beforeFile, afterFile) {
  const formData = new FormData();
  formData.append("before", beforeFile);
  formData.append("after", afterFile);

  const res = await fetch(`${API_URL}/detect`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error(`Detection request failed (${res.status})`);
  return res.json();
}