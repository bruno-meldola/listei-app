import React, { useState, useRef } from 'react';
import AddRounded from '@mui/icons-material/AddRounded';
import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded';
import AddCircleOutlineRounded from '@mui/icons-material/AddCircleOutlineRounded';
import type { ItemUnit } from '../types/shopping';

interface AddItemFormProps {
  onAddItem: (name: string, quantity: number, unit: ItemUnit | string, price: number) => void;
}

const COMMON_UNITS: { label: string; value: ItemUnit }[] = [
  { label: 'un (unidade)', value: 'un' },
  { label: 'kg (quilos)', value: 'kg' },
  { label: 'pct (pacote)', value: 'pct' },
  { label: 'L (litros)', value: 'L' },
  { label: 'g (gramas)', value: 'g' },
  { label: 'ml (mililitros)', value: 'ml' },
  { label: 'cx (caixa)', value: 'cx' },
  { label: 'dz (dúzia)', value: 'dz' },
];

const STORAGE_ACCORDION_KEY = 'listei_add_form_expanded_v1';

export const AddItemForm: React.FC<AddItemFormProps> = ({ onAddItem }) => {
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ACCORDION_KEY);
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState<ItemUnit>('un');
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleAccordion = () => {
    setIsOpen((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_ACCORDION_KEY, String(next));
      } catch (e) {
        console.error('Erro ao salvar estado do accordion:', e);
      }
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedQty = parseFloat(quantity.replace(',', '.')) || 1;
    onAddItem(name.trim(), parsedQty > 0 ? parsedQty : 1, unit, 0);

    setName('');
    setQuantity('1');
    setUnit('un');
    inputRef.current?.focus();
  };

  return (
    <div className={`add-item-card ${isOpen ? 'is-open' : 'is-collapsed'}`}>
      {/* Cabeçalho do Accordion (Clicável para expandir/recolher) */}
      <button
        type="button"
        className="add-item-accordion-header"
        onClick={toggleAccordion}
        aria-expanded={isOpen}
        title={isOpen ? 'Recolher área de adicionar' : 'Expandir área de adicionar'}
      >
        <div className="add-item-header-title">
          <AddCircleOutlineRounded className="add-item-icon" style={{ fontSize: 20 }} />
          <span>Adicionar item</span>
        </div>
        <div className="add-item-header-toggle">
          <span className="add-item-toggle-hint">
            {isOpen ? 'Ocultar' : 'Expandir'}
          </span>
          <ExpandMoreRounded
            style={{ fontSize: 20 }}
            className={`accordion-chevron ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {/* Conteúdo Expansível do Formulário */}
      {isOpen && (
        <form className="add-item-form-body" onSubmit={handleSubmit}>
          {/* Linha Principal: Input de Nome do Produto + Botão Adicionar */}
          <div className="add-item-primary-row">
            <input
              ref={inputRef}
              type="text"
              className="input-main"
              placeholder="O que você precisa comprar?"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="off"
            />

            <button
              type="submit"
              className="btn-primary btn-add-submit"
              title="Adicionar item à lista"
            >
              <AddRounded style={{ fontSize: 20 }} />
              <span className="btn-add-text">Adicionar</span>
            </button>
          </div>

          {/* Linha Secundária: Quantidade e Unidade de Medida */}
          <div className="add-item-secondary-row">
            <div className="qty-unit-pill">
              <span className="qty-pill-label">Qtd:</span>
              <input
                type="text"
                inputMode="decimal"
                className="input-qty-compact"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="1"
                title="Quantidade ou peso inicial"
              />
              <select
                className="select-unit-compact"
                value={unit}
                onChange={(e) => setUnit(e.target.value as ItemUnit)}
                title="Unidade de medida"
              >
                {COMMON_UNITS.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>

            <span className="quick-tip-text">
              Pressione <kbd>Enter</kbd> para adicionar
            </span>
          </div>
        </form>
      )}
    </div>
  );
};
