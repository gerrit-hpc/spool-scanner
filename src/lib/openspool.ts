import { z } from "zod";
import type { OpenSpool } from "../types/openspool";

export const OpenSpoolSchema = z.object({
  protocol: z.literal("openspool"),
  version: z.literal("1.0"),
  brand: z.string().min(1, "Brand is required"),
  type: z.string().min(1, "Material type is required"),
  color_hex: z
    .string()
    .length(6, "Color must be a 6-character hex code (without #)")
    .regex(/^[0-9A-Fa-f]{6}$/, "Color must be a valid hex code"),
  min_temp: z.string().regex(/^\d+$/, "Min temp must be a number string"),
  max_temp: z.string().regex(/^\d+$/, "Max temp must be a number string"),
  spool_id: z.number().optional(),
});

export function validateOpenSpool(data: unknown): {
  success: boolean;
  data?: OpenSpool;
  error?: z.ZodError;
} {
  const result = OpenSpoolSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data as OpenSpool };
  } else {
    return { success: false, error: result.error };
  }
}
