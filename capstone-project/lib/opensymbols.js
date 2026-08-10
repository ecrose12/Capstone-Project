
const OPENSYMBOLS_BASE = "https://www.opensymbols.org/api/v2";

let cachedToken = null;
let tokenExpiresAt = 0;

async function getAccessToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiresAt) {
    return cachedToken;
  }

  const res = await fetch(
    `${OPENSYMBOLS_BASE}/token?secret=${encodeURIComponent(process.env.OPENSYMBOLS_SECRET)}`,
    { method: "POST" }
  );

  if (!res.ok) {
    throw new Error(`Failed to get OpenSymbols token: ${res.status}`);
  }

  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiresAt = now + 10 * 60 * 1000;
  return cachedToken;
}

export async function searchSymbols(query, { locale = "en", safe = true } = {}) {
  const token = await getAccessToken();

  const params = new URLSearchParams({
    q: query,
    access_token: token,
    locale,
    safe: safe ? "1" : "0",
  });

  const res = await fetch(`${OPENSYMBOLS_BASE}/symbols?${params.toString()}`);

  if (res.status === 401) {
    cachedToken = null;
    const retryToken = await getAccessToken();
    params.set("access_token", retryToken);
    const retryRes = await fetch(`${OPENSYMBOLS_BASE}/symbols?${params.toString()}`);
    return retryRes.json();
  }

  if (!res.ok) {
    throw new Error(`OpenSymbols search failed: ${res.status}`);
  }

  return res.json();
}