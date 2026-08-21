import React, { useState, useMemo } from 'react';
import CloseRounded from '@mui/icons-material/CloseRounded';
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined';
import CheckRounded from '@mui/icons-material/CheckRounded';
import type { ShoppingItem } from '../types/shopping';
import { parseShoppingText } from '../utils/parser';

interface QuickPasteModalProps {
  isOpen: boolean;
  onAddBulkItems: (items: Omit<ShoppingItem, 'id' | 'createdAt'>[]) => void;
  onClose: () => void;
}

export const QuickPasteModal: React.FC<QuickPasteModalProps> = ({
  isOpen,
  onAddBulkItems,
  onClose,
}) => {
  const [text, setText] = useState('');

  const parsedItems = useMemo(() => {
    return parseShoppingText(text);
  }, [text]);

  if (!isOpen) return null;

  const handleImport = () => {
    if (parsedItems.length === 0) return;
    onAddBulkItems(parsedItems);
    setText('');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DescriptionOutlined style={{ fontSize: 22 }} />
            <h2 className="modal-title">Importar Lista do WhatsApp</h2>
          </div>
          <button type="button" className="btn-icon" onClick={onClose} aria-label="Fechar">
            <CloseRounded style={{ fontSize: 20 }} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Copie sua lista de compras enviada no WhatsApp ou nas notas e cole abaixo. O Listei! reconhece automaticamente cada produto, quantidades e unidades.
          </p>

          <textarea
            className="input-main"
            style={{
              height: '140px',
              padding: '12px',
              fontFamily: 'inherit',
              fontSize: '0.95rem',
              resize: 'none',
            }}
            placeholder={`Cole aqui sua lista. Exemplo:\nArroz 5kg\n2x Leite Integral\nCafé 500g\n1.5kg Maçã\n3 Sabonetes`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoFocus
          />

          {parsedItems.length > 0 && (
            <div
              style={{
                background: 'var(--bg-surface-subtle)',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                }}
              >
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                  Prévia ({parsedItems.length} {parsedItems.length === 1 ? 'produto detectado' : 'produtos detectados'}):
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px',
                  maxHeight: '110px',
                  overflowY: 'auto',
                }}
              >
                {parsedItems.map((item, idx) => (
                  <span
                    key={idx}
                    className="filter-chip"
                    style={{ fontSize: '0.8rem', padding: '4px 8px' }}
                  >
                    {item.name} ({item.quantity}{item.unit})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>

          <button
            type="button"
            className="btn-primary"
            disabled={parsedItems.length === 0}
            onClick={handleImport}
          >
            <CheckRounded style={{ fontSize: 18 }} />
            <span>Adicionar {parsedItems.length > 0 ? `(${parsedItems.length}) Itens` : 'Itens'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
