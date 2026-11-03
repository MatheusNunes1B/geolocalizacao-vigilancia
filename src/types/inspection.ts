export const results = ['Conforme', 'Com irregularidades', 'Pendente de avaliação'] as const;
export type Result = (typeof results)[number];
export interface GeoPoint {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  approximate: boolean;
}
export interface Inspection {
  id: string;
  restaurant: string;
  inspector: string;
  address: string;
  date: string;
  notes: string;
  result: Result;
  location: GeoPoint;
}
export type InspectionDraft = Omit<Inspection, 'id'>;
export function validPoint(value: unknown): value is GeoPoint {
  if (!value || typeof value !== 'object') return false;
  const p = value as GeoPoint;
  return (
    Number.isFinite(p.latitude) &&
    Math.abs(p.latitude) <= 90 &&
    Number.isFinite(p.longitude) &&
    Math.abs(p.longitude) <= 180 &&
    Number.isFinite(p.accuracy) &&
    p.accuracy >= 0 &&
    Number.isFinite(p.timestamp) &&
    p.timestamp > 0 &&
    Number.isFinite(new Date(p.timestamp).getTime()) &&
    typeof p.approximate === 'boolean'
  );
}
export function validDraft(value: unknown): value is InspectionDraft {
  if (!value || typeof value !== 'object') return false;
  const r = value as InspectionDraft;
  return (
    typeof r.restaurant === 'string' &&
    r.restaurant.trim().length > 0 &&
    r.restaurant.length <= 150 &&
    typeof r.inspector === 'string' &&
    r.inspector.trim().length > 0 &&
    r.inspector.length <= 150 &&
    typeof r.address === 'string' &&
    r.address.length <= 300 &&
    typeof r.notes === 'string' &&
    r.notes.length <= 4000 &&
    typeof r.date === 'string' &&
    Number.isFinite(Date.parse(r.date)) &&
    results.includes(r.result) &&
    validPoint(r.location)
  );
}
