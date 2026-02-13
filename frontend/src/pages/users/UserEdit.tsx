import { useState } from "react";
import Modal from "@/components/Modal";
import type { User } from "@/types/user";
import { updateUser } from "@/services/userService";
import { showError, showWarning } from "@/utils/sweetAlertUtils";

interface UserEditProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const UserEdit: React.FC<UserEditProps> = ({ 
  user, 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const [status, setStatus] = useState<User["status"]>(user.status);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    // Validation
    if (status === user.status) {
      showWarning("Aucune modification détectée", "Attention");
      return;
    }

    setLoading(true);
    try {
      await updateUser(user.id, { status });
      onSuccess();
    } catch (err: unknown) {
      showError(
        err instanceof Error && 'response' in err
          ? (err as Error & { response?: { data?: { message?: string } } }).response?.data?.message || "Impossible de mettre à jour l'utilisateur"
          : "Impossible de mettre à jour l'utilisateur",
        "Erreur de modification"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Modifier ${user.name}`}
    >
      <div className="space-y-6">
        {/* Informations utilisateur */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-100">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-slate-600 font-medium">Username</p>
              <p className="text-slate-800">{user.username}</p>
            </div>
            <div>
              <p className="text-slate-600 font-medium">Email</p>
              <p className="text-slate-800">{user.email}</p>
            </div>
            <div>
              <p className="text-slate-600 font-medium">Rôle</p>
              <p className="text-slate-800 capitalize">{user.role}</p>
            </div>
            <div>
              <p className="text-slate-600 font-medium">Statut actuel</p>
              <span
                className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                  user.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {user.status === "active" ? "Actif" : "Inactif"}
              </span>
            </div>
          </div>
        </div>

        {/* Formulaire de modification */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Nouveau statut <span className="text-red-500">*</span>
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as User["status"])}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            disabled={loading}
          >
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
          </select>
          <p className="text-xs text-slate-500 mt-1">
            {status === "active" 
              ? "L'utilisateur pourra se connecter et utiliser l'application" 
              : "L'utilisateur ne pourra plus se connecter"}
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
            disabled={loading}
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={loading || status === user.status}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Enregistrement...
              </span>
            ) : (
              "Enregistrer"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UserEdit;