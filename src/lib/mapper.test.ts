import { describe, it, expect } from 'vitest';
import { mapSpoolToOpenSpool } from './mapper';
import type { Spool } from '../types/spoolman';

describe('mapSpoolToOpenSpool', () => {
  const baseSpool: Spool = {
    id: 1,
    registered: '2023-01-01T00:00:00Z',
    archived: false,
    filament: {
      id: 1,
      registered: '2023-01-01T00:00:00Z',
      density: 1.24,
      diameter: 1.75,
      vendor: {
        id: 1,
        registered: '2023-01-01T00:00:00Z',
        name: 'Bambu Lab',
      },
      material: 'PLA',
      color_hex: '00FF00', // Green
      settings_extruder_temp: 220,
    },
  };

  it('should map a fully populated spool correctly', () => {
    const result = mapSpoolToOpenSpool(baseSpool);
    expect(result).toEqual({
      protocol: 'openspool',
      version: '1.0',
      brand: 'Bambu Lab',
      type: 'PLA',
      color_hex: '00FF00',
      min_temp: '220',
      max_temp: '220',
      spool_id: 1,
    });
  });

  it('should handle missing vendor by defaulting to "Generic"', () => {
    const spoolWithoutVendor: Spool = {
      ...baseSpool,
      filament: {
        ...baseSpool.filament,
        vendor: undefined,
      },
    };
    const result = mapSpoolToOpenSpool(spoolWithoutVendor);
    expect(result.brand).toBe('Generic');
  });

  it('should handle missing material by defaulting to "PLA"', () => {
    const spoolWithoutMaterial: Spool = {
      ...baseSpool,
      filament: {
        ...baseSpool.filament,
        material: undefined,
      },
    };
    const result = mapSpoolToOpenSpool(spoolWithoutMaterial);
    expect(result.type).toBe('PLA');
  });

  it('should strip "#" from color_hex', () => {
    const spoolWithHashColor: Spool = {
      ...baseSpool,
      filament: {
        ...baseSpool.filament,
        color_hex: '#FF0000',
      },
    };
    const result = mapSpoolToOpenSpool(spoolWithHashColor);
    expect(result.color_hex).toBe('FF0000');
  });

  it('should default invalid color length to "000000"', () => {
    const spoolWithShortColor: Spool = {
      ...baseSpool,
      filament: {
        ...baseSpool.filament,
        color_hex: 'FFF', 
      },
    };
    const result = mapSpoolToOpenSpool(spoolWithShortColor);
    expect(result.color_hex).toBe('000000');
  });

  it('should default non-hex color strings to "000000"', () => {
     const spoolWithBadHex: Spool = {
      ...baseSpool,
      filament: {
        ...baseSpool.filament,
        color_hex: 'ZZZZZZ', 
      },
    };
    const result = mapSpoolToOpenSpool(spoolWithBadHex);
    expect(result.color_hex).toBe('000000');
  });

  it('should default missing color to "000000"', () => {
     const spoolWithoutColor: Spool = {
      ...baseSpool,
      filament: {
        ...baseSpool.filament,
        color_hex: undefined, 
      },
    };
    const result = mapSpoolToOpenSpool(spoolWithoutColor);
    expect(result.color_hex).toBe('000000');
  });

  it('should default missing temp to "200"', () => {
    const spoolWithoutTemp: Spool = {
      ...baseSpool,
      filament: {
        ...baseSpool.filament,
        settings_extruder_temp: undefined,
      },
    };
    const result = mapSpoolToOpenSpool(spoolWithoutTemp);
    expect(result.min_temp).toBe('200');
    expect(result.max_temp).toBe('200');
  });
});
