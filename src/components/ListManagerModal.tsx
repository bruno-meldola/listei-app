import React, { useState, useEffect } from 'react';
import CloseRounded from '@mui/icons-material/CloseRounded';
import AddRounded from '@mui/icons-material/AddRounded';
import LayersRounded from '@mui/icons-material/LayersRounded';
import ContentCopyRounded from '@mui/icons-material/ContentCopyRounded';
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded';
import CheckRounded from '@mui/icons-material/CheckRounded';
import EditRounded from '@mui/icons-material/EditRounded';
import type { ShoppingList } from '../types/shopping';
import { formatCurrency } from '../utils/currency';

interface ListManagerModalProps {
  isOpen: boolean;
  lists: ShoppingList[];
  activeListId: string;
  onSwitchList: (id: string) => void;
  onCreateList: (name: string, budget?: number | null) => void;
  onRenameList: (id: string, name: string) => void;
  onDuplicateList: (id: string) => void;
  onDeleteList: (id: string) => void;
  onClose: () => void;
}

export const ListManagerModal: React.FC<ListManagerModalProps> = ({
  isOpen,
  lists,
  activeListId,
  onSwitchList,
  onCreateList,
  onRenameList,
  onDuplicateList,
  onDeleteList,
  onClose,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListBudget, setNewListBudget] = useState('');
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editNameValue, setEditNameValue] = useState('');

  // Ao abrir ou fechar o modal, cancela qualquer renomeação pendente
  useEffect(() => {
    if (!isOpen) {
      setEditingListId(null);
      setIsCreating(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    const budgetNum = parseFloat(newListBudget.replace(',', '.')) || null;
    onCreateList(newListName.trim(), budgetNum);
    setNewListName('');
    setNewListBudget('');
    setIsCreating(false);
    onClose();
  };

  const handleStartRename = (list: ShoppingList) => {
    setEditingListId(list.id);
    setEditNameValue(list.name);
  };

  const handleSaveRename = (id: string) => {
    if (editNameValue.trim()) {
      onRenameList(id, editNameValue.trim());
    }
    setEditingListId(null);
  };

  const handleCancelRename = () => {
    setEditingListId(null);
  };

  return (
    <div
      className="modal-backdrop"
      onClick={() => {
        setEditingListId(null);
        onClose();
      }}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <LayersRounded style={{ fontSize: 24 }} />
            <h2 className="modal-title">Gerenciar Minhas Listas</h2>
          </div>
          <button
            type="button"
            className="btn-icon"
            onClick={() => {
              setEditingListId(null);
              onClose();
            }}
            aria-label="Fechar"
          >
            <CloseRounded style={{ fontSize: 20 }} />
          </button>
        </div>

        <div className="modal-body">
          {/* Formulário de Criação Rápida */}
          {isCreating ? (
            <form
              onSubmit={handleCreateSubmit}
              style={{
                background: 'var(--bg-surface-subtle)',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                border: '1px solid var(--border-medium)',
              }}
            >
              <span style={{ fontSize: '0.95rem', fontWeight: 700 }}>Criar Nova Lista</span>
              
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Nome da Lista</label>
                <input
                  type="text"
                  className="input-main"
                  placeholder="Ex: Feira Semanal, Churrasco..."
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Teto de Orçamento (R$, opcional)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  className="input-main"
                  placeholder="Ex: 500,00"
                  value={newListBudget}
                  onChange={(e) => setNewListBudget(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '6px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsCreating(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Criar Lista
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              className="btn-primary"
              style={{ width: '100%', padding: '12px 16px' }}
              onClick={() => {
                setEditingListId(null);
                setIsCreating(true);
              }}
            >
              <AddRounded style={{ fontSize: 20 }} />
              <span>Criar Nova Lista do Zero</span>
            </button>
          )}

          {/* Listas Existentes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Suas Listas ({lists.length})
            </span>

            {lists.map((list) => {
              const isActive = list.id === activeListId;
              const checkedCount = list.items.filter((i) => i.checked).length;
              const totalSpent = list.items
                .reduce((acc, i) => acc + (i.quantity || 0) * (i.price || 0), 0);

              return (
                <div
                  key={list.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: `1.5px solid ${isActive ? 'var(--text-primary)' : 'var(--border-medium)'}`,
                    background: isActive ? 'var(--bg-surface-subtle)' : 'var(--bg-surface)',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                    {editingListId === list.id ? (
                      <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
                        <input
                          type="text"
                          className="input-main"
                          value={editNameValue}
                          onChange={(e) => setEditNameValue(e.target.value)}
                          onBlur={handleCancelRename}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveRename(list.id);
                            if (e.key === 'Escape') handleCancelRename();
                          }}
                        />
                        <button
                          type="button"
                          className="btn-icon"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleSaveRename(list.id)}
                          title="Confirmar novo nome"
                        >
                          <CheckRounded style={{ fontSize: 18 }} />
                        </button>
                      </div>
                    ) : (
                      <div
                        style={{ cursor: 'pointer', flex: 1, minWidth: 0 }}
                        onClick={() => {
                          setEditingListId(null);
                          onSwitchList(list.id);
                          onClose();
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                            {list.name}
                          </span>
                          {isActive && (
                            <span
                              style={{
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                background: 'var(--text-primary)',
                                color: 'var(--text-inverse)',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                letterSpacing: '0.04em',
                              }}
                            >
                              ATIVA
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          {list.items.length} produtos ({checkedCount} pegos) • Total: <strong>{formatCurrency(totalSpent)}</strong>
                          {list.budget ? ` • Teto: ${formatCurrency(list.budget)}` : ''}
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                      <button
                        type="button"
                        className="btn-icon"
                        onClick={() => {
                          setEditingListId(null);
                          onDuplicateList(list.id);
                        }}
                        aria-label="Duplicar lista"
                      >
                        <abbr title="Duplicar lista" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                          <ContentCopyRounded style={{ fontSize: 16 }} />
                        </abbr>
                      </button>

                      {editingListId !== list.id && (
                        <button
                          type="button"
                          className="btn-icon"
                          onClick={() => handleStartRename(list)}
                          aria-label="Renomear lista"
                        >
                          <abbr title="Renomear lista" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                            <EditRounded style={{ fontSize: 16 }} />
                          </abbr>
                        </button>
                      )}

                      {lists.length > 1 && (
                        <button
                          type="button"
                          className="btn-icon delete"
                          onClick={() => {
                            setEditingListId(null);
                            if (window.confirm(`Deseja excluir a lista "${list.name}"?`)) {
                              onDeleteList(list.id);
                            }
                          }}
                          aria-label="Excluir lista"
                        >
                          <abbr title="Excluir lista" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                            <DeleteOutlineRounded style={{ fontSize: 16 }} />
                          </abbr>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setEditingListId(null);
              onClose();
            }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
