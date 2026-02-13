import { useState, useEffect } from "react";
import { createCategory, updateCategory } from "@/services/categoryService";
import type { Category } from "@/types/category";
import { showError } from "@/utils/sweetAlertUtils";

interface CategoryFormProps {
  category?: Category | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CategoryForm({
  category,
  onSuccess,
  onCancel,
}: CategoryFormProps) {
  const [nom, setNom] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setNom(category.nom);
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nom.trim()) {
      showError("Le nom de la catégorie est requis");
      return;
    }

    try {
      setLoading(true);

      const data = { nom: nom.trim() };

      if (category) {
        await updateCategory(category.id, data);
      } else {
        await createCategory(data);
      }

      onSuccess();
    } catch (err: unknown) {
      showError(
        err instanceof Error && 'response' in err
          ? (err as Error & { response?: { data?: { message?: string } } }).response?.data?.message ||
            "Une erreur est survenue lors de l'enregistrement"
          : "Une erreur est survenue lors de l'enregistrement"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Champ nom */}
      <div>
        <label
          htmlFor="nom"
          className="block text-sm font-semibold text-slate-700 mb-2"
        >
          Nom de la catégorie <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Ex: Électronique, Vêtements, Alimentation..."
          required
          disabled={loading}
        />
      </div>

      {/* Boutons d'action */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
          disabled={loading}
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Enregistrement...
            </span>
          ) : category ? (
            "Modifier"
          ) : (
            "Créer"
          )}
        </button>
      </div>
    </form>
  );
}