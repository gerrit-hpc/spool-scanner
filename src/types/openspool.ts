export interface OpenSpool {
  protocol: "openspool";
  version: "1.0";
  brand: string;
  type: string;
  color_hex: string;
  min_temp: string;
  max_temp: string;
  spool_id?: number;
  subtype?: string;
}
