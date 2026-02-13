import { useEffect, useState } from "react";
import { createArticle } from "@/services/articleService";
import { getCategories } from "@/services/categoryService";
import type { Article } from "@/types/article";
import type { Category } from "@/types/category";
import {
  showSuccess,
  showError,
  showWarning,
  showLoading,
  closeLoading
} from "@/utils/sweetAlertUtils";
import { Package, Tag, DollarSign, Box, TrendingDown, Ruler, Save } from "lucide-react";

export default function ArticleCreate({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nom: "",
    categorie_id: "",
    prix_vente: "",
    stock: "0",
    stock_minimum: "0",
    unite: ""
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch {
      showError("Erreur chargement catégories");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.nom.trim()) {
      showWarning("Nom requis");
      return;
    }

    if (parseFloat(formData.prix_vente) <= 0) {
      showWarning("Prix invalide");
      return;
    }

    showLoading("Création en cours...");
    setLoading(true);

    try {
      const payload: Partial<Article> = {
        nom: formData.nom,
        categorie_id: formData.categorie_id
          ? parseInt(formData.categorie_id)
          : null,
        prix_vente: parseFloat(formData.prix_vente),
        stock: parseInt(formData.stock),
        stock_minimum: parseInt(formData.stock_minimum),
        unite: formData.unite || null,
      };

      await createArticle(payload);
      closeLoading();
      await showSuccess("Article créé");

      if (onSuccess) onSuccess();
    } catch (error: unknown) {
      closeLoading();
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as Error & { response?: { data?: { error?: string } } }).response?.data?.error || "Erreur création"
        : "Erreur création";
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
        <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center">
          <Package className="text-white" size={18} />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-800">Nouvel Article</h3>
          <p className="text-xs text-slate-600">Créer un article</p>
        </div>
      </div>

      {/* Info générale */}
      <div className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-lg p-3 border border-slate-200">
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-7 h-7 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-md flex items-center justify-center">
            <Package size={14} className="text-indigo-600" />
          </div>
          <h4 className="text-xs font-bold text-slate-800">Informations générales</h4>
        </div>

        <div className="space-y-2">
          {/* Nom */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nom <span className="text-red-500">*</span>
            </label>
            <input
              name="nom"
              placeholder="Nom de l'article"
              value={formData.nom}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-xs"
              required
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Tag size={12} />
              Catégorie
            </label>
            <div className="relative">
              <select
                name="categorie_id"
                value={formData.categorie_id}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all appearance-none text-xs"
              >
                <option value="">Sans catégorie</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.nom}</option>
                ))}
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Prix de vente */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <DollarSign size={12} />
              Prix de vente <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="prix_vente"
              placeholder="0.00"
              value={formData.prix_vente}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-xs"
              required
            />
          </div>
        </div>
      </div>

      {/* Stock */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3 border border-blue-200">
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-7 h-7 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-md flex items-center justify-center">
            <Box size={14} className="text-blue-600" />
          </div>
          <h4 className="text-xs font-bold text-slate-800">Gestion du stock</h4>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Stock initial */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Box size={12} />
              Stock initial
            </label>
            <input
              type="number"
              name="stock"
              placeholder="0"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 bg-white border border-blue-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-xs"
            />
          </div>

          {/* Stock minimum */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <TrendingDown size={12} />
              Stock min
            </label>
            <input
              type="number"
              name="stock_minimum"
              placeholder="0"
              value={formData.stock_minimum}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 bg-white border border-blue-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-xs"
            />
          </div>
        </div>

        {/* Unité */}
        <div className="mt-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <Ruler size={12} />
            Unité de mesure
          </label>
          <input
            name="unite"
            placeholder="Ex: kg, L, pièce"
            value={formData.unite}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white border border-blue-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-xs"
          />
        </div>
      </div>

      {/* Bouton submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-md font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs shadow-lg shadow-indigo-500/30"
      >
        {loading ? (
          <>
            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Création...
          </>
        ) : (
          <>
            <Save size={14} />
            Créer l'article
          </>
        )}
      </button>
    </form>
  );
}