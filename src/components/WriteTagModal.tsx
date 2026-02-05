import { useState } from "react";
import type { Spool } from "@/types/spoolman";
import { mapSpoolToOpenSpool } from "@/lib/mapper";
import { NFCService } from "@/lib/nfc";
import { X, Wifi, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";

interface WriteTagModalProps {
  spool: Spool;
  onClose: () => void;
}

type Step = "preview" | "writing" | "success" | "error";

export function WriteTagModal({ spool, onClose }: WriteTagModalProps) {
  const [step, setStep] = useState<Step>("preview");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const openSpoolData = mapSpoolToOpenSpool(spool);

  const handleWrite = async () => {
    if (!NFCService.isSupported()) {
      setErrorMsg("NFC is not supported on this device/browser.");
      setStep("error");
      return;
    }

    setStep("writing");
    const nfc = new NFCService();

    try {
      await nfc.write(openSpoolData as unknown as Record<string, unknown>);
      setStep("success");
    } catch (err) {
      console.error("NFC Write Error:", err);
      setErrorMsg(err instanceof Error ? err.message : "Unknown error occurred while writing to tag.");
      setStep("error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Write to NFC Tag</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {step === "preview" && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
                 <div className="p-2 bg-blue-100 rounded-full text-blue-600 mt-1">
                    <Wifi className="w-5 h-5" />
                 </div>
                 <div>
                    <h3 className="font-medium text-blue-900">Ready to Encode</h3>
                    <p className="text-sm text-blue-700 mt-1">
                        Review the data below before writing it to your NFC tag.
                    </p>
                 </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 font-mono text-sm overflow-x-auto">
                <pre>{JSON.stringify(openSpoolData, null, 2)}</pre>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleWrite}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  Start Scanning
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === "writing" && (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
                <div className="relative bg-blue-100 p-6 rounded-full">
                    <Wifi className="w-12 h-12 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Ready to Scan</h3>
                <p className="text-gray-500 mt-2">
                  Hold your device near the NFC tag to write data.
                </p>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Success!</h3>
                <p className="text-gray-500 mt-2">
                  Data successfully written to the NFC tag.
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium transition-colors"
              >
                Done
              </button>
            </div>
          )}

          {step === "error" && (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
              <div className="bg-red-100 p-4 rounded-full">
                <AlertCircle className="w-12 h-12 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Write Failed</h3>
                <p className="text-red-600 mt-2 text-sm px-4">
                  {errorMsg}
                </p>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={handleWrite}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                    Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
