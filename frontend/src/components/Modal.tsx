import React, { useEffect } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full";
  showHeader?: boolean;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  maxHeight?: string;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = "md",
  showHeader = true,
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  maxHeight,
  className = "",
  headerClassName = "",
  bodyClassName = ""
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && closeOnEscape) onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, closeOnEscape]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "full": "max-w-[95vw]",
  };

  const handleOverlayClick = () => {
    if (closeOnOverlayClick) onClose();
  };

  const defaultMaxHeight = maxHeight || "90vh";

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay avec flou */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={handleOverlayClick} 
      />

      {/* Conteneur du Modal */}
      <div 
        className={`relative bg-white w-full ${sizeClasses[size]} rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200 ${className}`}
        style={{ maxHeight: defaultMaxHeight }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header conditionnel */}
        {showHeader && (
          <div className={`flex items-center justify-between p-5 border-b border-slate-100 bg-white flex-shrink-0 ${headerClassName}`}>
            <h2 className="text-xl font-bold text-slate-800 truncate">
              {title || "Action"}
            </h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
                aria-label="Fermer"
              >
                <X size={22} />
              </button>
            )}
          </div>
        )}

        {/* Corps du modal */}
        <div className={`flex-1 overflow-y-auto custom-scrollbar ${bodyClassName} ${!showHeader ? 'p-0' : 'p-6'}`}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;