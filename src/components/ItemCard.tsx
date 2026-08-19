import React, { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Check, Trash2, Edit2, X, Scale } from 'lucide-react';
import type { ShoppingItem } from '../types/shopping';
import { calculateItemSubtotal, isWeighableUnit } from '../types/shopping';
import { formatShortCurrency, parseCurrencyInput, formatQuantity } from '../utils/currency';

interface ItemCardProps {
  item: ShoppingItem;
  onToggleCheck: (id: string) => void;
  onUpdateItem: (id: string, updates: Partial<ShoppingItem>) => void;
  onDeleteItem: (id: string) => void;
  onOpenEdit?: (item: ShoppingItem) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onToggleCheck,
  onUpdateItem,
  onDeleteItem,
  onOpenEdit,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isWeighable = isWeighableUnit(item.unit) || item.weighAtCheckout;
  const currentSubtotal = calculateItemSubtotal(item);

  // Estado local de preço unitário / por kg
  const [priceInput, setPriceInput] = useState(() =>
    item.price > 0 ? formatShortCurrency(item.price) : ''
  );
  const [isPriceFocused, setIsPriceFocused] = useState(false);

  // Estado local de subtotal / total do item (direto da balança/caixa)
  const [subtotalInput, setSubtotalInput] = useState(() =>
    currentSubtotal > 0 ? formatShortCurrency(currentSubtotal) : ''
  );
  const [isSubtotalFocused, setIsSubtotalFocused] = useState(false);

  // Estado local de quantidade/peso
  const [qtyInput, setQtyInput] = useState(() => formatQuantity(item.quantity));
  const [isQtyFocused, setIsQtyFocused] = useState(false);

  // Sincronizar preço quando não estiver focado
  useEffect(() => {
    if (!isPriceFocused) {
      setPriceInput(item.price > 0 ? formatShortCurrency(item.price) : '');
    }
  }, [item.price, isPriceFocused]);

  // Sincronizar subtotal quando não estiver focado
  useEffect(() => {
    if (!isSubtotalFocused) {
      setSubtotalInput(currentSubtotal > 0 ? formatShortCurrency(currentSubtotal) : '');
    }
  }, [currentSubtotal, isSubtotalFocused]);

  // Sincronizar quantidade quando não estiver focado
  useEffect(() => {
    if (!isQtyFocused) {
      setQtyInput(formatQuantity(item.quantity));
    }
  }, [item.quantity, isQtyFocused]);

  // Handlers de Preço Unitário (R$/kg ou R$/un)
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^\d.,]/g, '');
    const firstSep = val.search(/[,.]/);
    if (firstSep !== -1) {
      val = val.slice(0, firstSep + 1) + val.slice(firstSep + 1).replace(/[,.]/g, '');
    }

    setPriceInput(val);
    const parsed = parseCurrencyInput(val);
    // Ao digitar no preço unitário, limpa o customSubtotal para usar o cálculo por peso/unidade
    onUpdateItem(item.id, { price: parsed, customSubtotal: null });
  };

  const handlePriceBlur = () => {
    setIsPriceFocused(false);
    const parsed = parseCurrencyInput(priceInput);
    if (parsed > 0) {
      setPriceInput(formatShortCurrency(parsed));
    } else {
      setPriceInput('');
    }
  };

  const handleClearPrice = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPriceInput('');
    setSubtotalInput('');
    onUpdateItem(item.id, { price: 0, customSubtotal: null });
  };

  // Handlers de Subtotal Direto (da Balança/Caixa)
  const handleSubtotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^\d.,]/g, '');
    const firstSep = val.search(/[,.]/);
    if (firstSep !== -1) {
      val = val.slice(0, firstSep + 1) + val.slice(firstSep + 1).replace(/[,.]/g, '');
    }

    setSubtotalInput(val);
    const parsed = parseCurrencyInput(val);
    onUpdateItem(item.id, { customSubtotal: parsed > 0 ? parsed : null });
  };

  const handleSubtotalBlur = () => {
    setIsSubtotalFocused(false);
    const parsed = parseCurrencyInput(subtotalInput);
    if (parsed > 0) {
      setSubtotalInput(formatShortCurrency(parsed));
    } else {
      setSubtotalInput('');
      onUpdateItem(item.id, { customSubtotal: null });
    }
  };

  const handleClearSubtotal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSubtotalInput('');
    setPriceInput('');
    onUpdateItem(item.id, { price: 0, customSubtotal: null });
  };

  // Handlers de Quantidade / Peso
  const handleQuantityStep = (delta: number) => {
    const step = item.unit === 'kg' ? 0.5 : 1;
    let newQty = item.quantity + delta * step;
    if (newQty < 0) newQty = 0;
    // Arredonda para 2 casas se for kg
    newQty = item.unit === 'kg' ? Math.round(newQty * 100) / 100 : Math.round(newQty);

    setQtyInput(formatQuantity(newQty));
    onUpdateItem(item.id, { quantity: newQty, customSubtotal: null });
  };

  const handleQtyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^\d.,]/g, '');
    const firstSep = val.search(/[,.]/);
    if (firstSep !== -1) {
      val = val.slice(0, firstSep + 1) + val.slice(firstSep + 1).replace(/[,.]/g, '');
    }
    setQtyInput(val);

    const parsed = parseFloat(val.replace(',', '.'));
    if (!isNaN(parsed) && parsed >= 0) {
      onUpdateItem(item.id, { quantity: parsed, customSubtotal: null });
    } else if (val === '') {
      onUpdateItem(item.id, { quantity: 0, customSubtotal: null });
    }
  };

  const handleQtyInputBlur = () => {
    setIsQtyFocused(false);
    const parsed = parseFloat(qtyInput.replace(',', '.'));
    if (isNaN(parsed) || parsed < 0) {
      setQtyInput('0');
      onUpdateItem(item.id, { quantity: 0 });
    } else {
      setQtyInput(formatQuantity(parsed));
      onUpdateItem(item.id, { quantity: parsed });
    }
  };

  const toggleWeighReminder = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateItem(item.id, { weighAtCheckout: !item.weighAtCheckout });
  };

  const unitLabel = item.unit === 'kg' ? 'kg' : item.unit === 'g' ? 'g' : item.unit;
  const priceUnitPrefix = `R$/${unitLabel}`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`item-card ${item.checked ? 'is-checked' : ''} ${
        isDragging ? 'is-dragging' : ''
      }`}
    >
      <div className="item-card-main">
        {/* Alça de Arraste (Drag Handle) */}
        <div
          className="drag-handle"
          {...attributes}
          {...listeners}
          title="Segure para reordenar o item"
        >
          <GripVertical size={18} />
        </div>

        {/* Checkbox Ergonômica */}
        <div
          className="checkbox-container"
          onClick={() => onToggleCheck(item.id)}
          title={item.checked ? 'Desmarcar do carrinho' : 'Marcar como pego no carrinho'}
          role="checkbox"
          aria-checked={item.checked}
        >
          <div className="custom-checkbox">
            {item.checked && <Check size={16} strokeWidth={3} />}
          </div>
        </div>

        {/* Informações do Item + Lembrete de Pesar no Caixa */}
        <div className="item-info" onClick={() => onOpenEdit && onOpenEdit(item)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span className="item-name">{item.name}</span>
            {isWeighable && (
              <button
                type="button"
                className={`weigh-badge ${currentSubtotal > 0 ? 'confirmed' : 'pending'}`}
                onClick={toggleWeighReminder}
                title={currentSubtotal > 0 ? 'Valor pesado lançado. Clique para alternar' : 'Item pesável: Pesar no caixa'}
              >
                <Scale size={11} />
                <span>{currentSubtotal > 0 ? 'Pesado' : 'Pesar no caixa'}</span>
              </button>
            )}
          </div>
          {item.notes && <span className="item-notes">{item.notes}</span>}
        </div>

        {/* Botão de Edição Rápida */}
        {onOpenEdit && (
          <button
            type="button"
            className="item-action-btn"
            onClick={() => onOpenEdit(item)}
            title="Editar detalhes do item"
          >
            <Edit2 size={16} />
          </button>
        )}

        {/* Botão Deletar */}
        <button
          type="button"
          className="item-action-btn delete"
          onClick={() => onDeleteItem(item.id)}
          title="Remover item da lista"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Controles de Quantidade/Peso, Preço Unitário e Subtotal Direto */}
      <div className="item-card-actions">
        {/* Stepper e Input de Quantidade/Peso */}
        <div className="quantity-stepper" title={`Quantidade ou peso em ${item.unit}`}>
          <button
            type="button"
            className="stepper-btn"
            onClick={() => handleQuantityStep(-1)}
            title="Diminuir quantidade ou peso"
            aria-label="Diminuir quantidade"
          >
            -
          </button>
          <div className="stepper-input-container">
            <input
              type="text"
              inputMode="decimal"
              className="stepper-input"
              value={qtyInput}
              onChange={handleQtyInputChange}
              onFocus={() => setIsQtyFocused(true)}
              onBlur={handleQtyInputBlur}
              title={`Digite a quantidade ou peso em ${item.unit}`}
            />
            <span className="stepper-unit-label">{item.unit}</span>
          </div>
          <button
            type="button"
            className="stepper-btn"
            onClick={() => handleQuantityStep(1)}
            title="Aumentar quantidade ou peso"
            aria-label="Aumentar quantidade"
          >
            +
          </button>
        </div>

        {/* Preço Unitário / por Kg */}
        <div className="price-box" title={`Preço por ${item.unit}`}>
          <div className="price-input-wrapper">
            <span className="price-currency-label" style={{ fontSize: '0.74rem' }}>
              {priceUnitPrefix}
            </span>
            <input
              type="text"
              inputMode="decimal"
              className="price-input"
              style={{ paddingLeft: priceUnitPrefix.length > 5 ? '48px' : '38px', width: '98px' }}
              placeholder="0,00"
              value={priceInput}
              onChange={handlePriceChange}
              onFocus={() => setIsPriceFocused(true)}
              onBlur={handlePriceBlur}
              title={`Preço por ${item.unit}`}
            />
            {item.price > 0 && (
              <button
                type="button"
                className="btn-clear-price"
                onClick={handleClearPrice}
                title="Zerar valor unitário"
                aria-label="Zerar valor unitário"
              >
                <X size={12} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>

        {/* Subtotal / Total Direto (Balança / Caixa) */}
        <div className="subtotal-input-box" title="Valor Total do item (calcule ou digite direto da balança)">
          <div className="subtotal-input-wrapper">
            <span className="subtotal-currency-label">Total R$</span>
            <input
              type="text"
              inputMode="decimal"
              className="subtotal-input"
              placeholder="0,00"
              value={subtotalInput}
              onChange={handleSubtotalChange}
              onFocus={() => setIsSubtotalFocused(true)}
              onBlur={handleSubtotalBlur}
              title="Digite o total da balança ou veja o calculado"
            />
            {currentSubtotal > 0 && (
              <button
                type="button"
                className="btn-clear-price"
                onClick={handleClearSubtotal}
                title="Zerar subtotal"
                aria-label="Zerar subtotal"
              >
                <X size={12} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
