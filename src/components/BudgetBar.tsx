import React from 'react';
import ErrorOutlineRounded from '@mui/icons-material/ErrorOutlineRounded';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded';
import EditRounded from '@mui/icons-material/EditRounded';
import type { ListStats } from '../types/shopping';
import { formatCurrency } from '../utils/currency';

interface BudgetBarProps {
  stats: ListStats;
  onOpenBudgetModal: () => void;
  onOpenSummaryModal: () => void;
}

export const BudgetBar: React.FC<BudgetBarProps> = ({
  stats,
  onOpenBudgetModal,
  onOpenSummaryModal,
}) => {
  const {
    totalBudget,
    totalSpent,
    remainingBudget,
    isOverBudget,
    budgetPercentage,
    checkedItemsCount,
    totalItemsCount,
  } = stats;

  const progressClass = isOverBudget
    ? 'danger'
    : budgetPercentage > 85
    ? 'warning'
    : '';

  return (
    <aside className="budget-bar-sticky">
      <div className="budget-bar-inner">
        {/* Linha de Totais e Orçamento */}
        <div className="budget-row-stats">
          <div className="spent-block">
            <span className="spent-label">Total no Carrinho</span>
            <span className="spent-amount">{formatCurrency(totalSpent)}</span>
          </div>

          <div className="budget-limit-block">
            {totalBudget !== null ? (
              <>
                <button
                  type="button"
                  className="budget-limit-btn"
                  onClick={onOpenBudgetModal}
                  title="Alterar valor de orçamento"
                >
                  <span>Teto: {formatCurrency(totalBudget)}</span>
                  <EditRounded style={{ fontSize: 14 }} />
                </button>
                <div
                  className={`budget-remaining-text ${
                    isOverBudget ? 'danger' : 'positive'
                  }`}
                >
                  {isOverBudget ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <ErrorOutlineRounded style={{ fontSize: 16 }} />
                      Estourou {formatCurrency(Math.abs(remainingBudget || 0))}
                    </span>
                  ) : (
                    <span>
                      Resta {formatCurrency(remainingBudget || 0)}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <button
                type="button"
                className="budget-limit-btn"
                onClick={onOpenBudgetModal}
                style={{ padding: '6px 10px', background: 'var(--bg-surface-subtle)', borderRadius: '6px' }}
              >
                <span>+ Definir Orçamento</span>
              </button>
            )}
          </div>
        </div>

        {/* Barra de Progresso se houver orçamento definido */}
        {totalBudget !== null && (
          <div className="budget-progress-track">
            <div
              className={`budget-progress-fill ${progressClass}`}
              style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
            />
          </div>
        )}

        {/* Linha Inferior com Contador de Itens e Botão Finalizar */}
        <div className="budget-bar-quick-actions">
          <span className="cart-items-counter">
            {checkedItemsCount === totalItemsCount && totalItemsCount > 0 ? (
              <span style={{ color: 'var(--accent-success)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircleRounded style={{ fontSize: 16 }} /> Todos pegos ({checkedItemsCount})
              </span>
            ) : (
              <span>
                {checkedItemsCount} de {totalItemsCount} produtos no carrinho
              </span>
            )}
          </span>

          <button
            type="button"
            className="finish-shopping-btn"
            onClick={onOpenSummaryModal}
            title="Abrir resumo da compra"
          >
            <span>Ver Resumo</span>
            <ChevronRightRounded style={{ fontSize: 18 }} />
          </button>
        </div>
      </div>
    </aside>
  );
};
