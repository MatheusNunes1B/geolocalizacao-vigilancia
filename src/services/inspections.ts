import { validDraft, type Inspection, type InspectionDraft } from '../types/inspection';
export const STORAGE_KEY = 'vigilancia.inspections.v1';
export function loadInspections(): Inspection[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data: unknown = JSON.parse(raw);
    if (
      !Array.isArray(data) ||
      !data.every((r) => typeof r.id === 'string' && r.id.length > 0 && validDraft(r)) ||
      new Set(data.map((r) => r.id)).size !== data.length
    )
      throw new Error();
    return data.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
  } catch {
    throw new Error(
      'Não foi possível ler os registros locais. Os dados foram preservados. Verifique o armazenamento deste dispositivo.',
    );
  }
}
function persist(records: Inspection[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    throw new Error(
      'Não foi possível salvar. O armazenamento pode estar cheio ou bloqueado. Seus dados não foram alterados.',
    );
  }
}
function uniqueId(): string {
  if (crypto.randomUUID) return crypto.randomUUID();
  return Array.from(crypto.getRandomValues(new Uint8Array(16)), (n) =>
    n.toString(16).padStart(2, '0'),
  ).join('');
}
export function saveInspection(draft: InspectionDraft): Inspection {
  if (!validDraft(draft))
    throw new Error('Preencha os campos obrigatórios e capture uma localização válida.');
  const record = {
    ...draft,
    restaurant: draft.restaurant.trim(),
    inspector: draft.inspector.trim(),
    id: uniqueId(),
  };
  persist([record, ...loadInspections()]);
  return record;
}
export function deleteInspection(id: string): void {
  persist(loadInspections().filter((r) => r.id !== id));
}
