import {
  Plus,
  ArrowRight,
  ClipboardCheck,
  CalendarDays,
  CircleCheck,
  ShieldCheck,
  MapPin,
} from 'lucide-react';
import type { Inspection } from '../types/inspection';
import { sameDay } from '../utils/formatters';
import InspectionCard from '../components/InspectionCard';
export default function Dashboard({
  records,
  navigate,
  open,
}: {
  records: Inspection[];
  navigate: (page: 'new' | 'history') => void;
  open: (id: string) => void;
}) {
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">VISÃO GERAL</div>
          <h1>Um cuidado que começa na vistoria.</h1>
          <p>Bem-vindo ao seu espaço de fiscalização sanitária.</p>
        </div>
        <button className="btn primary" onClick={() => navigate('new')}>
          <Plus size={19} />
          Nova vistoria
        </button>
      </div>
      <section className="hero">
        <div>
          <span className="hero-label">
            <span /> EM CAMPO, COM CONFIANÇA
          </span>
          <h2>
            Mais segurança à mesa.
            <br />
            Mais precisão em cada registro.
          </h2>
          <p>
            Registre vistorias, comprove a localização e acompanhe
            <br className="hidden md:block" /> o histórico dos estabelecimentos em um só lugar.
          </p>
          <button className="hero-button" onClick={() => navigate('new')}>
            Registrar uma vistoria <ArrowRight size={17} />
          </button>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="art-cross x-one">+</div>
          <div className="art-cross x-two">+</div>
          <div className="art-shield">
            <ShieldCheck size={80} strokeWidth={1.2} />
          </div>
          <div className="art-pin">
            <MapPin size={21} />
            <span>Localização no registro</span>
            <i />
          </div>
        </div>
      </section>
      <section className="stats">
        {[
          {
            label: 'Total de vistorias',
            value: records.length,
            text: 'Registros neste dispositivo',
            icon: ClipboardCheck,
          },
          {
            label: 'Vistorias hoje',
            value: records.filter((r) => sameDay(r.date)).length,
            text: 'Fiscalizações na data de hoje',
            icon: CalendarDays,
          },
          {
            label: 'Vistorias conformes',
            value: records.filter((r) => r.result === 'Conforme').length,
            text: 'Vistorias com resultado conforme',
            icon: CircleCheck,
          },
        ].map((s) => (
          <article className="stat" key={s.label}>
            <div className="flex items-center justify-between">
              <span>{s.label}</span>
              <s.icon size={21} />
            </div>
            <strong>{s.value.toString().padStart(2, '0')}</strong>
            <small>{s.text}</small>
          </article>
        ))}
      </section>
      <div className="list-heading">
        <div>
          <h2>Vistorias recentes</h2>
          <p>Os últimos registros da sua fiscalização.</p>
        </div>
        <button className="text-button" onClick={() => navigate('history')}>
          Ver histórico <ArrowRight size={16} />
        </button>
      </div>
      {records.length ? (
        <div className="cards">
          {records.slice(0, 3).map((r) => (
            <InspectionCard key={r.id} record={r} onOpen={open} />
          ))}
        </div>
      ) : (
        <section className="empty">
          <div className="empty-icon">
            <ClipboardCheck size={32} />
          </div>
          <h3>Seu primeiro registro começa aqui</h3>
          <p>
            As vistorias cadastradas aparecerão neste espaço.
            <br />
            Inicie uma nova vistoria para registrar seu trabalho em campo.
          </p>
          <button className="btn secondary" onClick={() => navigate('new')}>
            <Plus size={17} /> Criar primeira vistoria
          </button>
        </section>
      )}
      <div className="local-note">
        <ShieldCheck size={18} />
        <p>
          <strong>Seus registros ficam neste dispositivo.</strong> Projeto acadêmico • Aluno 25 •
          Sem envio automático de dados.
        </p>
      </div>
    </>
  );
}
