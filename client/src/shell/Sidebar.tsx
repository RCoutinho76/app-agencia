import type { ComponentType, ReactNode } from 'react';
import { CompassIcon } from '../components/icons';
import { BoxIcon, ChartIcon, RouteIcon, UsersIcon, WalletIcon } from './icons';
import type { Perfil, ViewId } from './types';

interface SidebarProps {
  view: ViewId;
  perfil: Perfil;
  onSelect: (view: ViewId) => void;
  onPerfil: (perfil: Perfil) => void;
}

interface NavItem {
  id: ViewId;
  label: string;
  icon: ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}

const itens: NavItem[] = [
  { id: 'crm', label: 'CRM Clientes', icon: UsersIcon },
  { id: 'produtos', label: 'Produtos', icon: BoxIcon },
  { id: 'roteiros', label: 'Roteiros & Propostas', icon: RouteIcon },
  { id: 'financeiro', label: 'Módulo Financeiro', icon: WalletIcon },
  { id: 'dashboard', label: 'Dashboard de Gestão', icon: ChartIcon, adminOnly: true },
];

export default function Sidebar({ view, perfil, onSelect, onPerfil }: SidebarProps) {
  const visiveis = itens.filter((item) => !item.adminOnly || perfil === 'admin');

  const nav: ReactNode = visiveis.map((item) => {
    const Icone = item.icon;
    const ativo = item.id === view;

    return (
      <button
        key={item.id}
        type="button"
        className={`sh-nav__item${ativo ? ' is-active' : ''}`}
        aria-current={ativo ? 'page' : undefined}
        title={item.label}
        onClick={() => onSelect(item.id)}
      >
        <span className="sh-nav__icon">
          <Icone />
        </span>
        <span className="sh-nav__label">{item.label}</span>
        {item.adminOnly ? <span className="sh-nav__tag">admin</span> : null}
      </button>
    );
  });

  return (
    <aside className="sh-sidebar">
      <div className="sh-brand">
        <span className="sh-brand__mark">
          <CompassIcon />
        </span>
        <span className="sh-brand__text">
          <strong>Por Aí</strong>
          <span>Turismo · Gestão</span>
        </span>
      </div>

      <p className="sh-nav__label-top">Operação</p>

      <nav className="sh-nav" aria-label="Navegação principal">
        {nav}
      </nav>

      <div className="sh-sidebar__foot">
        <div className="sh-profile">
          <span className="sh-avatar sh-avatar--rose">CR</span>
          <span className="sh-profile__text">
            <strong>Carla &amp; Renato</strong>
            <span>{perfil === 'admin' ? 'Administração' : 'Equipe de vendas'}</span>
          </span>
        </div>

        <div className="sh-role" role="group" aria-label="Perfil de acesso">
          <button
            type="button"
            className={perfil === 'admin' ? 'is-active' : ''}
            aria-pressed={perfil === 'admin'}
            onClick={() => onPerfil('admin')}
          >
            Admin
          </button>
          <button
            type="button"
            className={perfil === 'equipe' ? 'is-active' : ''}
            aria-pressed={perfil === 'equipe'}
            onClick={() => onPerfil('equipe')}
          >
            Equipe
          </button>
        </div>
      </div>
    </aside>
  );
}
