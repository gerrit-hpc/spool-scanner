import { useSpoolStore } from "@/store/useSpoolStore";
import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";

interface SettingsProps {
  onBack: () => void;
}

export function Settings({ onBack }: SettingsProps) {
  const { spoolmanUrl, setSpoolmanUrl } = useSpoolStore();
  const [url, setUrl] = useState(spoolmanUrl);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSpoolmanUrl(url);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Dashboard
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="spoolman-url" className="block text-sm font-medium text-gray-700 mb-2">
                Spoolman Instance URL
              </label>
              <div className="space-y-2">
                <input
                  id="spoolman-url"
                  type="url"
                  placeholder="http://your-spoolman-instance:7912"
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <p className="text-sm text-gray-500">
                  Enter the full URL to your Spoolman instance (e.g., http://192.168.1.100:7912).
                  Leave empty to use the default proxy.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={handleSave}
                className={`flex items-center justify-center w-full sm:w-auto px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 ${
                  saved
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                <Save className="h-5 w-5 mr-2" />
                {saved ? "Saved!" : "Save Configuration"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
