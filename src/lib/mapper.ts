import type { Spool } from "../types/spoolman";
import type { OpenSpool } from "../types/openspool";

export function mapSpoolToOpenSpool(spool: Spool): OpenSpool {
  const filament = spool.filament;
  const vendor = filament.vendor;

  // Handle color: remove '#' if present, ensure 6 chars. Default to black if missing.
  let colorHex = filament.color_hex?.replace(/^#/, "") || "000000";
  if (!/^[0-9A-Fa-f]{6}$/.test(colorHex)) {
    colorHex = "000000";
  }

  // Handle temps: Spoolman has one temp setting. OpenSpool expects min/max.
  // We'll use the single temp for both, or a default of 200 if missing.
  const temp = filament.settings_extruder_temp ? Math.round(filament.settings_extruder_temp).toString() : "200";

  return {
    protocol: "openspool",
    version: "1.0",
    brand: vendor?.name || "Generic",
    type: filament.material || "PLA",
    color_hex: colorHex,
    min_temp: temp,
    max_temp: temp,
    spool_id: spool.id,
  };
}
