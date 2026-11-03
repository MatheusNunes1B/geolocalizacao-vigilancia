import { beforeEach, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({
  native: vi.fn(),
  check: vi.fn(),
  request: vi.fn(),
  get: vi.fn(),
}));
vi.mock('@capacitor/core', () => ({ Capacitor: { isNativePlatform: mocks.native } }));
vi.mock('@capacitor/geolocation', () => ({
  Geolocation: {
    checkPermissions: mocks.check,
    requestPermissions: mocks.request,
    getCurrentPosition: mocks.get,
  },
}));
import { captureLocation, locationError } from './geolocation';
beforeEach(() => {
  vi.resetAllMocks();
  mocks.native.mockReturnValue(true);
  mocks.get.mockResolvedValue({
    coords: { latitude: -23, longitude: -46, accuracy: 10 },
    timestamp: 1000,
  });
});
it('solicita permissão uma vez e usa posição nativa de alta precisão', async () => {
  mocks.check.mockResolvedValue({ location: 'prompt-with-rationale', coarseLocation: 'prompt' });
  mocks.request.mockResolvedValue({ location: 'granted', coarseLocation: 'granted' });
  const result = await captureLocation(vi.fn());
  expect(result.latitude).toBe(-23);
  expect(mocks.request).toHaveBeenCalledTimes(1);
  expect(mocks.get).toHaveBeenCalledWith({
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 0,
  });
});
it('aceita aproximada com identificação explícita', async () => {
  mocks.check.mockResolvedValue({ location: 'denied', coarseLocation: 'granted' });
  expect((await captureLocation(vi.fn())).approximate).toBe(true);
  expect(mocks.request).not.toHaveBeenCalled();
});
it('não repete pedido quando já negado', async () => {
  mocks.check.mockResolvedValue({ location: 'denied', coarseLocation: 'denied' });
  await expect(captureLocation(vi.fn())).rejects.toEqual({ code: 'OS-PLUG-GLOC-0003' });
  expect(mocks.request).not.toHaveBeenCalled();
  expect(mocks.get).not.toHaveBeenCalled();
});
it('trata negativa após pedido e timeout', async () => {
  mocks.check.mockResolvedValue({ location: 'prompt', coarseLocation: 'prompt' });
  mocks.request.mockResolvedValue({ location: 'denied', coarseLocation: 'denied' });
  await expect(captureLocation(vi.fn())).rejects.toBeTruthy();
  expect(locationError({ code: 'OS-PLUG-GLOC-0010' })).toContain('tempo');
  expect(locationError({ code: 'OS-PLUG-GLOC-0007' })).toContain('Ative');
  expect(locationError({ code: 1 })).toContain('Permissão');
});
it('na web não chama requestPermissions e solicita a posição pelo plugin', async () => {
  mocks.native.mockReturnValue(false);
  vi.stubGlobal('window', { isSecureContext: true });
  vi.stubGlobal('navigator', { geolocation: {} });
  mocks.check.mockResolvedValue({ location: 'prompt' });
  await captureLocation(vi.fn());
  expect(mocks.request).not.toHaveBeenCalled();
  expect(mocks.get).toHaveBeenCalled();
  vi.unstubAllGlobals();
});
