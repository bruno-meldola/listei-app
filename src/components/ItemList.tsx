import React from 'react';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Search, X, RotateCcw, ShoppingCart } from 'lucide-react';
import type { ShoppingItem, FilterStatus, ListStats } from '../types/shopping';
import { ItemCard } from './ItemCard';

interface ItemListProps {
  items: ShoppingItem[];
  stats: ListStats;
  filter: FilterStatus;
  searchQuery: string;
  onFilterChange: (filter: FilterStatus) => void;
  onSearchChange: (query: string) => void;
  onToggleCheck: (id: string) => void;
  onUpdateItem: (id: string, updates: Partial<ShoppingItem>) => void;
  onDeleteItem: (id: string) => void;
  onReorder: (activeId: string, overId: string) => void;
  onOpenEdit?: (item: ShoppingItem) => void;
  onOpenResetModal: () => void;
}

export const ItemList: React.FC<ItemListProps> = ({
  items,
  stats,
  filter,
  searchQuery,
  onFilterChange,
  onSearchChange,
  onToggleCheck,
  onUpdateItem,
  onDeleteItem,
  onReorder,
  onOpenEdit,
  onOpenResetModal,
}) => {
  // Sensores separados: MouseSensor para desktop e TouchSensor com tolerância para mobile
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      onReorder(active.id as string, over.id as string);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Controles de Busca e Filtros */}
      <div className="controls-section">
        {/* Barra de Busca rápida */}
        <div className="search-bar">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Filtrar ou buscar produto..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear"
              onClick={() => onSearchChange('')}
              title="Limpar busca"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Chips de Filtro + Botão Resetar Lista */}
        <div className="filters-row">
          <button
            type="button"
            className={`filter-chip ${filter === 'all' ? 'active' : ''}`}
            onClick={() => onFilterChange('all')}
          >
            <span>Todos</span>
            <span className="filter-count">{stats.totalItemsCount}</span>
          </button>

          <button
            type="button"
            className={`filter-chip ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => onFilterChange('pending')}
          >
            <span>Faltando</span>
            <span className="filter-count">{stats.pendingItemsCount}</span>
          </button>

          <button
            type="button"
            className={`filter-chip ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => onFilterChange('completed')}
          >
            <span>No Carrinho</span>
            <span className="filter-count">{stats.checkedItemsCount}</span>
          </button>

          {stats.totalItemsCount > 0 && (
            <button
              type="button"
              className="filter-chip reset-btn"
              onClick={onOpenResetModal}
              style={{ marginLeft: 'auto' }}
              title="Resetar valores e desmarcar todos os produtos"
            >
              <RotateCcw size={13} />
              <span>Resetar lista</span>
            </button>
          )}
        </div>
      </div>

      {/* Lista com Drag 'n Drop */}
      <div className="items-list-container">
        {items.length === 0 ? (
          <div className="empty-state">
            <ShoppingCart className="empty-state-icon" />
            <div className="empty-state-title">
              {searchQuery
                ? 'Nenhum item encontrado na busca'
                : filter === 'completed'
                ? 'Nenhum item marcado no carrinho ainda'
                : filter === 'pending'
                ? 'Todos os itens já foram pegos!'
                : 'Sua lista está vazia'}
            </div>
            <div className="empty-state-desc">
              {searchQuery
                ? 'Tente buscar com outro termo ou limpe o campo de busca.'
                : filter === 'all'
                ? 'Adicione seus produtos acima ou cole uma lista pronta do WhatsApp para começar.'
                : 'Alterne os filtros acima para ver todos os itens.'}
            </div>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items.map((i) => i.id)}
              strategy={verticalListSortingStrategy}
            >
              {items.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onToggleCheck={onToggleCheck}
                  onUpdateItem={onUpdateItem}
                  onDeleteItem={onDeleteItem}
                  onOpenEdit={onOpenEdit}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
};
