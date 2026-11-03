import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { validPoint, type GeoPoint } from '../types/inspection';
export function locationError(error: unknown): string {
  const code = String((error as { code?: unknown })?.code ?? '');
  if (code === '1' || code === 'OS-PLUG-GLOC-0003')
    return 'Permissão de localização negada. No Android, abra Configurações > Aplicativos > Vigilância Sanitária > Permissões > Localização e permita durante o uso. No navegador, revise a permissão do site.';
  if (code === '3' || code === 'OS-PLUG-GLOC-0010')
    return 'O tempo de localização foi excedido. Tente novamente em um local aberto.';
  if (
    ['OS-PLUG-GLOC-0007', 'OS-PLUG-GLOC-0009', 'OS-PLUG-GLOC-0016', 'OS-PLUG-GLOC-0017'].includes(
      code,
    )
  )
    return 'Ative a localização do dispositivo para registrar a vistoria. Verifique também o modo avião e a conectividade.';
  if (['OS-PLUG-GLOC-0014', 'OS-PLUG-GLOC-0015'].includes(code))
    return 'Verifique os serviços do Google Play e a conexão do dispositivo e tente novamente.';
  if (code === 'OS-PLUG-GLOC-0018')
    return 'As permissões nativas não estão configuradas. Sincronize e reinstale o aplicativo Android.';
  if (code === '2' || code === 'OS-PLUG-GLOC-0002')
    return 'Não foi possível obter as coordenadas. Verifique a localização do dispositivo e tente em um local aberto.';
  return error instanceof Error && !code
    ? error.message
    : 'Não foi possível acessar sua localização. Verifique as permissões e tente novamente.';
}
export async function captureLocation(onStatus: (message: string) => void): Promise<GeoPoint> {
  let approximate = false;
  if (Capacitor.isNativePlatform()) {
    let permission = await Geolocation.checkPermissions();
    if (permission.location !== 'granted' && permission.coarseLocation !== 'granted') {
      if (permission.location === 'denied' && permission.coarseLocation === 'denied')
        throw { code: 'OS-PLUG-GLOC-0003' };
      onStatus(
        permission.location === 'prompt-with-rationale'
          ? 'A localização comprova o ponto da vistoria. Autorize o acesso durante o uso.'
          : 'Aguardando autorização do Android…',
      );
      permission = await Geolocation.requestPermissions({
        permissions: ['location', 'coarseLocation'],
      });
    }
    if (permission.location !== 'granted' && permission.coarseLocation !== 'granted')
      throw { code: 'OS-PLUG-GLOC-0003' };
    approximate = permission.location !== 'granted';
    onStatus(
      approximate
        ? 'Permissão aproximada concedida. A precisão poderá ser limitada.'
        : 'Permissão precisa concedida. Obtendo coordenadas…',
    );
  } else {
    if (!window.isSecureContext)
      throw new Error(
        'A localização exige HTTPS ou localhost. Acesso por HTTP na rede local não permite capturar coordenadas.',
      );
    if (!navigator.geolocation)
      throw new Error('Este navegador não oferece suporte à localização.');
    // requestPermissions não é suportado na Web; getCurrentPosition solicita o acesso.
    try {
      const permission = await Geolocation.checkPermissions();
      if (permission.location === 'denied') throw { code: 1 };
    } catch (error) {
      if ((error as { code?: unknown })?.code === 1) throw error;
      // Alguns navegadores não implementam Permissions API, mas oferecem geolocalização.
    }
    onStatus('Aguardando permissão e localização do navegador…');
  }
  const position = await Geolocation.getCurrentPosition({
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 0,
  });
  const point: GeoPoint = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    accuracy: position.coords.accuracy,
    timestamp: position.timestamp,
    approximate,
  };
  if (!validPoint(point))
    throw new Error('O dispositivo retornou coordenadas inválidas. Capture novamente.');
  return point;
}
