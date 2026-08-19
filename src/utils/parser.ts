import type { ShoppingItem, ItemUnit } from '../types/shopping';

/**
 * Analisa texto de lista (ex: copiado do WhatsApp ou anotações) e converte em itens estruturados
 */
export function parseShoppingText(text: string): Omit<ShoppingItem, 'id' | 'createdAt'>[] {
  if (!text || !text.trim()) return [];

  const lines = text.split('\n');
  const items: Omit<ShoppingItem, 'id' | 'createdAt'>[] = [];

  for (const rawLine of lines) {
    let line = rawLine.trim();
    if (!line) continue;

    // Remover marcadores comuns do WhatsApp/markdown (- , * , • , 1. , 1- , [ ] , [x])
    line = line.replace(/^([*\-•■□]|\[\s*\]|\[x\]|\d+[\.\-\)])\s*/i, '').trim();
    if (!line) continue;

    let quantity = 1;
    let unit: ItemUnit | string = 'un';
    let name = line;
    let notes = '';

    // Tentar extrair anotação entre parênteses no final (ex: "Leite (desnatado)")
    const notesMatch = name.match(/\(([^)]+)\)$/);
    if (notesMatch) {
      const insideParen = notesMatch[1].trim();
      // Verificar se dentro dos parenteses tinha quantidade (ex: "(2 pct)" ou "(1kg)")
      const parenQtyMatch = insideParen.match(/^(\d+(?:[.,]\d+)?)\s*(kg|g|l|ml|pct|cx|dz|un)?$/i);
      if (parenQtyMatch) {
        quantity = parseFloat(parenQtyMatch[1].replace(',', '.'));
        if (parenQtyMatch[2]) {
          unit = normalizeUnit(parenQtyMatch[2]);
        }
      } else {
        notes = insideParen;
      }
      name = name.replace(/\s*\([^)]+\)$/, '').trim();
    }

    // Padrão 1: "2x Leite" ou "2 x Leite" ou "2XLeite"
    const prefixXMatch = name.match(/^(\d+(?:[.,]\d+)?)\s*[xX]\s+(.+)$/);
    if (prefixXMatch) {
      quantity = parseFloat(prefixXMatch[1].replace(',', '.'));
      name = prefixXMatch[2].trim();
    } else {
      // Padrão 2: "2 kg de Arroz" ou "500g Carne" ou "3 pct Biscoito" ou "3 Leite"
      const prefixQtyUnitMatch = name.match(/^(\d+(?:[.,]\d+)?)\s*(kg|g|l|ml|pct|cx|dz|un)?(?:\s+(?:de\s+)?(.+))?$/i);
      if (prefixQtyUnitMatch && prefixQtyUnitMatch[3]) {
        quantity = parseFloat(prefixQtyUnitMatch[1].replace(',', '.'));
        if (prefixQtyUnitMatch[2]) {
          unit = normalizeUnit(prefixQtyUnitMatch[2]);
        }
        name = prefixQtyUnitMatch[3].trim();
      } else {
        // Padrão 3: "Arroz - 2kg" ou "Leite - 3un" ou "Sabão: 2 pct"
        const suffixQtyMatch = name.match(/^(.+?)\s*[-:]\s*(\d+(?:[.,]\d+)?)\s*(kg|g|l|ml|pct|cx|dz|un)?$/i);
        if (suffixQtyMatch) {
          name = suffixQtyMatch[1].trim();
          quantity = parseFloat(suffixQtyMatch[2].replace(',', '.'));
          if (suffixQtyMatch[3]) {
            unit = normalizeUnit(suffixQtyMatch[3]);
          }
        }
      }
    }

    // Capitalizar primeira letra do nome
    if (name.length > 0) {
      name = name.charAt(0).toUpperCase() + name.slice(1);
    }

    if (name) {
      items.push({
        name,
        quantity: isNaN(quantity) || quantity <= 0 ? 1 : quantity,
        unit,
        price: 0,
        checked: false,
        notes: notes || undefined,
      });
    }
  }

  return items;
}

function normalizeUnit(u: string): ItemUnit | string {
  const lower = u.toLowerCase();
  if (['kg', 'quilo', 'quilos'].includes(lower)) return 'kg';
  if (['g', 'grama', 'gramas'].includes(lower)) return 'g';
  if (['l', 'litro', 'litros'].includes(lower)) return 'L';
  if (['ml'].includes(lower)) return 'ml';
  if (['pct', 'pacote', 'pacotes'].includes(lower)) return 'pct';
  if (['cx', 'caixa', 'caixas'].includes(lower)) return 'cx';
  if (['dz', 'duzia', 'duzias'].includes(lower)) return 'dz';
  return 'un';
}

/**
 * Gera texto formatado para envio no WhatsApp
 */
export function formatListForWhatsApp(
  listName: string,
  items: ShoppingItem[],
  totalSpent: number,
  totalEstimated: number,
  budget: number | null
): string {
  let text = `🛒 *Listei! - ${listName}*\n\n`;

  const checked = items.filter((i) => i.checked);
  const pending = items.filter((i) => !i.checked);

  if (checked.length > 0) {
    text += `✅ *Pegos no Carrinho (${checked.length}):*\n`;
    checked.forEach((item) => {
      const subtotal = item.price > 0 ? ` = R$ ${(item.quantity * item.price).toFixed(2).replace('.', ',')}` : '';
      const priceText = item.price > 0 ? ` (R$ ${item.price.toFixed(2).replace('.', ',')}/${item.unit})` : '';
      text += `• ~${item.name}~ - ${item.quantity}${item.unit}${priceText}${subtotal}\n`;
    });
    text += '\n';
  }

  if (pending.length > 0) {
    text += `⏳ *Faltando pegar (${pending.length}):*\n`;
    pending.forEach((item) => {
      const priceText = item.price > 0 ? ` (R$ ${item.price.toFixed(2).replace('.', ',')}/${item.unit})` : '';
      text += `• ${item.name} - ${item.quantity}${item.unit}${priceText}\n`;
    });
    text += '\n';
  }

  text += `━━━━━━━━━━━━━━━━━━━\n`;
  text += `💰 *Total no Carrinho:* R$ ${totalSpent.toFixed(2).replace('.', ',')}\n`;
  if (totalEstimated > totalSpent) {
    text += `📊 *Total Estimado Lista:* R$ ${totalEstimated.toFixed(2).replace('.', ',')}\n`;
  }
  if (budget) {
    text += `🎯 *Orçamento:* R$ ${budget.toFixed(2).replace('.', ',')}\n`;
    const diff = budget - totalSpent;
    if (diff >= 0) {
      text += `🟢 *Restante:* R$ ${diff.toFixed(2).replace('.', ',')}\n`;
    } else {
      text += `🔴 *Ultrapassou:* R$ ${Math.abs(diff).toFixed(2).replace('.', ',')}\n`;
    }
  }
  text += `\nGerado com o app *Listei!* 📝`;

  return text;
}
