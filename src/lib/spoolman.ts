import type { Spool, Filament, Vendor } from "@/types/spoolman";

const DEFAULT_BASE_URL = "/spoolman/api/v1";

function getBaseUrl() {
  const storedUrl = localStorage.getItem("spoolman_url");
  if (storedUrl) {
    // Ensure we don't double-slash if the user added one, though Settings.tsx strips it.
    // Also assuming the user inputs the root URL, so we append /api/v1
    return `${storedUrl}/api/v1`;
  }
  return DEFAULT_BASE_URL;
}

async function fetchSpoolman<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}${endpoint}`, options);

  if (!response.ok) {
    throw new Error(`Spoolman API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export const spoolman = {
  getSpools: () => fetchSpoolman<Spool[]>("/spool"),
  getSpool: (id: number) => fetchSpoolman<Spool>(`/spool/${id}`),
  getFilaments: () => fetchSpoolman<Filament[]>("/filament"),
  getVendors: () => fetchSpoolman<Vendor[]>("/vendor"),
};
