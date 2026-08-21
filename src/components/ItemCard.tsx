import React, { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DragIndicatorRounded from '@mui/icons-material/DragIndicatorRounded';
import CheckRounded from '@mui/icons-material/CheckRounded';
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded';
import EditRounded from '@mui/icons-material/EditRounded';
import CloseRounded from '@mui/icons-material/CloseRounded';
import ScaleRounded from '@mui/icons-material/ScaleRounded';
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
          title="Segure para reordenar o item na lista"
        >
          <DragIndicatorRounded style={{ fontSize: 20 }} />
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
            {item.checked && <CheckRounded style={{ fontSize: 18 }} />}
          </div>
        </div>

        {/* Informações do Item + Tag Pesável */}
        <div className="item-info" onClick={() => onOpenEdit && onOpenEdit(item)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span className="item-name">{item.name}</span>
            {isWeighable && (
              <button
                type="button"
                className={`weigh-badge ${currentSubtotal > 0 ? 'confirmed' : 'pending'}`}
                onClick={toggleWeighReminder}
                title={currentSubtotal > 0 ? 'Item pesável com valor preenchido' : 'Item pesável'}
              >
                <ScaleRounded style={{ fontSize: 13 }} />
                <span>{currentSubtotal > 0 ? 'Pesado' : 'Pesável'}</span>
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
            <EditRounded style={{ fontSize: 17 }} />
          </button>
        )}

        {/* Botão Deletar */}
        <button
          type="button"
          className="item-action-btn delete"
          onClick={() => onDeleteItem(item.id)}
          title="Remover item da lista"
        >
          <DeleteOutlineRounded style={{ fontSize: 18 }} />
        </button>
      </div>

      {/* Controles de Quantidade/Peso, Preço Unitário e Subtotal Direto (Sem Sobreposição) */}
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
        <div className="price-input-wrapper" title={`Preço por ${item.unit}`}>
          <span className="price-currency-label">{priceUnitPrefix}</span>
          <input
            type="text"
            inputMode="decimal"
            className="price-input-field"
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
              className="btn-clear-inline"
              onClick={handleClearPrice}
              title="Zerar valor unitário"
              aria-label="Zerar valor unitário"
            >
              <CloseRounded style={{ fontSize: 13 }} />
            </button>
          )}
        </div>

        {/* Subtotal / Total Direto da Balança (Layout Flex Sem Sobreposição) */}
        <div className="subtotal-input-wrapper" title="Valor Total do produto (calculado ou digitado direto da balança)">
          <span className="subtotal-currency-label">Total R$</span>
          <input
            type="text"
            inputMode="decimal"
            className="subtotal-input-field"
            placeholder="0,00"
            value={subtotalInput}
            onChange={handleSubtotalChange}
            onFocus={() => setIsSubtotalFocused(true)}
            onBlur={handleSubtotalBlur}
            title="Valor total da balança ou calculado"
          />
          {currentSubtotal > 0 && (
            <button
              type="button"
              className="btn-clear-inline"
              onClick={handleClearSubtotal}
              title="Zerar valor total"
              aria-label="Zerar valor total"
            >
              <CloseRounded style={{ fontSize: 13 }} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
