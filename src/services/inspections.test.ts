import { beforeEach, expect, it, vi } from 'vitest';
import { loadInspections, saveInspection, deleteInspection, STORAGE_KEY } from './inspections';
import { validPoint, type InspectionDraft } from '../types/inspection';
import { mapsUrl } from '../utils/maps';
const data = new Map<string, string>();
beforeEach(() => {
  data.clear();
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => {
      data.set(k, v);
    },
  });
});
const draft: InspectionDraft = {
  restaurant: 'Restaurante teste',
  inspector: 'Fiscal teste',
  address: '',
  notes: '',
  date: '2026-11-03T12:00:00Z',
  result: 'Conforme',
  location: {
    latitude: -23.5,
    longitude: -46.6,
    accuracy: 15,
    timestamp: 1793707200000,
    approximate: false,
  },
};
it('persiste um auto completo, recupera e exclui', () => {
  const r = saveInspection(draft);
  expect(r.id).toBeTruthy();
  expect(loadInspections()).toEqual([r]);
  deleteInspection(r.id);
  expect(loadInspections()).toEqual([]);
});
it('rejeita registros incompletos e coordenadas inválidas', () => {
  expect(() => saveInspection({ ...draft, restaurant: '  ' })).toThrow();
  expect(() =>
    saveInspection({ ...draft, location: { ...draft.location, latitude: 91 } }),
  ).toThrow();
  expect(() => saveInspection({ ...draft, date: 'inválida' })).toThrow();
  expect(validPoint({ ...draft.location, accuracy: NaN })).toBe(false);
  expect(validPoint({ ...draft.location, timestamp: 1e300 })).toBe(false);
  expect(validPoint({ ...draft.location, latitude: 0, longitude: 0 })).toBe(true);
});
it('preserva registros corrompidos em vez de sobrescrevê-los', () => {
  data.set(STORAGE_KEY, 'dados corrompidos');
  expect(() => saveInspection(draft)).toThrow();
  expect(data.get(STORAGE_KEY)).toBe('dados corrompidos');
});
it('informa falha de armazenamento sem sucesso falso', () => {
  vi.stubGlobal('localStorage', {
    getItem: () => null,
    setItem: () => {
      throw new Error('quota');
    },
  });
  expect(() => saveInspection(draft)).toThrow('Não foi possível salvar');
});
it('gera link do Google Maps com as coordenadas exatas', () => {
  expect(mapsUrl(draft.location)).toBe(
    'https://www.google.com/maps/search/?api=1&query=-23.5,-46.6',
  );
});
