import { useEffect, useState } from 'react';
import {
  ShieldCheck,
  LayoutDashboard,
  ClipboardList,
  Plus,
  ChevronRight,
  HardDrive,
  X,
  CheckCircle2,
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import NewInspection from './pages/NewInspection';
import InspectionHistory from './pages/InspectionHistory';
import InspectionDetails from './pages/InspectionDetails';
import { deleteInspection, loadInspections } from './services/inspections';
import type { Inspection } from './types/inspection';
type Page = 'dashboard' | 'new' | 'history' | 'details';
export default function App() {
  const [records, setRecords] = useState<Inspection[]>([]);
  const [page, setPage] = useState<Page>('dashboard');
  const [selected, setSelected] = useState('');
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  useEffect(() => {
    function refresh() {
      try {
        setRecords(loadInspections());
        setError('');
      } catch (e) {
        setError((e as Error).message);
      }
    }
    refresh();
    window.addEventListener('storage', refresh);
    return () => window.removeEventListener('storage', refresh);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 6000);
    return () => clearTimeout(t);
  }, [toast]);
  function navigate(p: Page) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function open(id: string) {
    setSelected(id);
    navigate('details');
  }
  function saved(r: Inspection) {
    setRecords(loadInspections());
    setToast('Auto de vistoria salvo com sucesso.');
    open(r.id);
  }
  function remove(id: string) {
    try {
      deleteInspection(id);
      setRecords(loadInspections());
      navigate('history');
      setToast('Registro excluído.');
    } catch (e) {
      setError((e as Error).message);
    }
  }
  const current = records.find((r) => r.id === selected);
  const nav = [
    { id: 'dashboard' as Page, label: 'Visão geral', icon: LayoutDashboard },
    { id: 'new' as Page, label: 'Nova vistoria', icon: Plus },
    { id: 'history' as Page, label: 'Histórico de vistorias', icon: ClipboardList },
  ];
  return (
    <div className="app">
      <aside className="sidebar">
        <a
          className="brand"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate('dashboard');
          }}
        >
          <span className="brand-icon">
            <ShieldCheck size={27} />
          </span>
          <span>
            Vigilância<span> SANITÁRIA</span>
          </span>
        </a>
        <div className="workspace-label">GESTÃO DE VISTORIAS</div>
        <nav aria-label="Navegação principal">
          {nav.map((n) => (
            <button
              key={n.id}
              className={
                page === n.id || (page === 'details' && n.id === 'history') ? 'active' : ''
              }
              onClick={() => navigate(n.id)}
            >
              <n.icon size={20} />
              <span>{n.label}</span>
              {page === n.id && <ChevronRight size={16} className="ml-auto" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="storage-pill">
            <span />
            <HardDrive size={16} /> Armazenamento local
          </div>
          <div className="profile">
            <span>25</span>
            <div>
              <strong>Aluno 25</strong>
              <small>Projeto acadêmico</small>
            </div>
            <ShieldCheck size={18} />
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            Vigilância Sanitária <ChevronRight size={14} />
            <strong>
              {page === 'dashboard'
                ? 'Visão geral'
                : page === 'new'
                  ? 'Nova vistoria'
                  : page === 'details'
                    ? 'Detalhes do auto'
                    : 'Histórico'}
            </strong>
          </div>
          <span className="header-date">
            {new Intl.DateTimeFormat('pt-BR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            }).format(new Date())}
          </span>
          <div className="mobile-brand">
            <ShieldCheck size={22} /> Vigilância Sanitária
          </div>
        </header>
        <main>
          {error && (
            <div className="error" role="alert">
              {error}
            </div>
          )}
          {page === 'dashboard' && <Dashboard records={records} navigate={navigate} open={open} />}
          {page === 'new' && <NewInspection onSaved={saved} onBack={() => navigate('dashboard')} />}
          {page === 'history' && (
            <InspectionHistory records={records} open={open} create={() => navigate('new')} />
          )}
          {page === 'details' &&
            (current ? (
              <InspectionDetails
                key={current.id}
                record={current}
                back={() => navigate('history')}
                remove={remove}
              />
            ) : (
              <div className="empty">
                <h2>Registro não encontrado</h2>
                <button className="btn secondary" onClick={() => navigate('history')}>
                  Voltar ao histórico
                </button>
              </div>
            ))}
          <footer>
            Vigilância Sanitária <span>Saúde e segurança em cada vistoria.</span>
            <small>Demonstração acadêmica • Tema VigilanciaSanitaria</small>
          </footer>
        </main>
      </div>
      <nav className="mobile-nav" aria-label="Navegação mobile">
        {nav.map((n) => (
          <button
            key={n.id}
            className={page === n.id || (page === 'details' && n.id === 'history') ? 'active' : ''}
            onClick={() => navigate(n.id)}
          >
            <n.icon size={21} />
            <span>{n.id === 'history' ? 'Histórico' : n.label}</span>
          </button>
        ))}
      </nav>
      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={20} />
          {toast}
          <button aria-label="Fechar confirmação" onClick={() => setToast('')}>
            <X size={17} />
          </button>
        </div>
      )}
    </div>
  );
}
