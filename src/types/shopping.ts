export type ItemUnit = 'un' | 'kg' | 'g' | 'L' | 'ml' | 'pct' | 'cx' | 'dz';

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number; // Quantidade ou peso (ex: 1, 0.5, 2.5)
  unit: ItemUnit | string;
  price: number; // Preço unitário ou preço por kg (ex: 4.00)
  customSubtotal?: number | null; // Subtotal digitado diretamente do caixa/balança (ex: 2.75)
  weighAtCheckout?: boolean; // Lembrete de pesagem no caixa
  checked: boolean; // Se foi colocado no carrinho
  category?: string;
  notes?: string;
  createdAt: number;
}

export interface ShoppingList {
  id: string;
  name: string;
  budget: number | null; // Teto de gastos opcional (ex: 500)
  items: ShoppingItem[];
  createdAt: number;
  updatedAt: number;
  isArchived?: boolean;
}

export type FilterStatus = 'all' | 'pending' | 'completed';

export interface ListStats {
  totalBudget: number | null;
  totalSpent: number; // Soma de todos os produtos com valor lançado na lista
  totalEstimated: number; // Soma total estimada
  totalItemsCount: number;
  checkedItemsCount: number;
  pendingItemsCount: number;
  remainingBudget: number | null;
  isOverBudget: boolean;
  budgetPercentage: number; // 0 a 100+
  weighPendingCount: number; // Quantidade de itens pesáveis que ainda precisam ser pesados
}

/**
 * Calcula o subtotal exato de um item levando em conta peso, preço por kg e subtotais diretos
 */
export function calculateItemSubtotal(item: ShoppingItem): number {
  if (typeof item.customSubtotal === 'number' && item.customSubtotal > 0) {
    return item.customSubtotal;
  }
  const qty = item.quantity || 0;
  const price = item.price || 0;

  if (item.unit === 'g') {
    return (qty / 1000) * price;
  }

  return qty * price;
}

/**
 * Retorna se uma unidade é de peso (hortifrúti/açougue)
 */
export function isWeighableUnit(unit: string): boolean {
  return unit === 'kg' || unit === 'g';
}
