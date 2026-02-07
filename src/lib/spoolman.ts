import type { Filament, Spool, Vendor } from "@/types/spoolman";

const DEFAULT_BASE_URL = "/spoolman/api/v1";

async function fetchSpoolman<T>(endpoint: string, baseUrl?: string, options?: RequestInit): Promise<T> {
  const finalBaseUrl = baseUrl ? `${baseUrl}/api/v1` : DEFAULT_BASE_URL;
  const response = await fetch(`${finalBaseUrl}${endpoint}`, options);

  if (!response.ok) {
    throw new Error(`Spoolman API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export const spoolman = {
  getSpools: (baseUrl?: string) => fetchSpoolman<Spool[]>("/spool", baseUrl),
  getSpool: (id: number, baseUrl?: string) => fetchSpoolman<Spool>(`/spool/${id}`, baseUrl),
  getFilaments: (baseUrl?: string) => fetchSpoolman<Filament[]>("/filament", baseUrl),
  getVendors: (baseUrl?: string) => fetchSpoolman<Vendor[]>("/vendor", baseUrl),
};
