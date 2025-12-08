import { useEffect, useRef } from "react";
import "./InfoModal.css";

interface InfoModalProps {
  open: boolean;
  type: "success" | "error" | "info" | "warning";
  message: string;
  onClose: () => void;
  duration?: number;
  title?: string;
  showCloseButton?: boolean;
}

function InfoModal({
  open,
  type = "info",
  message,
  onClose,
  duration = 2500,
  title,
  showCloseButton = true
}: InfoModalProps) {
  const timerRef = useRef<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && duration > 0) {
      timerRef.current = window.setTimeout(() => {
        onClose();
      }, duration);
    }

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [open, duration, onClose]);

  useEffect(() => {
    if (open && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }
  }, [open]);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const getIcon = () => {
    switch (type) {
      case "success": return "✓";
      case "error": return "✗";
      case "warning": return "⚠";
      case "info": return "ℹ";
      default: return "ℹ";
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleClose = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    onClose();
  };

  return (
    <div
      className="info-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="info-modal-title"
      aria-describedby="info-modal-description"
    >
      <div
        ref={modalRef}
        className={`info-box ${type}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="info-header">
          <div className="info-icon">{getIcon()}</div>
          {title && <h3 id="info-modal-title">{title}</h3>}
        </div>

        <p id="info-modal-description" className="info-message">
          {message}
        </p>

        {duration > 0 && (
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{
                animationDuration: `${duration}ms`,
                animationPlayState: open ? 'running' : 'paused'
              }}
            />
          </div>
        )}

        {showCloseButton && (
          <div className="info-actions">
            <button
              className="btn-close"
              onClick={handleClose}
              autoFocus
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default InfoModal;