import React, { useState, useEffect } from 'react';
import { X, DollarSign, Trash2 } from 'lucide-react';
import { formatCurrency, parseCurrencyInput, formatShortCurrency } from '../utils/currency';

interface BudgetModalProps {
  isOpen: boolean;
  currentBudget: number | null;
  onSaveBudget: (budget: number | null) => void;
  onClose: () => void;
}

const PRESETS = [100, 200, 350, 500, 800, 1000];

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  currentBudget,
  onSaveBudget,
  onClose,
}) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (isOpen) {
      setInputValue(currentBudget !== null ? formatShortCurrency(currentBudget) : '');
    }
  }, [isOpen, currentBudget]);

  if (!isOpen) return null;

  const handleSave = () => {
    const parsed = parseCurrencyInput(inputValue);
    onSaveBudget(parsed > 0 ? parsed : null);
    onClose();
  };

  const handleRemove = () => {
    onSaveBudget(null);
    onClose();
  };

  const handlePreset = (val: number) => {
    setInputValue(formatShortCurrency(val));
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DollarSign size={20} />
            <h2 className="modal-title">Definir Orçamento da Compra</h2>
          </div>
          <button type="button" className="btn-icon" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Estipule um limite máximo de gastos. O Listei! irá monitorar o total do seu carrinho em tempo real e avisar se você estiver prestes a ultrapassar ou estourar o valor.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Valor Limite Desejado (R$)
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <span
                style={{
                  position: 'absolute',
                  left: '12px',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  pointerEvents: 'none',
                }}
              >
                R$
              </span>
              <input
                type="text"
                inputMode="decimal"
                className="input-main"
                style={{ paddingLeft: '42px', fontSize: '1.25rem', fontWeight: 700 }}
                placeholder="Ex: 500,00"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Valores Rápidos:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
              {PRESETS.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  className="filter-chip"
                  onClick={() => handlePreset(amount)}
                >
                  {formatCurrency(amount)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          {currentBudget !== null && (
            <button
              type="button"
              className="btn-danger"
              onClick={handleRemove}
              style={{ marginRight: 'auto' }}
              title="Remover orçamento"
            >
              <Trash2 size={16} style={{ marginRight: '4px' }} />
              Remover Limite
            </button>
          )}

          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>

          <button type="button" className="btn-primary" onClick={handleSave}>
            Salvar Orçamento
          </button>
        </div>
      </div>
    </div>
  );
};
