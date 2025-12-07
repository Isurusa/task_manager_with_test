import type { ReactNode } from 'react';
import './Modal.css';

export interface ModalProps {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
    className?: string;
}

export function BaseModal({ open, onClose, children, className = '' }: ModalProps) {
    if (!open) return null;

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className={`modal-content ${className}`}>
                {children}
            </div>
        </div>
    );
}