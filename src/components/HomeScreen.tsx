import React, { useState } from 'react';
import {
  Menu,
  Plus,
  Search,
  X,
  Copy,
  Trash2,
  Pencil,
  Check,
  CheckCircle2,
  AlertCircle,
  Layers,
} from 'lucide-react';
import type { ShoppingList } from '../types/shopping';
import type { ThemeMode } from '../hooks/useTheme';
import { formatCurrency } from '../utils/currency';
import { CreateListModal } from './CreateListModal';
import { NavigationDrawer } from './NavigationDrawer';

interface HomeScreenProps {
  lists: ShoppingList[];
  currentTheme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  onSetTheme: (mode: ThemeMode) => void;
  onToggleTheme: () => void;
  onSelectList: (listId: string) => void;
  onCreateList: (name: string, budget: number | null) => void;
  onRenameList: (id: string, name: string) => void;
  onDuplicateList: (id: string) => void;
  onDeleteList: (id: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  lists,
  currentTheme,
  resolvedTheme,
  onSetTheme,
  onToggleTheme,
  onSelectList,
  onCreateList,
  onRenameList,
  onDuplicateList,
  onDeleteList,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editNameValue, setEditNameValue] = useState('');

  const totalItemsAcrossAllLists = lists.reduce((acc, l) => acc + l.items.length, 0);

  const filteredLists = lists.filter((list) =>
    list.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const handleStartRename = (e: React.MouseEvent, list: ShoppingList) => {
    e.stopPropagation();
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

  const handleCloseSearch = () => {
    setIsSearchActive(false);
    setSearchQuery('');
  };

  return (
    <div className="home-screen-container">
      {/* Header Estilo Material Design do Google */}
      <header className="material-top-app-bar">
        <div className="material-app-bar-left">
          <button
            type="button"
            className="btn-icon"
            onClick={() => setIsDrawerOpen(true)}
            title="Menu Principal"
            aria-label="Abrir menu de navegação"
          >
            <Menu size={22} />
          </button>
        </div>

        <div className="material-app-bar-center">
          <h1 className="material-app-bar-title">Minhas listas</h1>
        </div>

        <div className="material-app-bar-right">
          <button
            type="button"
            className={`btn-icon ${isSearchActive ? 'active' : ''}`}
            onClick={() => {
              setIsSearchActive((prev) => !prev);
              if (isSearchActive) setSearchQuery('');
            }}
            title={isSearchActive ? 'Fechar busca' : 'Buscar listas'}
            aria-label="Procurar listas"
          >
            <Search size={19} />
          </button>

          <button
            type="button"
            className="btn-icon btn-create-header"
            onClick={() => setIsCreateModalOpen(true)}
            title="Criar nova lista"
            aria-label="Criar nova lista"
          >
            <Plus size={22} strokeWidth={2.5} />
          </button>
        </div>
      </header>

      {/* Barra de Busca Expansível */}
      {isSearchActive && (
        <div className="material-search-expanded">
          <div className="material-search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Digite o nome da lista..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button
              type="button"
              className="search-clear"
              onClick={handleCloseSearch}
              title="Fechar busca"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Conteúdo Principal */}
      <main className="home-main-content">
        {/* Grid de Cards de Listas */}
        {filteredLists.length === 0 ? (
          <div className="empty-state home-empty-state">
            <Layers className="empty-state-icon" />
            <div className="empty-state-title">
              {searchQuery ? 'Nenhuma lista encontrada' : 'Você ainda não tem listas'}
            </div>
            <div className="empty-state-desc">
              {searchQuery
                ? 'Tente buscar por outro termo ou limpe o campo de busca.'
                : 'Clique no botão + no topo para criar sua primeira lista de compras!'}
            </div>
            {!searchQuery && (
              <button
                type="button"
                className="btn-primary"
                style={{ marginTop: '12px' }}
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Plus size={18} />
                <span>Criar Minha Primeira Lista</span>
              </button>
            )}
          </div>
        ) : (
          <div className="home-cards-grid">
            {filteredLists.map((list) => {
              const totalItems = list.items.length;
              const checkedItems = list.items.filter((i) => i.checked).length;
              const totalSpent = list.items.reduce(
                (acc, i) => acc + (i.quantity || 0) * (i.price || 0),
                0
              );
              const isComplete = totalItems > 0 && checkedItems === totalItems;
              const isOverBudget = list.budget !== null && totalSpent > list.budget;

              return (
                <div
                  key={list.id}
                  className="list-card"
                  onClick={() => {
                    if (editingListId !== list.id) {
                      onSelectList(list.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && editingListId !== list.id) {
                      onSelectList(list.id);
                    }
                  }}
                >
                  {/* Topo do Card: Nome e Ações */}
                  <div className="list-card-header">
                    {editingListId === list.id ? (
                      <div
                        className="list-rename-inline"
                        onClick={(e) => e.stopPropagation()}
                      >
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
                          title="Confirmar"
                        >
                          <Check size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="list-card-title-row">
                        <h2 className="list-card-name">{list.name}</h2>
                        {isComplete && (
                          <span className="list-card-badge-complete">
                            <CheckCircle2 size={12} />
                            <span>Concluída</span>
                          </span>
                        )}
                      </div>
                    )}

                    {/* Botões de Ação do Card */}
                    <div
                      className="list-card-actions"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        className="btn-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDuplicateList(list.id);
                        }}
                        aria-label="Duplicar lista"
                      >
                        <abbr title="Duplicar lista" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                          <Copy size={15} />
                        </abbr>
                      </button>

                      {editingListId !== list.id && (
                        <button
                          type="button"
                          className="btn-icon"
                          onClick={(e) => handleStartRename(e, list)}
                          aria-label="Renomear lista"
                        >
                          <abbr title="Renomear lista" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                            <Pencil size={15} />
                          </abbr>
                        </button>
                      )}

                      {lists.length > 1 && (
                        <button
                          type="button"
                          className="btn-icon delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Deseja excluir a lista "${list.name}"?`)) {
                              onDeleteList(list.id);
                            }
                          }}
                          aria-label="Excluir lista"
                        >
                          <abbr title="Excluir lista" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                            <Trash2 size={15} />
                          </abbr>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Estatísticas e Totais do Card */}
                  <div className="list-card-body">
                    <div className="list-card-total-spent">
                      <span className="list-card-total-label">Total da Compra</span>
                      <span className="list-card-total-value">{formatCurrency(totalSpent)}</span>
                    </div>

                    <div className="list-card-info-row">
                      <span className="list-card-items-stat">
                        {totalItems} {totalItems === 1 ? 'produto' : 'produtos'} ({checkedItems} pegos)
                      </span>

                      {list.budget !== null && (
                        <span
                          className={`list-card-budget-stat ${
                            isOverBudget ? 'over-budget' : ''
                          }`}
                        >
                          {isOverBudget && <AlertCircle size={12} />}
                          Teto: {formatCurrency(list.budget)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Menu Hambúrguer Lateral (Navigation Drawer) */}
      <NavigationDrawer
        isOpen={isDrawerOpen}
        totalListsCount={lists.length}
        totalItemsCount={totalItemsAcrossAllLists}
        currentTheme={currentTheme}
        resolvedTheme={resolvedTheme}
        onSetTheme={onSetTheme}
        onToggleTheme={onToggleTheme}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* Modal de Criação de Lista */}
      <CreateListModal
        isOpen={isCreateModalOpen}
        onCreateList={onCreateList}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};
