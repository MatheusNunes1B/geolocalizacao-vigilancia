import { useState } from 'react';
import { Search, Plus, ClipboardList } from 'lucide-react';
import type { Inspection } from '../types/inspection';
import InspectionCard from '../components/InspectionCard';
export default function InspectionHistory({
  records,
  open,
  create,
}: {
  records: Inspection[];
  open: (id: string) => void;
  create: () => void;
}) {
  const [query, setQuery] = useState('');
  const filtered = records.filter((r) =>
    r.restaurant.toLocaleLowerCase('pt-BR').includes(query.toLocaleLowerCase('pt-BR')),
  );
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">SEUS REGISTROS</div>
          <h1>Histórico de vistorias</h1>
          <p>Consulte os autos registrados neste dispositivo.</p>
        </div>
        <button className="btn primary" onClick={create}>
          <Plus size={18} />
          Nova vistoria
        </button>
      </div>
      <section className="history-toolbar">
        <label className="search">
          <Search size={19} />
          <input
            aria-label="Pesquisar estabelecimento"
            placeholder="Pesquisar pelo nome do estabelecimento"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <span>
          {filtered.length}{' '}
          {filtered.length === 1 ? 'vistoria encontrada' : 'vistorias encontradas'}
        </span>
      </section>
      {filtered.length ? (
        <div className="cards">
          {filtered.map((r) => (
            <InspectionCard key={r.id} record={r} onOpen={open} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <div className="empty-icon">
            <ClipboardList size={32} />
          </div>
          <h3>{query ? 'Nenhum estabelecimento encontrado' : 'Nenhuma vistoria registrada'}</h3>
          <p>
            {query
              ? 'Tente pesquisar por outro nome.'
              : 'Crie uma vistoria e capture a localização para iniciar seu histórico.'}
          </p>
          {!query && (
            <button className="btn secondary" onClick={create}>
              Criar primeira vistoria
            </button>
          )}
        </div>
      )}
    </>
  );
}
