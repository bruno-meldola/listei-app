import React from 'react';
import CloseRounded from '@mui/icons-material/CloseRounded';
import RestartAltRounded from '@mui/icons-material/RestartAltRounded';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';

interface ResetListModalProps {
  isOpen: boolean;
  listName: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const ResetListModal: React.FC<ResetListModalProps> = ({
  isOpen,
  listName,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <WarningAmberRounded style={{ fontSize: 22, color: 'var(--accent-warning)' }} />
            <h2 className="modal-title">Tem certeza que deseja resetar a lista?</h2>
          </div>
          <button type="button" className="btn-icon" onClick={onClose} aria-label="Fechar">
            <CloseRounded style={{ fontSize: 20 }} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Você está prestes a resetar a lista <strong>"{listName}"</strong>.
          </p>

          <div
            style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface-subtle)',
              border: '1.5px solid var(--border-medium)',
              fontSize: '0.88rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
              O que acontecerá:
            </div>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)' }}>
              <li>Todos os preços unitários e o total da compra serão zerados.</li>
              <li>Todas as caixas de seleção marcadas serão desmarcadas.</li>
              <li><strong>Seus produtos e quantidades permanecerão intactos</strong> na lista para a próxima ida ao mercado.</li>
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="button"
            className="btn-danger"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            <RestartAltRounded style={{ fontSize: 18 }} />
            <span>Sim, Resetar Lista</span>
          </button>
        </div>
      </div>
    </div>
  );
};
