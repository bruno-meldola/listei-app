import React, { useState } from 'react';
import { useShoppingLists } from './hooks/useShoppingLists';
import { useTheme } from './hooks/useTheme';
import { HomeScreen } from './components/HomeScreen';
import { Header } from './components/Header';
import { AddItemForm } from './components/AddItemForm';
import { ItemList } from './components/ItemList';
import { BudgetBar } from './components/BudgetBar';
import { BudgetModal } from './components/BudgetModal';
import { QuickPasteModal } from './components/QuickPasteModal';
import { SummaryModal } from './components/SummaryModal';
import { EditItemModal } from './components/EditItemModal';
import { ResetListModal } from './components/ResetListModal';
import type { ShoppingItem } from './types/shopping';

export const App: React.FC = () => {
  const {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  } = useTheme();

  const {
    lists,
    activeList,
    stats,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    filteredItems,
    createList,
    switchList,
    renameList,
    setListBudget,
    deleteList,
    duplicateList,
    addItem,
    addBulkItems,
    updateItem,
    toggleCheckItem,
    deleteItem,
    reorderItemsById,
    resetAllPricesAndChecks,
  } = useShoppingLists();

  // Navegação: 'home' (Tela Inicial com cards) ou 'list-detail' (Detalhes da lista aberta)
  const [currentView, setCurrentView] = useState<'home' | 'list-detail'>('home');

  // Modals state
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isQuickPasteModalOpen, setIsQuickPasteModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isResetListModalOpen, setIsResetListModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);

  const handleSelectList = (id: string) => {
    switchList(id);
    setCurrentView('list-detail');
  };

  const handleCreateListFromHome = (name: string, budget: number | null) => {
    createList(name, budget);
    setCurrentView('list-detail');
  };

  const handleSaveBudget = (newBudget: number | null) => {
    if (activeList) {
      setListBudget(activeList.id, newBudget);
    }
  };

  return (
    <div className="app-container">
      {currentView === 'home' ? (
        /* TELA INICIAL: "Minhas listas" no estilo Material Design com Menu Lateral e Busca */
        <HomeScreen
          lists={lists}
          currentTheme={theme}
          resolvedTheme={resolvedTheme}
          onSetTheme={setTheme}
          onToggleTheme={toggleTheme}
          onSelectList={handleSelectList}
          onCreateList={handleCreateListFromHome}
          onRenameList={renameList}
          onDuplicateList={duplicateList}
          onDeleteList={deleteList}
        />
      ) : (
        /* TELA DE DETALHES DA LISTA (Modo Mercado / Compras) */
        <>
          {/* Header com botão Voltar */}
          <Header
            activeList={activeList}
            stats={stats}
            onBack={() => setCurrentView('home')}
            onOpenQuickPaste={() => setIsQuickPasteModalOpen(true)}
            onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
            onOpenSummaryModal={() => setIsSummaryModalOpen(true)}
          />

          {/* Inserção Rápida de Produtos */}
          <AddItemForm
            onAddItem={(name, quantity, unit, price) =>
              addItem(name, quantity, unit, price)
            }
          />

          {/* Lista Ordenável de Produtos */}
          <ItemList
            items={filteredItems}
            stats={stats}
            filter={filter}
            searchQuery={searchQuery}
            onFilterChange={setFilter}
            onSearchChange={setSearchQuery}
            onToggleCheck={toggleCheckItem}
            onUpdateItem={updateItem}
            onDeleteItem={deleteItem}
            onReorder={reorderItemsById}
            onOpenEdit={(item) => setEditingItem(item)}
            onOpenResetModal={() => setIsResetListModalOpen(true)}
          />

          {/* Barra Fixa Inferior de Orçamento */}
          <BudgetBar
            stats={stats}
            onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
            onOpenSummaryModal={() => setIsSummaryModalOpen(true)}
          />

          {/* Modais da Lista Ativa */}
          <BudgetModal
            isOpen={isBudgetModalOpen}
            currentBudget={activeList?.budget ?? null}
            onSaveBudget={handleSaveBudget}
            onClose={() => setIsBudgetModalOpen(false)}
          />

          <QuickPasteModal
            isOpen={isQuickPasteModalOpen}
            onAddBulkItems={addBulkItems}
            onClose={() => setIsQuickPasteModalOpen(false)}
          />

          <SummaryModal
            isOpen={isSummaryModalOpen}
            activeList={activeList}
            stats={stats}
            onClose={() => setIsSummaryModalOpen(false)}
          />

          <ResetListModal
            isOpen={isResetListModalOpen}
            listName={activeList?.name || 'Lista'}
            onConfirm={resetAllPricesAndChecks}
            onClose={() => setIsResetListModalOpen(false)}
          />

          <EditItemModal
            isOpen={!!editingItem}
            item={editingItem}
            onSave={updateItem}
            onClose={() => setEditingItem(null)}
          />
        </>
      )}
    </div>
  );
};

export default App;
