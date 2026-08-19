import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import type { ShoppingItem, ItemUnit } from '../types/shopping';
import { formatShortCurrency, parseCurrencyInput } from '../utils/currency';

interface EditItemModalProps {
  item: ShoppingItem | null;
  isOpen: boolean;
  onSave: (id: string, updates: Partial<ShoppingItem>) => void;
  onClose: () => void;
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

export const EditItemModal: React.FC<EditItemModalProps> = ({
  item,
  isOpen,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState<ItemUnit>('un');
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (item && isOpen) {
      setName(item.name);
      setQuantity(item.quantity.toString());
      setUnit((item.unit as ItemUnit) || 'un');
      setPrice(item.price > 0 ? formatShortCurrency(item.price) : '');
      setNotes(item.notes || '');
    }
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^\d.,]/g, '');
    const firstSep = val.search(/[,.]/);
    if (firstSep !== -1) {
      val = val.slice(0, firstSep + 1) + val.slice(firstSep + 1).replace(/[,.]/g, '');
    }
    setPrice(val);
  };

  const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^\d.,]/g, '');
    const firstSep = val.search(/[,.]/);
    if (firstSep !== -1) {
      val = val.slice(0, firstSep + 1) + val.slice(firstSep + 1).replace(/[,.]/g, '');
    }
    setQuantity(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedQty = parseFloat(quantity.replace(',', '.'));
    const finalQty = isNaN(parsedQty) || parsedQty < 0 ? 0 : parsedQty;
    const parsedPrice = parseCurrencyInput(price);

    onSave(item.id, {
      name: name.trim(),
      quantity: finalQty,
      unit,
      price: parsedPrice,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Editar Produto</h2>
          <button type="button" className="btn-icon" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Nome do Produto</label>
              <input
                type="text"
                className="input-main"
                placeholder="Ex: Arroz, Leite..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Quantidade</label>
                <input
                  type="text"
                  inputMode="decimal"
                  className="input-main"
                  placeholder="0"
                  value={quantity}
                  onChange={handleQtyChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Unidade</label>
                <select
                  className="input-main select-unit"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as ItemUnit)}
                  style={{ width: '100%' }}
                >
                  {COMMON_UNITS.map((u) => (
                    <option key={u.value} value={u.value}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Preço Unitário (R$)</label>
              <div className="price-input-wrapper" style={{ width: '100%' }}>
                <span className="price-currency-label" style={{ left: '14px' }}>R$</span>
                <input
                  type="text"
                  inputMode="decimal"
                  className="input-main"
                  style={{ paddingLeft: '44px', width: '100%' }}
                  placeholder="0,00"
                  value={price}
                  onChange={handlePriceChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Observações / Marca (opcional)</label>
              <input
                type="text"
                className="input-main"
                placeholder="Ex: Marca específica, embalagem econômica..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              <Check size={16} />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
