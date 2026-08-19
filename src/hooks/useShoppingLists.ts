import { useState, useEffect, useMemo, useCallback } from 'react';
import type { ShoppingList, ShoppingItem, ListStats, FilterStatus } from '../types/shopping';
import { calculateItemSubtotal, isWeighableUnit } from '../types/shopping';

const STORAGE_KEY = 'listei_shopping_lists_v1';
const ACTIVE_LIST_KEY = 'listei_active_list_id_v1';

const DEFAULT_SAMPLE_LIST: ShoppingList = {
  id: 'default-list',
  name: 'Minha Lista de Mercado',
  budget: 500,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  items: [
    {
      id: 'item-1',
      name: 'Arroz 5kg',
      quantity: 1,
      unit: 'pct',
      price: 26.90,
      checked: true,
      createdAt: Date.now() - 3000,
    },
    {
      id: 'item-2',
      name: 'Feijão Carioca 1kg',
      quantity: 2,
      unit: 'pct',
      price: 7.50,
      checked: true,
      createdAt: Date.now() - 2000,
    },
    {
      id: 'item-3',
      name: 'Leite Integral',
      quantity: 4,
      unit: 'L',
      price: 4.89,
      checked: false,
      createdAt: Date.now() - 1000,
    },
    {
      id: 'item-4',
      name: 'Café Torrado 500g',
      quantity: 2,
      unit: 'pct',
      price: 18.50,
      checked: false,
      createdAt: Date.now() - 500,
    },
    {
      id: 'item-5',
      name: 'Banana Prata',
      quantity: 1.5,
      unit: 'kg',
      price: 5.00,
      weighAtCheckout: true,
      checked: false,
      createdAt: Date.now(),
    },
  ],
};

export function useShoppingLists() {
  const [lists, setLists] = useState<ShoppingList[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Erro ao carregar listas do LocalStorage:', e);
    }
    return [DEFAULT_SAMPLE_LIST];
  });

  const [activeListId, setActiveListId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(ACTIVE_LIST_KEY);
      if (saved && lists.some((l) => l.id === saved)) {
        return saved;
      }
    } catch (e) {
      console.error('Erro ao ler activeListId:', e);
    }
    return lists[0]?.id || 'default-list';
  });

  const [filter, setFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Persistência automática
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
    } catch (e) {
      console.error('Erro ao salvar listas:', e);
    }
  }, [lists]);

  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_LIST_KEY, activeListId);
    } catch (e) {
      console.error('Erro ao salvar activeListId:', e);
    }
  }, [activeListId]);

  const activeList = useMemo(() => {
    return lists.find((l) => l.id === activeListId) || lists[0];
  }, [lists, activeListId]);

  // Estatísticas calculadas: qualquer item com preço ou subtotal lançado entra imediatamente no total da compra
  const stats: ListStats = useMemo(() => {
    if (!activeList) {
      return {
        totalBudget: null,
        totalSpent: 0,
        totalEstimated: 0,
        totalItemsCount: 0,
        checkedItemsCount: 0,
        pendingItemsCount: 0,
        remainingBudget: null,
        isOverBudget: false,
        budgetPercentage: 0,
        weighPendingCount: 0,
      };
    }

    let spent = 0;
    let checkedCount = 0;
    let weighPending = 0;

    for (const item of activeList.items) {
      const itemSubtotal = calculateItemSubtotal(item);
      spent += itemSubtotal;

      if (item.checked) {
        checkedCount++;
      }

      // Se for item pesável e ainda não tiver preço/subtotal preenchido
      const isWeighable = isWeighableUnit(item.unit) || item.weighAtCheckout;
      if (isWeighable && itemSubtotal <= 0) {
        weighPending++;
      }
    }

    const totalCount = activeList.items.length;
    const pendingCount = totalCount - checkedCount;
    const budget = activeList.budget;
    const remaining = budget !== null ? budget - spent : null;
    const isOver = budget !== null ? spent > budget : false;
    const pct = budget && budget > 0 ? Math.min(Math.round((spent / budget) * 100), 999) : 0;

    return {
      totalBudget: budget,
      totalSpent: spent,
      totalEstimated: spent,
      totalItemsCount: totalCount,
      checkedItemsCount: checkedCount,
      pendingItemsCount: pendingCount,
      remainingBudget: remaining,
      isOverBudget: isOver,
      budgetPercentage: pct,
      weighPendingCount: weighPending,
    };
  }, [activeList]);

  // Itens filtrados para exibição
  const filteredItems = useMemo(() => {
    if (!activeList) return [];

    return activeList.items.filter((item) => {
      // Filtro de status
      if (filter === 'pending' && item.checked) return false;
      if (filter === 'completed' && !item.checked) return false;

      // Filtro de busca
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.name.toLowerCase().includes(q);
        const matchNotes = item.notes?.toLowerCase().includes(q);
        if (!matchName && !matchNotes) return false;
      }

      return true;
    });
  }, [activeList, filter, searchQuery]);

  // Ações de Lista
  const createList = useCallback((name: string, budget?: number | null) => {
    const newList: ShoppingList = {
      id: `list-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name: name.trim() || 'Nova Lista',
      budget: budget !== undefined ? budget : null,
      items: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setLists((prev) => [newList, ...prev]);
    setActiveListId(newList.id);
    return newList.id;
  }, []);

  const switchList = useCallback((id: string) => {
    setActiveListId(id);
    setFilter('all');
    setSearchQuery('');
  }, []);

  const renameList = useCallback((id: string, name: string) => {
    setLists((prev) =>
      prev.map((l) => (l.id === id ? { ...l, name: name.trim(), updatedAt: Date.now() } : l))
    );
  }, []);

  const setListBudget = useCallback((id: string, budget: number | null) => {
    setLists((prev) =>
      prev.map((l) => (l.id === id ? { ...l, budget, updatedAt: Date.now() } : l))
    );
  }, []);

  const deleteList = useCallback(
    (id: string) => {
      setLists((prev) => {
        const remaining = prev.filter((l) => l.id !== id);
        if (remaining.length === 0) {
          const freshList: ShoppingList = {
            id: `list-${Date.now()}`,
            name: 'Minha Lista',
            budget: null,
            items: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          setActiveListId(freshList.id);
          return [freshList];
        }
        if (activeListId === id) {
          setActiveListId(remaining[0].id);
        }
        return remaining;
      });
    },
    [activeListId]
  );

  const duplicateList = useCallback((id: string, newName?: string) => {
    setLists((prev) => {
      const source = prev.find((l) => l.id === id);
      if (!source) return prev;

      const copy: ShoppingList = {
        ...source,
        id: `list-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        name: newName || `${source.name} (Cópia)`,
        items: source.items.map((item) => ({
          ...item,
          id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        })),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setActiveListId(copy.id);
      return [copy, ...prev];
    });
  }, []);

  // Ações de Itens
  const addItem = useCallback(
    (name: string, quantity = 1, unit = 'un', price = 0, notes?: string) => {
      if (!activeListId || !name.trim()) return;

      const isWeighable = unit === 'kg' || unit === 'g';

      const newItem: ShoppingItem = {
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        name: name.trim(),
        quantity: quantity >= 0 ? quantity : 1,
        unit: unit || 'un',
        price: price >= 0 ? price : 0,
        weighAtCheckout: isWeighable,
        checked: false,
        notes: notes?.trim() || undefined,
        createdAt: Date.now(),
      };

      setLists((prev) =>
        prev.map((l) =>
          l.id === activeListId
            ? { ...l, items: [newItem, ...l.items], updatedAt: Date.now() }
            : l
        )
      );
    },
    [activeListId]
  );

  const addBulkItems = useCallback(
    (newItems: Omit<ShoppingItem, 'id' | 'createdAt'>[]) => {
      if (!activeListId || newItems.length === 0) return;

      const timestamp = Date.now();
      const formattedItems: ShoppingItem[] = newItems.map((item, idx) => ({
        ...item,
        weighAtCheckout: item.unit === 'kg' || item.unit === 'g',
        id: `item-${timestamp}-${idx}-${Math.random().toString(36).substr(2, 6)}`,
        createdAt: timestamp + idx,
      }));

      setLists((prev) =>
        prev.map((l) =>
          l.id === activeListId
            ? { ...l, items: [...formattedItems, ...l.items], updatedAt: Date.now() }
            : l
        )
      );
    },
    [activeListId]
  );

  const updateItem = useCallback(
    (itemId: string, updates: Partial<ShoppingItem>) => {
      if (!activeListId) return;

      setLists((prev) =>
        prev.map((l) => {
          if (l.id !== activeListId) return l;
          return {
            ...l,
            items: l.items.map((item) =>
              item.id === itemId ? { ...item, ...updates } : item
            ),
            updatedAt: Date.now(),
          };
        })
      );
    },
    [activeListId]
  );

  const toggleCheckItem = useCallback(
    (itemId: string) => {
      if (!activeListId) return;

      setLists((prev) =>
        prev.map((l) => {
          if (l.id !== activeListId) return l;
          return {
            ...l,
            items: l.items.map((item) =>
              item.id === itemId ? { ...item, checked: !item.checked } : item
            ),
            updatedAt: Date.now(),
          };
        })
      );
    },
    [activeListId]
  );

  const deleteItem = useCallback(
    (itemId: string) => {
      if (!activeListId) return;

      setLists((prev) =>
        prev.map((l) => {
          if (l.id !== activeListId) return l;
          return {
            ...l,
            items: l.items.filter((item) => item.id !== itemId),
            updatedAt: Date.now(),
          };
        })
      );
    },
    [activeListId]
  );

  const reorderItemsById = useCallback(
    (activeId: string, overId: string) => {
      if (!activeListId || activeId === overId) return;

      setLists((prev) =>
        prev.map((l) => {
          if (l.id !== activeListId) return l;
          const oldIndex = l.items.findIndex((item) => item.id === activeId);
          const newIndex = l.items.findIndex((item) => item.id === overId);
          if (oldIndex === -1 || newIndex === -1) return l;

          const newItems = [...l.items];
          const [movedItem] = newItems.splice(oldIndex, 1);
          newItems.splice(newIndex, 0, movedItem);

          return {
            ...l,
            items: newItems,
            updatedAt: Date.now(),
          };
        })
      );
    },
    [activeListId]
  );

  // Reseta todos os preços para R$ 0,00 e desmarca os checkboxes, mantendo itens e quantidades
  const resetAllPricesAndChecks = useCallback(() => {
    if (!activeListId) return;
    setLists((prev) =>
      prev.map((l) =>
        l.id === activeListId
          ? {
              ...l,
              items: l.items.map((item) => ({
                ...item,
                checked: false,
                price: 0,
                customSubtotal: null,
              })),
              updatedAt: Date.now(),
            }
          : l
      )
    );
  }, [activeListId]);

  return {
    lists,
    activeList,
    activeListId,
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
  };
}
