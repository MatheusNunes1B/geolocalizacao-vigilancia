import { Capacitor } from '@capacitor/core';
import { AppLauncher } from '@capacitor/app-launcher';
import type { GeoPoint } from '../types/inspection';
export const mapsUrl = (p: GeoPoint) =>
  'https://www.google.com/maps/search/?api=1&query=' + p.latitude + ',' + p.longitude;
export async function openMaps(point: GeoPoint) {
  if (Capacitor.isNativePlatform()) {
    const result = await AppLauncher.openUrl({ url: mapsUrl(point) });
    if (!result.completed)
      throw new Error('Não foi possível abrir o mapa. Verifique se há um navegador instalado.');
  } else {
    window.open(mapsUrl(point), '_blank', 'noopener,noreferrer');
  }
}
