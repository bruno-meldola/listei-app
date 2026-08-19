import React from 'react';
import {
  X,
  ShoppingBag,
  Sun,
  Moon,
  Smartphone,
  Info,
  CheckCircle2,
} from 'lucide-react';
import type { ThemeMode } from '../hooks/useTheme';

interface NavigationDrawerProps {
  isOpen: boolean;
  totalListsCount: number;
  totalItemsCount: number;
  currentTheme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  onSetTheme: (mode: ThemeMode) => void;
  onToggleTheme: () => void;
  onClose: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  totalListsCount,
  totalItemsCount,
  currentTheme,
  resolvedTheme,
  onSetTheme,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside
        className="drawer-content"
        onClick={(e) => e.stopPropagation()}
        aria-label="Menu Principal"
      >
        {/* Cabeçalho do Menu com Logo */}
        <div className="drawer-header">
          <div className="drawer-brand">
            <div className="drawer-logo-icon">
              <ShoppingBag size={24} strokeWidth={2.5} />
            </div>
            <div className="drawer-brand-text">
              <span className="drawer-app-name">Listei!</span>
              <span className="drawer-app-tagline">Compras & Economia</span>
            </div>
          </div>

          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            aria-label="Fechar menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Corpo do Menu */}
        <div className="drawer-body">
          {/* Seção de Tema (Light / Dark Mode) */}
          <div className="drawer-section">
            <span className="drawer-section-title">Aparência & Tema</span>

            <div className="theme-toggle-group">
              <button
                type="button"
                className={`theme-option-btn ${currentTheme === 'light' ? 'active' : ''}`}
                onClick={() => onSetTheme('light')}
                title="Modo Claro"
              >
                <Sun size={18} />
                <span>Claro</span>
              </button>

              <button
                type="button"
                className={`theme-option-btn ${currentTheme === 'dark' ? 'active' : ''}`}
                onClick={() => onSetTheme('dark')}
                title="Modo Escuro"
              >
                <Moon size={18} />
                <span>Escuro</span>
              </button>

              <button
                type="button"
                className={`theme-option-btn ${currentTheme === 'system' ? 'active' : ''}`}
                onClick={() => onSetTheme('system')}
                title="Seguir o tema padrão do sistema"
              >
                <Smartphone size={18} />
                <span>Sistema</span>
              </button>
            </div>

            <div className="theme-status-hint">
              Tema ativo: <strong>{resolvedTheme === 'dark' ? 'Modo Escuro 🌙' : 'Modo Claro ☀️'}</strong>
            </div>
          </div>

          {/* Seção de Estatísticas Rápidas */}
          <div className="drawer-section">
            <span className="drawer-section-title">Resumo do App</span>
            <div className="drawer-stats-card">
              <div className="drawer-stat-item">
                <span className="drawer-stat-num">{totalListsCount}</span>
                <span className="drawer-stat-label">
                  {totalListsCount === 1 ? 'Lista Criada' : 'Listas Criadas'}
                </span>
              </div>
              <div className="drawer-stat-divider" />
              <div className="drawer-stat-item">
                <span className="drawer-stat-num">{totalItemsCount}</span>
                <span className="drawer-stat-label">
                  {totalItemsCount === 1 ? 'Produto Cadastrado' : 'Produtos Cadastrados'}
                </span>
              </div>
            </div>
          </div>

          {/* Informações do App */}
          <div className="drawer-section">
            <span className="drawer-section-title">Sobre</span>
            <div className="drawer-info-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--accent-success)' }} />
                <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>100% Offline & Seguro</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                Seus dados ficam salvos apenas no seu aparelho. Sem necessidade de internet no mercado.
              </p>
            </div>
          </div>
        </div>

        {/* Rodapé do Menu */}
        <div className="drawer-footer">
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Info size={13} />
            <span>Listei! v1.0 • PWA Ready</span>
          </span>
        </div>
      </aside>
    </div>
  );
};
