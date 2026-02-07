import { spoolman } from "@/lib/spoolman";
import type { Spool } from "@/types/spoolman";
import { create } from "zustand";

interface SpoolState {
  spools: Spool[];
  isLoading: boolean;
  error: string | null;
  spoolmanUrl: string;
  
  // Actions
  setSpoolmanUrl: (url: string) => void;
  fetchSpools: () => Promise<void>;
}

export const useSpoolStore = create<SpoolState>((set, get) => ({
  spools: [],
  isLoading: false,
  error: null,
  spoolmanUrl: localStorage.getItem("spoolman_url") || "",

  setSpoolmanUrl: (url: string) => {
    const cleanUrl = url.replace(/\/$/, "");
    localStorage.setItem("spoolman_url", cleanUrl);
    set({ spoolmanUrl: cleanUrl });
    // Re-fetch spools when URL changes
    get().fetchSpools();
  },

  fetchSpools: async () => {
    const { spoolmanUrl } = get();
    
    // If we have a URL (or even if we don't, if we want to use the proxy)
    // Actually, if it's empty, spoolman.ts uses DEFAULT_BASE_URL which is the proxy.
    
    set({ isLoading: true, error: null });
    try {
      const data = await spoolman.getSpools(spoolmanUrl);
      
      // Filter out archived spools and sort
      const activeSpools = data.filter(s => !s.archived);
      activeSpools.sort((a, b) => {
        const dateA = a.last_used ? new Date(a.last_used).getTime() : (a.registered ? new Date(a.registered).getTime() : 0);
        const dateB = b.last_used ? new Date(b.last_used).getTime() : (b.registered ? new Date(b.registered).getTime() : 0);
        return dateB - dateA;
      });

      set({ spools: activeSpools, isLoading: false });
    } catch (err) {
      console.error("Failed to fetch spools:", err);
      set({ 
        error: "Failed to load spools. Please check your connection to Spoolman.", 
        isLoading: false 
      });
    }
  },
}));
