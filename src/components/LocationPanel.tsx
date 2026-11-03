import { Crosshair, LoaderCircle, MapPin, ExternalLink, CheckCircle2 } from 'lucide-react';
import { useRef, useState } from 'react';
import type { GeoPoint } from '../types/inspection';
import { captureLocation, locationError } from '../services/geolocation';
import { openMaps } from '../utils/maps';
import { formatDate } from '../utils/formatters';
export function Coordinates({ point }: { point: GeoPoint }) {
  return (
    <>
      <div className="coordinates">
        <div>
          <small>LATITUDE</small>
          <strong>{point.latitude.toFixed(6)}</strong>
        </div>
        <div>
          <small>LONGITUDE</small>
          <strong>{point.longitude.toFixed(6)}</strong>
        </div>
        <div>
          <small>PRECISÃO</small>
          <strong>
            {point.accuracy.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} <span>m</span>
          </strong>
        </div>
      </div>
      <p className="text-sm text-slate-500">Capturada em {formatDate(point.timestamp)}</p>
      {(point.approximate || point.accuracy > 100) && (
        <p className="notice">
          Precisão limitada{point.approximate ? ' pela permissão aproximada' : ''}. Se necessário,
          habilite a localização precisa e capture novamente.
        </p>
      )}
    </>
  );
}
export default function LocationPanel({
  point,
  onChange,
  onBusy,
}: {
  point: GeoPoint | null;
  onChange: (p: GeoPoint | null) => void;
  onBusy: (busy: boolean) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('Permissão ainda não solicitada');
  const [error, setError] = useState('');
  const lock = useRef(false);
  async function capture() {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    onBusy(true);
    onChange(null);
    setError('');
    try {
      const p = await captureLocation(setStatus);
      onChange(p);
      setStatus(
        p.approximate
          ? 'Localização capturada • permissão aproximada'
          : 'Localização capturada com sucesso.',
      );
    } catch (e) {
      setError(locationError(e));
      setStatus('Captura não concluída');
    } finally {
      lock.current = false;
      setBusy(false);
      onBusy(false);
    }
  }
  return (
    <section className="panel gps-panel">
      <div className="section-heading">
        <div className="icon-box">
          <Crosshair size={22} />
        </div>
        <div>
          <h2>Localização da vistoria</h2>
          <p>Registre o ponto onde a fiscalização acontece.</p>
        </div>
        <span className="required-label">OBRIGATÓRIO</span>
      </div>
      {point ? (
        <div className="gps-result">
          <Coordinates point={point} />
          <button
            type="button"
            className="map-link"
            onClick={() => void openMaps(point).catch((e) => setError(e.message))}
          >
            <ExternalLink size={16} /> Abrir localização no Google Maps
          </button>
        </div>
      ) : (
        <div className="gps-empty">
          <div className={'gps-target ' + (busy ? 'pulse' : '')}>
            <MapPin size={30} />
          </div>
          <h3>{busy ? 'Buscando sua localização…' : 'Pronto para registrar o ponto'}</h3>
          <p>
            A captura acontece somente ao tocar no botão.
            <br />
            Mantenha a localização do dispositivo ativada.
          </p>
        </div>
      )}
      <div className="gps-actions">
        <button
          type="button"
          className="btn primary"
          disabled={busy}
          onClick={() => void capture()}
        >
          {busy ? <LoaderCircle className="spin" size={18} /> : <Crosshair size={18} />}{' '}
          {busy ? 'Capturando…' : point ? 'Atualizar localização' : 'Capturar localização GPS'}
        </button>
        <span role="status">
          {point ? <CheckCircle2 size={15} /> : <span className="status-dot" />}
          {status}
        </span>
      </div>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <p className="gps-footnote">
        A localização é fornecida pelo dispositivo e pode combinar GPS, Wi-Fi e rede móvel. Nenhum
        rastreamento contínuo.
      </p>
    </section>
  );
}
