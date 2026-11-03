import { useState, type FormEvent } from 'react';
import { Building2, ClipboardCheck, Save, ArrowLeft } from 'lucide-react';
import LocationPanel from '../components/LocationPanel';
import { results, type GeoPoint, type Inspection, type Result } from '../types/inspection';
import { saveInspection } from '../services/inspections';
import { localInputDate } from '../utils/formatters';
export default function NewInspection({
  onSaved,
  onBack,
}: {
  onSaved: (record: Inspection) => void;
  onBack: () => void;
}) {
  const [point, setPoint] = useState<GeoPoint | null>(null);
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<Result>('Pendente de avaliação');
  const [error, setError] = useState('');
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!point || busy || saving) return;
    setSaving(true);
    setError('');
    const data = new FormData(e.currentTarget);
    try {
      const r = saveInspection({
        restaurant: String(data.get('restaurant')),
        inspector: String(data.get('inspector')),
        address: String(data.get('address')),
        notes: String(data.get('notes')),
        date: new Date(String(data.get('date'))).toISOString(),
        result,
        location: point,
      });
      onSaved(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Não foi possível salvar.');
      setSaving(false);
    }
  }
  return (
    <>
      <button className="back-button" onClick={onBack}>
        <ArrowLeft size={17} /> Voltar ao início
      </button>
      <div className="page-heading">
        <div>
          <div className="eyebrow">REGISTRO EM CAMPO</div>
          <h1>Nova vistoria sanitária</h1>
          <p>Preencha o auto e registre a localização do estabelecimento.</p>
        </div>
        <span className="step-label">AUTO DE VISTORIA</span>
      </div>
      <form onSubmit={submit}>
        <div className="form-layout">
          <div className="space-y-6">
            <section className="panel">
              <div className="section-heading">
                <div className="icon-box">
                  <Building2 size={22} />
                </div>
                <div>
                  <h2>Dados do estabelecimento</h2>
                  <p>Identifique o restaurante e o fiscal responsável.</p>
                </div>
              </div>
              <div className="form-grid">
                <label className="full">
                  Nome do restaurante <span>*</span>
                  <input
                    name="restaurant"
                    required
                    maxLength={150}
                    placeholder="Ex.: Restaurante Sabor da Terra"
                    autoComplete="organization"
                  />
                </label>
                <label>
                  Fiscal responsável <span>*</span>
                  <input
                    name="inspector"
                    required
                    maxLength={150}
                    placeholder="Nome completo"
                    autoComplete="name"
                  />
                </label>
                <label>
                  Data e horário <span>*</span>
                  <input
                    name="date"
                    type="datetime-local"
                    required
                    defaultValue={localInputDate()}
                  />
                </label>
                <label className="full">
                  Endereço informado <small>Opcional</small>
                  <input
                    name="address"
                    maxLength={300}
                    placeholder="Rua, número, bairro e cidade"
                    autoComplete="street-address"
                  />
                </label>
              </div>
            </section>
            <section className="panel">
              <div className="section-heading">
                <div className="icon-box">
                  <ClipboardCheck size={22} />
                </div>
                <div>
                  <h2>Resultado da fiscalização</h2>
                  <p>Informe a situação encontrada nesta vistoria.</p>
                </div>
              </div>
              <fieldset>
                <legend className="sr-only">Resultado da vistoria</legend>
                <div className="result-options">
                  {results.map((r) => (
                    <label key={r} className={result === r ? 'selected' : ''}>
                      <input
                        type="radio"
                        name="result"
                        checked={result === r}
                        onChange={() => setResult(r)}
                      />
                      {r}
                    </label>
                  ))}
                </div>
              </fieldset>
              <label className="mt-6 block">
                Observações <small>Opcional</small>
                <textarea
                  name="notes"
                  rows={5}
                  maxLength={4000}
                  placeholder="Descreva as condições observadas, irregularidades e orientações…"
                />
              </label>
            </section>
          </div>
          <div>
            <LocationPanel point={point} onChange={setPoint} onBusy={setBusy} />
            <aside className="help-box">
              <h3>Um registro completo e preciso</h3>
              <p>
                Confira os dados antes de salvar. A localização capturada fica vinculada ao auto e
                não pode ser editada depois.
              </p>
              <p>
                Campos com <span>*</span> são obrigatórios.
              </p>
            </aside>
          </div>
        </div>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <div className="form-footer">
          <p>
            {point
              ? 'Localização registrada. Confira os dados e salve o auto.'
              : 'Capture a localização para habilitar o salvamento.'}
          </p>
          <button className="btn primary" type="submit" disabled={!point || busy || saving}>
            <Save size={18} />
            {saving ? 'Salvando…' : 'Salvar auto de vistoria'}
          </button>
        </div>
      </form>
    </>
  );
}
