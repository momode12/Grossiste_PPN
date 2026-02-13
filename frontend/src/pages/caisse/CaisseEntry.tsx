import { useState } from "react";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import Modal from "@/components/Modal";
import { createCaisseEntry } from "@/services/caisseService";
import { showSuccess, showError } from "@/utils/sweetAlertUtils";
import type { CaisseType } from "@/types/caisse";

type CaisseEntryProps = {
  onClose: (created?: boolean) => void;
};

export default function CaisseEntry({ onClose }: CaisseEntryProps) {
  const [formData, setFormData] = useState<{
    type: "Entrée" | "Sortie";
    montant: string;
    description: string;
  }>({
    type: "Entrée",
    montant: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.montant || parseFloat(formData.montant) <= 0) {
      showError("Veuillez entrer un montant valide");
      return;
    }

    try {
      setLoading(true);
      
      const montant = parseFloat(formData.montant);
      const montantFinal = formData.type === "Sortie" ? -montant : montant;
      
      // Conversion du type UI vers le type API
      const caisseType: CaisseType = formData.type === "Entrée" ? "recette" : "depense";

      await createCaisseEntry({
        type: caisseType,
        montant: montantFinal,
        description: formData.description || null,
      });

      showSuccess(
        `${formData.type} de ${montant.toFixed(2)} Ar enregistrée avec succès`,
        "Mouvement ajouté !"
      );
      onClose(true);
    } catch (error: any) {
      showError(
        error.response?.data?.message || "Erreur lors de l'enregistrement"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={() => onClose()}
      title="Nouveau mouvement de caisse"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Subtitle intégré dans le formulaire */}
        <p className="text-sm text-slate-600 -mt-2 mb-4">
          Enregistrer une entrée ou sortie d'argent
        </p>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-4">
            Type de mouvement <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: "Entrée" })}
              className={`relative p-6 rounded-2xl border-2 transition-all duration-200 group ${
                formData.type === "Entrée"
                  ? "border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-md"
                  : "border-slate-200 hover:border-green-300 hover:bg-green-50/50"
              }`}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-all ${
                    formData.type === "Entrée"
                      ? "bg-green-500 shadow-lg shadow-green-200"
                      : "bg-slate-100 group-hover:bg-green-100"
                  }`}
                >
                  <TrendingUp
                    size={28}
                    className={
                      formData.type === "Entrée"
                        ? "text-white"
                        : "text-slate-400 group-hover:text-green-600"
                    }
                  />
                </div>
                <p
                  className={`text-lg font-bold mb-1 ${
                    formData.type === "Entrée"
                      ? "text-green-700"
                      : "text-slate-700"
                  }`}
                >
                  Entrée
                </p>
                <p className="text-xs text-slate-500">Argent reçu / Recette</p>
                {formData.type === "Entrée" && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                )}
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: "Sortie" })}
              className={`relative p-6 rounded-2xl border-2 transition-all duration-200 group ${
                formData.type === "Sortie"
                  ? "border-red-500 bg-gradient-to-br from-red-50 to-rose-50 shadow-md"
                  : "border-slate-200 hover:border-red-300 hover:bg-red-50/50"
              }`}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-all ${
                    formData.type === "Sortie"
                      ? "bg-red-500 shadow-lg shadow-red-200"
                      : "bg-slate-100 group-hover:bg-red-100"
                  }`}
                >
                  <TrendingDown
                    size={28}
                    className={
                      formData.type === "Sortie"
                        ? "text-white"
                        : "text-slate-400 group-hover:text-red-600"
                    }
                  />
                </div>
                <p
                  className={`text-lg font-bold mb-1 ${
                    formData.type === "Sortie"
                      ? "text-red-700"
                      : "text-slate-700"
                  }`}
                >
                  Sortie
                </p>
                <p className="text-xs text-slate-500">Argent dépensé / Achat</p>
                {formData.type === "Sortie" && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                )}
              </div>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Montant (Ariary) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <DollarSign size={20} className="text-slate-400" />
            </div>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.montant}
              onChange={(e) =>
                setFormData({ ...formData, montant: e.target.value })
              }
              placeholder="Entrez le montant"
              className="w-full pl-12 pr-16 py-4 text-lg border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-semibold"
              required
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <span className="text-slate-500 font-medium">Ar</span>
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            💡 Le montant sera enregistré comme{" "}
            <span className={formData.type === "Entrée" ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
              {formData.type === "Entrée" ? "positif" : "négatif"}
            </span>{" "}
            automatiquement
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Description{" "}
            <span className="text-slate-400 text-xs font-normal">(optionnel)</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Ex: Vente journalière, Achat fournitures, Salaire employé..."
            rows={4}
            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
          />
          <p className="mt-1 text-xs text-slate-500">
            Décrivez la raison de ce mouvement pour faciliter le suivi
          </p>
        </div>

        <div
          className={`rounded-xl p-5 border-2 ${
            formData.type === "Entrée"
              ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
              : "bg-gradient-to-br from-red-50 to-rose-50 border-red-200"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {formData.type === "Entrée" ? (
                <TrendingUp className="text-green-600" size={20} />
              ) : (
                <TrendingDown className="text-red-600" size={20} />
              )}
              <p className="text-sm font-semibold text-slate-600">
                Aperçu du mouvement
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                formData.type === "Entrée"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {formData.type}
            </span>
          </div>

          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs text-slate-600 mb-1">Impact sur la caisse</p>
              <p className="font-medium text-slate-700">
                {formData.description || "Sans description"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-600 mb-1">Montant</p>
              <p
                className={`text-3xl font-bold ${
                  formData.type === "Entrée" ? "text-green-600" : "text-red-600"
                }`}
              >
                {formData.type === "Sortie" && "-"}
                {formData.montant || "0.00"}
                <span className="text-lg ml-1">Ar</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => onClose()}
            disabled={loading}
            className="flex-1 px-6 py-3.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-semibold disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading || !formData.montant}
            className="flex-1 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Enregistrement...
              </>
            ) : (
              <>
                <DollarSign size={20} />
                Enregistrer le mouvement
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-center text-slate-500 pt-2">
          ℹ️ Le mouvement sera immédiatement visible dans l'historique de caisse
        </p>
      </form>
    </Modal>
  );
}