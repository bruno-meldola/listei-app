import React, { useState } from 'react';
import CloseRounded from '@mui/icons-material/CloseRounded';
import AddRounded from '@mui/icons-material/AddRounded';
import AttachMoneyRounded from '@mui/icons-material/AttachMoneyRounded';

interface CreateListModalProps {
  isOpen: boolean;
  onCreateList: (name: string, budget: number | null) => void;
  onClose: () => void;
}

export const CreateListModal: React.FC<CreateListModalProps> = ({
  isOpen,
  onCreateList,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [budget, setBudget] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedBudget = parseFloat(budget.replace(',', '.')) || null;
    onCreateList(name.trim(), parsedBudget);
    setName('');
    setBudget('');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AddRounded style={{ fontSize: 22 }} />
            <h2 className="modal-title">Criar Nova Lista</h2>
          </div>
          <button type="button" className="btn-icon" onClick={onClose} aria-label="Fechar">
            <CloseRounded style={{ fontSize: 20 }} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Nome da Lista *</label>
              <input
                type="text"
                className="input-main"
                placeholder="Ex: Supermercado Mensal, Feira, Churrasco..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Teto de Orçamento (R$, opcional)</label>
              <div className="price-input-wrapper" style={{ width: '100%', maxWidth: '100%' }}>
                <span className="price-currency-label" style={{ display: 'flex', alignItems: 'center' }}>
                  <AttachMoneyRounded style={{ fontSize: 18 }} />
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  className="price-input-field"
                  placeholder="Ex: 500,00"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                O app avisará caso você ultrapasse esse valor durante as compras.
              </span>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={!name.trim()}>
              <AddRounded style={{ fontSize: 18 }} />
              <span>Criar Lista</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
