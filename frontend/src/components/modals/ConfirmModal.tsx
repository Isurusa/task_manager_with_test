import "./ConfirmModal.css";

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message?: string;
  onCancel: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  cancelText?: string;
  confirmText?: string;
}

function ConfirmModal({
  open,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  onCancel,
  onConfirm,
  isLoading = false,
  cancelText = "Cancel",
  confirmText = "Confirm"
}: ConfirmModalProps) {

  if (!open) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      onCancel();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !isLoading) {
      onCancel();
    }
    if (e.key === 'Enter' && !isLoading) {
      onConfirm();
    }
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-description"
    >
      <div className="modal-box">
        <h3 id="confirm-modal-title">{title}</h3>
        <p id="confirm-modal-description">{message}</p>

        <div className="modal-actions">
          <button 
            className="btn-cancel" 
            onClick={onCancel}
            disabled={isLoading}
            type="button"
          >
            {cancelText}
          </button>
          <button 
            className="btn-confirm" 
            onClick={onConfirm}
            disabled={isLoading}
            type="button"
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Processing...
              </>
            ) : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;