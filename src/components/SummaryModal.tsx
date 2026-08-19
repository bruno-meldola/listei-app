import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, Share2, CheckCircle2, Copy, Check } from 'lucide-react';
import type { ShoppingList, ListStats } from '../types/shopping';
import { formatCurrency } from '../utils/currency';
import { formatListForWhatsApp } from '../utils/parser';

interface SummaryModalProps {
  isOpen: boolean;
  activeList?: ShoppingList;
  stats: ListStats;
  onClose: () => void;
}

export const SummaryModal: React.FC<SummaryModalProps> = ({
  isOpen,
  activeList,
  stats,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !activeList) return null;

  const {
    totalBudget,
    totalSpent,
    totalEstimated,
    checkedItemsCount,
    pendingItemsCount,
    remainingBudget,
    isOverBudget,
  } = stats;

  const formattedWhatsAppText = formatListForWhatsApp(
    activeList.name,
    activeList.items,
    totalSpent,
    totalEstimated,
    totalBudget
  );

  const handleShareWhatsApp = () => {
    const encoded = encodeURIComponent(formattedWhatsAppText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(formattedWhatsAppText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Erro ao copiar texto:', e);
    }
  };

  const handleCelebrate = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={20} />
            <h2 className="modal-title">Resumo da Compra</h2>
          </div>
          <button type="button" className="btn-icon" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Card Principal de Total */}
          <div
            style={{
              background: 'var(--bg-surface-subtle)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Total no Carrinho
            </span>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {formatCurrency(totalSpent)}
            </span>
            {totalEstimated > totalSpent && (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Estimativa total da lista: {formatCurrency(totalEstimated)}
              </span>
            )}
          </div>

          {/* Grid de Estatísticas */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div
              style={{
                padding: '12px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>ITENS NO CARRINHO</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '2px' }}>
                {checkedItemsCount} de {stats.totalItemsCount}
              </div>
            </div>

            <div
              style={{
                padding: '12px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>FALTANDO PEGAR</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '2px' }}>
                {pendingItemsCount} {pendingItemsCount === 1 ? 'item' : 'itens'}
              </div>
            </div>
          </div>

          {/* Orçamento e Saldo */}
          {totalBudget !== null && (
            <div
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                background: isOverBudget ? 'var(--accent-danger-bg)' : 'var(--accent-success-bg)',
                border: `1px solid ${isOverBudget ? 'var(--accent-danger-border)' : 'var(--accent-success-border)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Orçamento Definido: {formatCurrency(totalBudget)}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {isOverBudget
                    ? 'A compra ultrapassou o teto estipulado!'
                    : 'Dentro do limite planejado! Parabéns!'}
                </div>
              </div>
              <div
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  color: isOverBudget ? 'var(--accent-danger)' : 'var(--accent-success)',
                }}
              >
                {isOverBudget
                  ? `+ ${formatCurrency(Math.abs(remainingBudget || 0))}`
                  : `- ${formatCurrency(remainingBudget || 0)}`}
              </div>
            </div>
          )}

          {/* Botão de Celebração se tudo foi comprado */}
          {checkedItemsCount === stats.totalItemsCount && stats.totalItemsCount > 0 && (
            <button
              type="button"
              className="btn-secondary"
              style={{ width: '100%', borderColor: 'var(--accent-success-border)', background: 'var(--accent-success-bg)' }}
              onClick={handleCelebrate}
            >
              🎉 Compras Concluídas! Soltar Confete
            </button>
          )}

          {/* Prévia da Mensagem para WhatsApp */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                MENSAGEM FORMATADA PARA O WHATSAPP
              </span>
              <button
                type="button"
                className="btn-icon"
                style={{ width: '28px', height: '28px' }}
                onClick={handleCopyText}
                title="Copiar texto"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
            <pre
              style={{
                fontSize: '0.8rem',
                padding: '10px',
                background: 'var(--bg-surface-subtle)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                whiteSpace: 'pre-wrap',
                fontFamily: 'inherit',
                maxHeight: '140px',
                overflowY: 'auto',
              }}
            >
              {formattedWhatsAppText}
            </pre>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={handleCopyText}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? 'Copiado!' : 'Copiar'}</span>
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={handleShareWhatsApp}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Share2 size={16} />
            <span>Enviar no WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
