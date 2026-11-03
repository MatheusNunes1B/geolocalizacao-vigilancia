import { useState } from 'react';
import { ArrowLeft, MapPin, Share2, Download, Trash2, ExternalLink } from 'lucide-react';
import type { Inspection } from '../types/inspection';
import { Status } from '../components/InspectionCard';
import { Coordinates } from '../components/LocationPanel';
import { formatDate } from '../utils/formatters';
import { openMaps } from '../utils/maps';
import { exportInspection, shareInspection } from '../utils/share';
import { Capacitor } from '@capacitor/core';
export default function InspectionDetails({
  record: r,
  back,
  remove,
}: {
  record: Inspection;
  back: () => void;
  remove: (id: string) => void;
}) {
  const [message, setMessage] = useState('');
  const [confirm, setConfirm] = useState(false);
  async function share() {
    try {
      setMessage(await shareInspection(r));
    } catch (e) {
      if ((e as Error)?.name !== 'AbortError')
        setMessage(
          'Não foi possível compartilhar. Verifique as permissões ou tente exportar no navegador.',
        );
    }
  }
  return (
    <>
      <button className="back-button" onClick={back}>
        <ArrowLeft size={17} /> Voltar ao histórico
      </button>
      <div className="page-heading">
        <div>
          <div className="eyebrow">AUTO DE VISTORIA</div>
          <h1>{r.restaurant}</h1>
          <p>Registrado em {formatDate(r.date)}</p>
        </div>
        <Status result={r.result} />
      </div>
      <div className="form-layout">
        <section className="panel details">
          <h2>Informações da fiscalização</h2>
          <dl>
            <div>
              <dt>Restaurante</dt>
              <dd>{r.restaurant}</dd>
            </div>
            <div>
              <dt>Fiscal responsável</dt>
              <dd>{r.inspector}</dd>
            </div>
            <div>
              <dt>Data e horário</dt>
              <dd>{formatDate(r.date)}</dd>
            </div>
            <div>
              <dt>Endereço informado</dt>
              <dd>{r.address || 'Não informado'}</dd>
            </div>
            <div className="full">
              <dt>Observações</dt>
              <dd className="whitespace-pre-wrap">{r.notes || 'Nenhuma observação informada.'}</dd>
            </div>
            <div className="full">
              <dt>Identificador do auto</dt>
              <dd className="record-id">{r.id}</dd>
            </div>
          </dl>
        </section>
        <section className="panel">
          <div className="section-heading">
            <div className="icon-box">
              <MapPin size={22} />
            </div>
            <div>
              <h2>Localização registrada</h2>
              <p>Ponto vinculado a este auto.</p>
            </div>
          </div>
          <Coordinates point={r.location} />
          <button
            className="map-link mt-5"
            onClick={() => void openMaps(r.location).catch((e) => setMessage(e.message))}
          >
            <ExternalLink size={17} /> Abrir localização no Google Maps
          </button>
        </section>
      </div>
      <div className="detail-actions">
        <button className="btn secondary" onClick={() => void share()}>
          <Share2 size={17} /> Compartilhar auto
        </button>
        {!Capacitor.isNativePlatform() && (
          <button
            className="btn secondary"
            onClick={() => {
              exportInspection(r);
              setMessage('Exportação do arquivo de texto iniciada.');
            }}
          >
            <Download size={17} /> Exportar .txt
          </button>
        )}
        <button className="btn danger ml-auto" onClick={() => setConfirm(true)}>
          <Trash2 size={17} />
          Excluir registro
        </button>
      </div>
      {message && (
        <p className="notice" role="status">
          {message}
        </p>
      )}
      {confirm && (
        <div className="modal-backdrop">
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            className="modal"
          >
            <div className="empty-icon text-red-600">
              <Trash2 size={27} />
            </div>
            <h2 id="delete-title">Excluir esta vistoria?</h2>
            <p>
              O auto de {r.restaurant} será removido deste dispositivo. Esta ação não pode ser
              desfeita.
            </p>
            <div className="flex gap-3 justify-end mt-6">
              <button autoFocus className="btn secondary" onClick={() => setConfirm(false)}>
                Cancelar
              </button>
              <button
                className="btn danger"
                onClick={() => {
                  setConfirm(false);
                  remove(r.id);
                }}
              >
                Excluir vistoria
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
