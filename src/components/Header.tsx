import React, { useState } from 'react';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import SearchRounded from '@mui/icons-material/SearchRounded';
import CloseRounded from '@mui/icons-material/CloseRounded';
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined';
import AttachMoneyRounded from '@mui/icons-material/AttachMoneyRounded';
import RestartAltRounded from '@mui/icons-material/RestartAltRounded';
import ShareRounded from '@mui/icons-material/ShareRounded';
import type { ShoppingList, ListStats } from '../types/shopping';

interface HeaderProps {
  activeList?: ShoppingList;
  stats: ListStats;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onBack: () => void;
  onOpenQuickPaste: () => void;
  onOpenBudgetModal: () => void;
  onOpenSummaryModal: () => void;
  onOpenResetModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeList,
  stats,
  searchQuery,
  onSearchChange,
  onBack,
  onOpenQuickPaste,
  onOpenBudgetModal,
  onOpenSummaryModal,
  onOpenResetModal,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const formatCreationDate = (timestamp?: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return `Criada em ${date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    })}`;
  };

  const handleToggleSearch = () => {
    setIsSearchOpen((prev) => {
      const next = !prev;
      if (!next) {
        onSearchChange('');
      }
      return next;
    });
  };

  return (
    <header className="app-header">
      <div className="header-top">
        {/* Botão de Voltar para a Tela Inicial */}
        <button
          type="button"
          className="btn-icon btn-back-home"
          onClick={onBack}
          title="Voltar para Minhas listas"
          aria-label="Voltar para Minhas listas"
        >
          <ArrowBackRounded style={{ fontSize: 20 }} />
        </button>

        {/* Título da Lista e Data de Criação Imutável */}
        <div className="header-list-info" onClick={onBack} style={{ cursor: 'pointer' }}>
          <h1 className="header-active-title">{activeList?.name || 'Lista'}</h1>
          <span className="header-active-subtitle">
            {formatCreationDate(activeList?.createdAt)}
          </span>
        </div>

        {/* Ações Rápidas no Header */}
        <div className="header-actions">
          {/* Busca Discreta */}
          <button
            type="button"
            className={`btn-icon ${isSearchOpen ? 'active' : ''}`}
            onClick={handleToggleSearch}
            title={isSearchOpen ? 'Fechar busca' : 'Buscar produtos na lista'}
            aria-label="Buscar produtos"
          >
            <SearchRounded style={{ fontSize: 20 }} />
          </button>

          {/* Importar WhatsApp */}
          <button
            type="button"
            className="btn-icon"
            onClick={onOpenQuickPaste}
            title="Importar do WhatsApp"
            aria-label="Importar texto de compras do WhatsApp"
          >
            <DescriptionOutlined style={{ fontSize: 20 }} />
          </button>

          {/* Teto de Orçamento */}
          <button
            type="button"
            className="btn-icon"
            onClick={onOpenBudgetModal}
            title={stats.totalBudget ? `Orçamento: R$ ${stats.totalBudget}` : 'Definir Orçamento'}
            aria-label="Configurar teto de orçamento"
          >
            <AttachMoneyRounded style={{ fontSize: 20 }} />
          </button>

          {/* Resetar Lista */}
          <button
            type="button"
            className="btn-icon"
            onClick={onOpenResetModal}
            title="Resetar valores da lista"
            aria-label="Resetar valores da lista"
          >
            <RestartAltRounded style={{ fontSize: 20 }} />
          </button>

          {/* Resumo e Compartilhamento */}
          <button
            type="button"
            className="btn-icon"
            onClick={onOpenSummaryModal}
            title="Ver Resumo da Compra"
            aria-label="Resumo e Compartilhamento"
          >
            <ShareRounded style={{ fontSize: 19 }} />
          </button>
        </div>
      </div>

      {/* Barra de Busca Expansível Discreta */}
      {isSearchOpen && (
        <div className="header-search-bar-expanded">
          <div className="search-input-wrapper-inline">
            <SearchRounded style={{ fontSize: 18 }} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Buscar produto nesta lista..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              autoFocus
            />
            <button
              type="button"
              className="search-clear"
              onClick={() => {
                onSearchChange('');
                setIsSearchOpen(false);
              }}
              title="Fechar busca"
            >
              <CloseRounded style={{ fontSize: 18 }} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
