import type { Spool, Filament, Vendor } from "@/types/spoolman";

const BASE_URL = "/spoolman/api/v1";

async function fetchSpoolman<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, options);

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
