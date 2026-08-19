import React, { useState, useRef } from 'react';
import { Plus } from 'lucide-react';
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

export const AddItemForm: React.FC<AddItemFormProps> = ({ onAddItem }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState<ItemUnit>('un');
  const inputRef = useRef<HTMLInputElement>(null);

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
    <form className="add-item-card" onSubmit={handleSubmit}>
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

        <button type="submit" className="btn-primary btn-add-submit" title="Adicionar item à lista">
          <Plus size={18} strokeWidth={2.5} />
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
            title="Quantidade desejada"
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
  );
};
