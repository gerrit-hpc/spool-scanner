import { useState, useEffect } from "react";
import { spoolman } from "@/lib/spoolman";
import type { Spool } from "@/types/spoolman";
import { SpoolCard } from "./SpoolCard";
import { Search, Loader2, AlertCircle } from "lucide-react";

export function Dashboard() {
  const [spools, setSpools] = useState<Spool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadSpools() {
      try {
        setLoading(true);
        const data = await spoolman.getSpools();
        // Filter out archived spools by default if needed, or just show everything.
        // Usually dashboards show active spools. Let's filter out archived ones if the API doesn't.
        // Checking the type definition, there is an 'archived' boolean.
        const activeSpools = data.filter(s => !s.archived);
        
        // Sort by last_used (desc), then registered (desc)
        activeSpools.sort((a, b) => {
            const dateA = a.last_used ? new Date(a.last_used).getTime() : (a.registered ? new Date(a.registered).getTime() : 0);
            const dateB = b.last_used ? new Date(b.last_used).getTime() : (b.registered ? new Date(b.registered).getTime() : 0);
            return dateB - dateA;
        });

        setSpools(activeSpools);
      } catch (err) {
        console.error("Failed to fetch spools:", err);
        setError("Failed to load spools. Please check your connection to Spoolman.");
      } finally {
        setLoading(false);
      }
    }

    loadSpools();
  }, []);

  const filteredSpools = spools.filter((spool) => {
    const query = searchQuery.toLowerCase();
    const filamentName = spool.filament.name?.toLowerCase() || "";
    const vendorName = spool.filament.vendor?.name?.toLowerCase() || "";
    const material = spool.filament.material?.toLowerCase() || "";
    
    return (
      filamentName.includes(query) ||
      vendorName.includes(query) ||
      material.includes(query)
    );
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Spool Dashboard</h1>
        <p className="text-gray-600">Manage and track your 3D printing filaments.</p>
        
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search filaments, vendors, materials..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-500">Loading your spools...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      ) : filteredSpools.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <p className="text-gray-500 text-lg">No spools found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSpools.map((spool) => (
            <SpoolCard key={spool.id} spool={spool} />
          ))}
        </div>
      )}
    </div>
  );
}
