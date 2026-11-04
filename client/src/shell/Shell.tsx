import { useState } from 'react';
import Sidebar from './Sidebar';
import CrmPanel from './panels/CrmPanel';
import ProdutosPanel from './panels/ProdutosPanel';
import RoteirosPanel from './panels/RoteirosPanel';
import FinanceiroPanel from './panels/FinanceiroPanel';
import DashboardPanel from './panels/DashboardPanel';
import { dataHoje } from './format';
import { ShieldIcon } from './icons';
import type { Perfil, ViewId } from './types';
import './shell.css';

const paginas: Record<ViewId, string> = {
  crm: 'CRM Clientes',
  produtos: 'Produtos',
  roteiros: 'Roteiros & Propostas',
  financeiro: 'Módulo Financeiro',
  dashboard: 'Dashboard de Gestão',
};

export default function Shell() {
  const [view, setView] = useState<ViewId>('dashboard');
  const [perfil, setPerfil] = useState<Perfil>('admin');

  function trocarPerfil(proximo: Perfil) {
    setPerfil(proximo);
    if (proximo === 'equipe' && view === 'dashboard') {
      setView('crm');
    }
  }

  return (
    <div className="sh-app">
      <Sidebar view={view} perfil={perfil} onSelect={setView} onPerfil={trocarPerfil} />

      <div className="sh-main">
        <header className="sh-topbar">
          <p className="sh-crumbs">
            <span>Por Aí Turismo</span>
            <span className="sh-crumbs__sep">/</span>
            <strong>{paginas[view]}</strong>
          </p>

          <div className="sh-topbar__meta">
            <span className="sh-date">{dataHoje()}</span>
            <span className={`sh-pill${perfil === 'admin' ? ' sh-pill--admin' : ''}`}>
              <ShieldIcon className="sh-pill__icon" />
              {perfil === 'admin' ? 'Admin' : 'Equipe'}
            </span>
          </div>
        </header>

        <div className="sh-content">
          {view === 'crm' ? <CrmPanel /> : null}
          {view === 'produtos' ? <ProdutosPanel /> : null}
          {view === 'roteiros' ? <RoteirosPanel /> : null}
          {view === 'financeiro' ? <FinanceiroPanel /> : null}
          {view === 'dashboard' && perfil === 'admin' ? <DashboardPanel /> : null}
        </div>
      </div>
    </div>
  );
}
