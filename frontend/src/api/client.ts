export const BASE_URL = "https://osk-backend.onrender.com/api";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data:    T;
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  const json: ApiEnvelope<T> = await res.json();
  if (!json.success) throw new Error(json.message || "Request failed");
  return json.data;
}
