import { useState, useEffect, useRef } from "react";
import { X, Scan, CheckCircle2, AlertCircle, Search, Loader2 } from "lucide-react";
import { NFCService, decodeJSONRecord } from "@/lib/nfc";
import { validateOpenSpool } from "@/lib/openspool";
import { spoolman } from "@/lib/spoolman";
import type { Spool } from "@/types/spoolman";
import type { OpenSpool } from "@/types/openspool";

interface ReadTagModalProps {
  onClose: () => void;
}

export function ReadTagModal({ onClose }: ReadTagModalProps) {
  const [status, setStatus] = useState<"scanning" | "processing" | "success" | "error">("scanning");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tagData, setTagData] = useState<OpenSpool | null>(null);
  const [foundSpool, setFoundSpool] = useState<Spool | null>(null);
  const [lookingUp, setLookingUp] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    startScanning();
    return () => {
      stopScanning();
    };
  }, []);

  const startScanning = async () => {
    try {
      setStatus("scanning");
      setErrorMessage(null);
      setTagData(null);
      setFoundSpool(null);
      
      const controller = new AbortController();
      abortControllerRef.current = controller;
      
      const nfc = new NFCService();
      await nfc.scan(
        (message) => {
          // Process records
          for (const record of message.records) {
            // We are looking for a JSON record
            // The OpenSpool spec usually implies a specific MIME type or just checking payload
            // Assuming it's written as application/json based on NFCService.write implementation
            
            const json = decodeJSONRecord(record);
            if (json) {
              const validation = validateOpenSpool(json);
              if (validation.success && validation.data) {
                setTagData(validation.data);
                setStatus("success");
                stopScanning(); // Stop scanning once found
                return;
              }
            }
          }
          
          // If we looped through all records and didn't find a valid OpenSpool record
          // We might want to notify the user, or just keep scanning?
          // For a "Scan Tag" modal, usually immediate feedback is good.
          // But maybe the tag has other records first.
          // If we found *no* valid OpenSpool data in the *entire* message:
          // We can optionally show an error "Tag read, but no OpenSpool data found".
          // But consecutive reads happen fast, so maybe better to just wait for a valid one
          // or show a transient toast.
          // For this implementation, I'll update status to error if not found, 
          // but allow 'Retry'
          setErrorMessage("Tag read, but valid OpenSpool data was not found.");
          setStatus("error");
          stopScanning();
        },
        (error) => {
          console.error("NFC Reading Error:", error);
          setErrorMessage("Failed to read NFC tag. Please try again.");
          setStatus("error");
        },
        controller.signal
      );
    } catch (err) {
      console.error("NFC Start Error:", err);
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Could not start NFC scanning.");
      }
      setStatus("error");
    }
  };

  const stopScanning = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  const handleLookupSpool = async () => {
    if (!tagData?.spool_id) return;

    try {
      setLookingUp(true);
      setLookupError(null);
      const spool = await spoolman.getSpool(tagData.spool_id);
      setFoundSpool(spool);
    } catch (err) {
      console.error("Spool lookup error:", err);
      setLookupError("Could not find this spool ID in your Spoolman instance.");
    } finally {
      setLookingUp(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Scan className="w-5 h-5 text-blue-600" />
            Scan OpenSpool Tag
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {status === "scanning" && (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
                <div className="relative bg-white p-4 rounded-full border-2 border-blue-100 shadow-sm">
                  <Scan className="w-12 h-12 text-blue-600" />
                </div>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">Ready to Scan</p>
                <p className="text-gray-500">Hold your device near the NFC tag</p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
              <div className="bg-red-50 p-4 rounded-full">
                <AlertCircle className="w-12 h-12 text-red-500" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">Scanning Failed</p>
                <p className="text-red-600">{errorMessage}</p>
              </div>
              <button
                onClick={startScanning}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Try Again
              </button>
            </div>
          )}

          {status === "success" && tagData && (
            <div className="space-y-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-100 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-900">Tag Read Successfully</h3>
                  <p className="text-green-700 text-sm">OpenSpool data found.</p>
                </div>
              </div>

              {/* Tag Data Display */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="h-2" style={{ backgroundColor: `#${tagData.color_hex}` }} />
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Brand</p>
                      <p className="font-medium text-gray-900">{tagData.brand}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Type</p>
                      <p className="font-medium text-gray-900">{tagData.type}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                     <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Temp</p>
                      <p className="text-gray-700">{tagData.min_temp}°C - {tagData.max_temp}°C</p>
                     </div>
                     <div className="text-right">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Color</p>
                        <div className="flex items-center gap-1 justify-end">
                            <span className="text-gray-700">#{tagData.color_hex}</span>
                            <div className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: `#${tagData.color_hex}`}} />
                        </div>
                     </div>
                  </div>

                  {tagData.spool_id && (
                    <div className="border-t border-gray-100 pt-3">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Spool ID</p>
                      <p className="font-mono text-gray-700">#{tagData.spool_id}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                {tagData.spool_id ? (
                    !foundSpool ? (
                        <div className="space-y-2">
                             <button
                                onClick={handleLookupSpool}
                                disabled={lookingUp}
                                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                              >
                                {lookingUp ? (
                                  <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Finding Spool...
                                  </>
                                ) : (
                                  <>
                                    <Search className="w-4 h-4" />
                                    Find in Spoolman
                                  </>
                                )}
                              </button>
                              {lookupError && (
                                <p className="text-sm text-red-600 text-center">{lookupError}</p>
                              )}
                        </div>
                    ) : (
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-white rounded-md border border-gray-200 shadow-sm">
                                     {/* Simple visual representation of found spool */}
                                     <div className="w-8 h-8 rounded-full" style={{ backgroundColor: `#${foundSpool.filament.color_hex || 'cccccc'}`}} />
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">Spool Found!</h4>
                                    <p className="text-sm text-gray-600">
                                        {foundSpool.filament.vendor?.name} {foundSpool.filament.name}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Remaining: {foundSpool.remaining_weight !== undefined ? Math.round(foundSpool.remaining_weight) : "?"}g
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                ) : (
                    <div className="text-center text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                        This tag doesn't have a linked Spoolman ID.
                    </div>
                )}
                
                <button
                    onClick={startScanning}
                    className="w-full py-2.5 px-4 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                >
                    Scan Another Tag
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
