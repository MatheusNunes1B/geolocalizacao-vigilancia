import { ArrowUpRight, MapPin, UserRound, CalendarDays } from 'lucide-react';
import type { Inspection } from '../types/inspection';
import { formatDate } from '../utils/formatters';
export function Status({ result }: { result: Inspection['result'] }) {
  return (
    <span
      className={
        'badge ' +
        (result === 'Conforme' ? 'good' : result === 'Com irregularidades' ? 'bad' : 'pending')
      }
    >
      <i />
      {result}
    </span>
  );
}
export default function InspectionCard({
  record,
  onOpen,
}: {
  record: Inspection;
  onOpen: (id: string) => void;
}) {
  return (
    <article className="inspection-card">
      <div className="flex items-start justify-between gap-3">
        <div className="restaurant-icon">
          <MapPin size={22} />
        </div>
        <Status result={record.result} />
      </div>
      <h3>{record.restaurant}</h3>
      <p>
        <UserRound size={15} />
        {record.inspector}
      </p>
      <p>
        <CalendarDays size={15} />
        {formatDate(record.date)}
      </p>
      <div className="card-bottom">
        <span>
          <MapPin size={14} /> Localização registrada
        </span>
        <button
          aria-label={'Ver detalhes de ' + record.restaurant}
          onClick={() => onOpen(record.id)}
        >
          Ver detalhes <ArrowUpRight size={16} />
        </button>
      </div>
    </article>
  );
}
