export interface Vendor {
  id: number;
  registered: string;
  name: string;
  comment?: string;
}

export interface Filament {
  id: number;
  registered: string;
  name?: string;
  vendor?: Vendor;
  material?: string;
  price?: number;
  density: number;
  diameter: number;
  weight?: number;
  spool_weight?: number;
  article_number?: string;
  comment?: string;
  settings_extruder_temp?: number;
  settings_bed_temp?: number;
  color_hex?: string;
}

export interface Spool {
  id: number;
  registered: string;
  first_used?: string;
  last_used?: string;
  filament: Filament;
  remaining_weight?: number;
  used_weight?: number;
  initial_weight?: number;
  spool_weight?: number;
  archived: boolean;
  comment?: string;
}
