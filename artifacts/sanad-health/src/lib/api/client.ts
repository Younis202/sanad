const BASE = "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Network error" }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  emergency: {
    scan: (nationalId: string) => request(`/emergency/${nationalId}`),
  },
  physician: {
    dashboard: (nationalId: string) => request(`/physician/${nationalId}`),
    checkInteraction: (newDrug: string, existingDrugs: string[]) =>
      request("/medications/check-interaction", {
        method: "POST",
        body: JSON.stringify({ newDrug, existingDrugs }),
      }),
  },
  citizen: {
    dashboard: (nationalId: string) => request(`/citizen/${nationalId}`),
  },
  national: {
    stats: () => request("/stats"),
    patients: () => request("/patients"),
  },
  ai: {
    predictions: (nationalId: string) => request(`/ai/predictions/${nationalId}`),
  },
};
