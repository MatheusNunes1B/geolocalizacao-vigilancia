import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import type { Inspection } from '../types/inspection';
import { mapsUrl } from './maps';
import { formatDate } from './formatters';
export function inspectionText(r: Inspection) {
  return [
    'AUTO DE VISTORIA SANITÁRIA',
    'ID: ' + r.id,
    'Restaurante: ' + r.restaurant,
    'Fiscal: ' + r.inspector,
    'Data: ' + formatDate(r.date),
    'Endereço: ' + (r.address || 'Não informado'),
    'Resultado: ' + r.result,
    'Observações: ' + (r.notes || 'Não informadas'),
    'Latitude: ' + r.location.latitude,
    'Longitude: ' + r.location.longitude,
    'Precisão: ' + r.location.accuracy + ' m',
    'Captura: ' + formatDate(r.location.timestamp),
    'Permissão aproximada: ' + (r.location.approximate ? 'Sim' : 'Não identificada'),
    mapsUrl(r.location),
    'Demonstração acadêmica — armazenamento local, sem validade de auto oficial.',
  ].join('\n');
}
export async function shareInspection(r: Inspection) {
  const text = inspectionText(r);
  if (Capacitor.isNativePlatform()) {
    await Share.share({ title: 'Auto de vistoria', text });
    return 'Compartilhamento aberto.';
  }
  if (navigator.share) {
    await navigator.share({ title: 'Auto de vistoria', text });
    return 'Compartilhamento concluído.';
  }
  await navigator.clipboard.writeText(text);
  return 'Auto copiado para a área de transferência.';
}
export function exportInspection(r: Inspection) {
  const url = URL.createObjectURL(
    new Blob([inspectionText(r)], { type: 'text/plain;charset=utf-8' }),
  );
  const a = document.createElement('a');
  a.href = url;
  a.download = 'vistoria-' + r.id + '.txt';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
