import React from 'react';
import { ArrowLeft, FileText, Share2, DollarSign } from 'lucide-react';
import type { ShoppingList, ListStats } from '../types/shopping';

interface HeaderProps {
  activeList?: ShoppingList;
  stats: ListStats;
  onBack: () => void;
  onOpenQuickPaste: () => void;
  onOpenBudgetModal: () => void;
  onOpenSummaryModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeList,
  stats,
  onBack,
  onOpenQuickPaste,
  onOpenBudgetModal,
  onOpenSummaryModal,
}) => {
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
          <ArrowLeft size={20} />
        </button>

        <div className="header-list-info" onClick={onBack} style={{ cursor: 'pointer' }}>
          <h1 className="header-active-title">{activeList?.name || 'Lista'}</h1>
          <span className="header-active-subtitle">
            {stats.checkedItemsCount}/{stats.totalItemsCount} produtos pegos
          </span>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="btn-icon"
            onClick={onOpenQuickPaste}
            title="Importar do WhatsApp"
            aria-label="Importar texto de compras do WhatsApp"
          >
            <FileText size={18} />
          </button>

          <button
            type="button"
            className="btn-icon"
            onClick={onOpenBudgetModal}
            title={stats.totalBudget ? `Orçamento: R$ ${stats.totalBudget}` : 'Definir Orçamento'}
            aria-label="Configurar teto de orçamento"
          >
            <DollarSign size={18} />
          </button>

          <button
            type="button"
            className="btn-icon"
            onClick={onOpenSummaryModal}
            title="Ver Resumo da Compra"
            aria-label="Resumo e Compartilhamento"
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};
