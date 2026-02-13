import React from "react";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmation",
  message = "Êtes-vous sûr de vouloir effectuer cette action ?",
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* En-tête */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-5 border-b border-red-100">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          </div>
        </div>

        {/* Contenu */}
        <div className="px-6 py-6">
          <p className="text-slate-700 leading-relaxed">{message}</p>
        </div>

        {/* Boutons d'action */}
        <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition font-medium"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium shadow-sm"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;