import type { Spool } from "@/types/spoolman";
import { Clock, Weight, Wifi } from "lucide-react";

interface SpoolCardProps {
  spool: Spool;
  onWriteClick?: (spool: Spool) => void;
}

export function SpoolCard({ spool, onWriteClick }: SpoolCardProps) {
  const { filament, remaining_weight, initial_weight } = spool;
  const color = filament.color_hex ? `#${filament.color_hex}` : "#cccccc";
  
  // Calculate percentage if possible
  const percentage =
    remaining_weight !== undefined && initial_weight
      ? Math.round((remaining_weight / initial_weight) * 100)
      : null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="h-2" style={{ backgroundColor: color }} />
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {filament.vendor?.name || "Unknown Vendor"}
            </span>
            <h3 className="font-bold text-gray-800 text-lg leading-tight">
              {filament.name || "Unknown Filament"}
            </h3>
          </div>
          <div
            className="w-6 h-6 rounded-full border border-gray-200 shadow-sm flex-shrink-0"
            style={{ backgroundColor: color }}
            title={`Color: ${color}`}
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
            {filament.material && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                    {filament.material}
                </span>
            )}
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                ID: {spool.id}
            </span>
        </div>

        <div className="space-y-2 text-sm text-gray-600 mb-4 flex-1">
          <div className="flex items-center gap-2">
            <Weight className="w-4 h-4 text-gray-400" />
            <span>
              {remaining_weight != null ? `${Math.round(remaining_weight)}g` : "Unknown"} remaining
              {percentage !== null && ` (${percentage}%)`}
            </span>
          </div>
          {spool.last_used && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>Last used: {new Date(spool.last_used).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        
        {percentage !== null && (
            <div className="mb-4 w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                <div 
                    className="h-1.5 rounded-full" 
                    style={{ width: `${Math.min(100, Math.max(0, percentage))}%`, backgroundColor: color }}
                ></div>
            </div>
        )}

        {onWriteClick && (
          <button
            onClick={() => onWriteClick(spool)}
            className="w-full mt-auto flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 transition-all text-sm font-medium group"
          >
            <Wifi className="w-4 h-4 group-hover:text-blue-600 transition-colors" />
            Write to Tag
          </button>
        )}
      </div>
    </div>
  );
}
