/**
 * Utilitários para formatação e manipulação de moeda brasileira (BRL) e quantidades
 */

export function formatCurrency(value: number): string {
  if (isNaN(value) || value === null || value === undefined) {
    return 'R$ 0,00';
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatShortCurrency(value: number): string {
  if (isNaN(value) || value === null || value === undefined) {
    return '0,00';
  }
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Converte string digitada (ex: "17,50" ou "17.50" ou "1.250,50" ou "17") em número float
 */
export function parseCurrencyInput(input: string | number): number {
  if (typeof input === 'number') return isNaN(input) ? 0 : input;
  if (!input) return 0;
  
  const clean = input.toString().replace(/[^\d.,]/g, '').trim();
  if (!clean) return 0;

  // Se tiver vírgula e ponto (ex: 1.250,50 ou 1,250.50)
  if (clean.includes('.') && clean.includes(',')) {
    const lastComma = clean.lastIndexOf(',');
    const lastDot = clean.lastIndexOf('.');
    if (lastComma > lastDot) {
      // Formato brasileiro: 1.250,50
      const withoutDots = clean.replace(/\./g, '');
      const parsed = parseFloat(withoutDots.replace(',', '.'));
      return isNaN(parsed) ? 0 : parsed;
    } else {
      // Formato americano: 1,250.50
      const withoutCommas = clean.replace(/,/g, '');
      const parsed = parseFloat(withoutCommas);
      return isNaN(parsed) ? 0 : parsed;
    }
  }

  // Se tiver apenas vírgula
  if (clean.includes(',')) {
    const parsed = parseFloat(clean.replace(',', '.'));
    return isNaN(parsed) ? 0 : parsed;
  }

  // Se tiver apenas ponto ou número puro
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
}

export function formatQuantity(qty: number): string {
  if (isNaN(qty) || qty === null || qty === undefined) return '0';
  if (qty % 1 === 0) {
    return qty.toString();
  }
  return qty.toLocaleString('pt-BR', { maximumFractionDigits: 3 });
}
