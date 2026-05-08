export const VALID_UNITS = ['kg', 'g', 'l', 'ml', 'un'] as const;
export type MeasurementUnit = (typeof VALID_UNITS)[number];
