import { useSpoolStore } from "@/store/useSpoolStore";
import type { Spool } from "@/types/spoolman";
import { AlertCircle, Loader2, Scan, Search, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { ReadTagModal } from "./ReadTagModal";
import { SpoolCard } from "./SpoolCard";
import { WriteTagModal } from "./WriteTagModal";

interface DashboardProps {
  onSettingsClick: () => void;
}

export function Dashboard({ onSettingsClick }: DashboardProps) {
  const { spools, isLoading: loading, error, fetchSpools } = useSpoolStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpool, setSelectedSpool] = useState<Spool | null>(null);
  const [showReadTagModal, setShowReadTagModal] = useState(false);

  useEffect(() => {
    fetchSpools();
  }, [fetchSpools]);

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
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Spool Dashboard</h1>
            <p className="text-gray-600">Manage and track your 3D printing filaments.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowReadTagModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
            >
              <Scan className="w-4 h-4" />
              Scan Tag
            </button>
            <button
              onClick={onSettingsClick}
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              title="Settings"
            >
              <Settings className="h-6 w-6" />
            </button>
          </div>
        </div>
        
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
            <SpoolCard 
                key={spool.id} 
                spool={spool} 
                onWriteClick={setSelectedSpool}
            />
          ))}
        </div>
      )}
      
      {selectedSpool && (
        <WriteTagModal
          spool={selectedSpool}
          onClose={() => setSelectedSpool(null)}
        />
      )}

      {showReadTagModal && (
        <ReadTagModal
          onClose={() => setShowReadTagModal(false)}
        />
      )}
    </div>
  );
}
