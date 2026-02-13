import { useState, useEffect } from "react";
import { createStockEntry } from "@/services/stockService";
import { getArticles } from "@/services/articleService";
import type { Article } from "@/types/article";
import { 
  showSuccess, 
  showError, 
  showWarning,
  showLoading, 
  closeLoading 
} from "@/utils/sweetAlertUtils";
import { TrendingUp, Package, Save, AlertCircle, Plus, ArrowRight, CheckCircle2 } from "lucide-react";

interface StockEntryProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function StockEntry({ onSuccess, onCancel }: StockEntryProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({
    article_id: "",
    quantite: "",
    commentaire: ""
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const data = await getArticles();
      setArticles(data);
    } catch (error) {
      console.error("Erreur lors du chargement des articles:", error);
      showError("Impossible de charger la liste des articles");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.article_id) {
      showWarning("Veuillez sélectionner un article");
      return;
    }

    if (!formData.quantite || parseInt(formData.quantite) <= 0) {
      showWarning("La quantité doit être supérieure à 0");
      return;
    }

    setSubmitLoading(true);
    showLoading("Ajout de l'entrée de stock...");

    try {
      const stockData = {
        article_id: parseInt(formData.article_id),
        quantite: parseInt(formData.quantite),
        commentaire: formData.commentaire.trim() || null
      };

      await createStockEntry(stockData);
      closeLoading();
      await showSuccess("L'entrée de stock a été ajoutée avec succès");
      
      onSuccess();
    } catch (error: any) {
      closeLoading();
      showError(
        error.response?.data?.message || error.response?.data?.error || "Impossible d'ajouter l'entrée de stock"
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const selectedArticle = articles.find(a => a.id === parseInt(formData.article_id));
  const newStock = selectedArticle && formData.quantite 
    ? selectedArticle.stock + parseInt(formData.quantite) 
    : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Header avec icône */}
      <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
        <div className="w-11 h-11 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
          <TrendingUp className="text-white" size={22} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">Nouvelle Entrée de Stock</h3>
          <p className="text-xs text-slate-600">Ajouter du stock à votre inventaire</p>
        </div>
      </div>

      {/* Sélection de l'article */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-4 border border-slate-200">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-lg flex items-center justify-center">
            <Package size={16} className="text-indigo-600" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">Sélection de l'article</h4>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Article à approvisionner <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="article_id"
                value={formData.article_id}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-white border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all appearance-none cursor-pointer font-medium text-slate-700 text-sm"
                required
              >
                <option value="">── Choisir un article ──</option>
                {articles.map(article => (
                  <option key={article.id} value={article.id}>
                    {article.nom} 
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Info article sélectionné */}
          {selectedArticle && (
            <div className={`rounded-lg p-3 border-2 transition-all duration-300 ${
              selectedArticle.stock <= selectedArticle.stock_minimum
                ? "bg-gradient-to-br from-orange-50 to-red-50 border-orange-300"
                : "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300"
            }`}>
              <div className="flex items-start gap-2.5">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  selectedArticle.stock <= selectedArticle.stock_minimum
                    ? "bg-gradient-to-br from-orange-400 to-red-400"
                    : "bg-gradient-to-br from-indigo-500 to-blue-500"
                }`}>
                  {selectedArticle.stock <= selectedArticle.stock_minimum ? (
                    <AlertCircle size={20} className="text-white" />
                  ) : (
                    <Package size={20} className="text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 text-sm mb-1">{selectedArticle.nom}</p>
                  {selectedArticle.stock <= selectedArticle.stock_minimum && (
                    <span className="inline-block px-2 py-0.5 bg-orange-500 text-white text-xs font-bold rounded-full mb-1.5">
                      ALERTE STOCK
                    </span>
                  )}
                  <div className="grid grid-cols-2 gap-2 mt-1.5">
                    <div className="bg-white/70 backdrop-blur-sm rounded-lg p-2 border border-white/40">
                      <p className="text-xs text-slate-600 font-medium mb-0.5">Stock actuel</p>
                      <p className={`text-base font-bold ${
                        selectedArticle.stock <= selectedArticle.stock_minimum
                          ? "text-orange-600"
                          : "text-slate-800"
                      }`}>
                        {selectedArticle.stock}
                        <span className="text-xs ml-1 text-slate-600">{selectedArticle.unite || "unité(s)"}</span>
                      </p>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm rounded-lg p-2 border border-white/40">
                      <p className="text-xs text-slate-600 font-medium mb-0.5">Stock minimum</p>
                      <p className="text-base font-bold text-slate-800">
                        {selectedArticle.stock_minimum}
                        <span className="text-xs ml-1 text-slate-600">{selectedArticle.unite || "unité(s)"}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quantité et calcul */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
            <Plus size={16} className="text-green-600" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">Détails de l'ajout</h4>
        </div>

        <div className="space-y-3">
          {/* Quantité à ajouter */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Quantité à ajouter <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                name="quantite"
                value={formData.quantite}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2.5 bg-white border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all font-semibold text-slate-700 text-sm"
                placeholder="0"
                required
              />
              {selectedArticle && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium text-sm">
                  {selectedArticle.unite || "unité(s)"}
                </div>
              )}
            </div>
          </div>

          {/* Calcul visuel */}
          {selectedArticle && formData.quantite && (
            <div className="bg-white rounded-lg p-3 border border-green-300">
              <div className="flex items-center justify-between gap-2">
                {/* Stock actuel */}
                <div className="flex-1 text-center">
                  <p className="text-xs text-slate-600 font-medium mb-1">Stock actuel</p>
                  <div className="bg-slate-50 rounded-lg p-2">
                    <p className="text-xl font-bold text-slate-800">
                      {selectedArticle.stock}
                    </p>
                    <p className="text-xs text-slate-500">{selectedArticle.unite || "unités"}</p>
                  </div>
                </div>

                {/* Icône plus */}
                <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                  <Plus size={18} className="text-white font-bold" />
                </div>

                {/* Quantité ajoutée */}
                <div className="flex-1 text-center">
                  <p className="text-xs text-green-600 font-medium mb-1">Ajout</p>
                  <div className="bg-green-50 rounded-lg p-2 border border-green-300">
                    <p className="text-xl font-bold text-green-600">
                      +{formData.quantite}
                    </p>
                    <p className="text-xs text-slate-500">{selectedArticle.unite || "unités"}</p>
                  </div>
                </div>

                {/* Flèche */}
                <ArrowRight size={18} className="text-green-600 flex-shrink-0" />

                {/* Nouveau stock */}
                <div className="flex-1 text-center">
                  <p className="text-xs text-slate-600 font-medium mb-1">Nouveau stock</p>
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-2 shadow-md">
                    <p className="text-xl font-bold text-white">
                      {newStock}
                    </p>
                    <p className="text-xs text-green-100">{selectedArticle.unite || "unités"}</p>
                  </div>
                </div>
              </div>

              {/* Message de validation */}
              {newStock && newStock > selectedArticle.stock_minimum && (
                <div className="mt-2 flex items-center gap-1.5 text-green-700 bg-green-100 rounded-lg p-2">
                  <CheckCircle2 size={16} className="flex-shrink-0" />
                  <p className="text-xs font-medium">
                    Le stock sera au-dessus du minimum requis ({selectedArticle.stock_minimum} {selectedArticle.unite})
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Commentaire */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Commentaire (optionnel)
            </label>
            <textarea
              name="commentaire"
              value={formData.commentaire}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all resize-none text-sm"
              placeholder="Ex: Livraison du fournisseur XYZ, Réapprovisionnement mensuel..."
            />
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Ajoutez une note pour tracer l'origine de cet approvisionnement
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2.5 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all font-semibold text-sm"
          disabled={submitLoading}
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={submitLoading}
          className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {submitLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Ajout en cours...
            </>
          ) : (
            <>
              <Save size={16} />
              Ajouter au stock
            </>
          )}
        </button>
      </div>
    </form>
  );
}