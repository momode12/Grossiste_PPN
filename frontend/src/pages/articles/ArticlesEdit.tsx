// ArticlesEdit.tsx
import { useState, useEffect } from "react";
import { updateArticle, getArticle } from "@/services/articleService";
import { showSuccess, showError, showLoading, closeLoading } from "@/utils/sweetAlertUtils";
import type { Article } from "@/types/article";

interface ArticlesEditProps {
  article: Article;
  onSuccess: () => void;
}

export default function ArticlesEdit({ article: initialArticle, onSuccess }: ArticlesEditProps) {
  const [formData, setFormData] = useState<Partial<Article>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticleData = async () => {
      try {
        setLoading(true);
        const freshArticle = await getArticle(initialArticle.id);
        setFormData({
          nom: freshArticle.nom,
          categorie_id: freshArticle.categorie_id,
          prix_vente: freshArticle.prix_vente,
          stock: freshArticle.stock,
          stock_minimum: freshArticle.stock_minimum,
          unite: freshArticle.unite,
        });
      } catch (error: unknown) {
        const errorMessage = error instanceof Error && 'response' in error 
          ? (error as Error & { response?: { data?: { error?: string } } }).response?.data?.error || "Impossible de charger les détails de l'article"
          : "Impossible de charger les détails de l'article";
        showError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchArticleData();
  }, [initialArticle.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "categorie_id" || name === "prix_vente" || name === "stock" || name === "stock_minimum" 
        ? Number(value) 
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    showLoading("Mise à jour en cours...");
    try {
      await updateArticle(initialArticle.id, formData);
      closeLoading();
      await showSuccess("L'article a été mis à jour avec succès");
      onSuccess();
    } catch (error: unknown) {
      closeLoading();
       const errorMessage = error instanceof Error && 'response' in error 
        ? (error as Error & { response?: { data?: { error?: string } } }).response?.data?.error || "Erreur création"
        : "Erreur création";
      showError(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="nom" className="block text-sm font-medium text-slate-700 mb-1">
          Nom
        </label>
        <input
          id="nom"
          name="nom"
          type="text"
          value={formData.nom || ""}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="categorie_id" className="block text-sm font-medium text-slate-700 mb-1">
          Catégorie ID
        </label>
        <input
          id="categorie_id"
          name="categorie_id"
          type="number"
          value={formData.categorie_id || ""}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="prix_vente" className="block text-sm font-medium text-slate-700 mb-1">
          Prix de vente
        </label>
        <input
          id="prix_vente"
          name="prix_vente"
          type="number"
          value={formData.prix_vente || 0}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="stock" className="block text-sm font-medium text-slate-700 mb-1">
          Stock
        </label>
        <input
          id="stock"
          name="stock"
          type="number"
          value={formData.stock || 0}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="stock_minimum" className="block text-sm font-medium text-slate-700 mb-1">
          Stock minimum
        </label>
        <input
          id="stock_minimum"
          name="stock_minimum"
          type="number"
          value={formData.stock_minimum || 0}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="unite" className="block text-sm font-medium text-slate-700 mb-1">
          Unité
        </label>
        <input
          id="unite"
          name="unite"
          type="text"
          value={formData.unite || ""}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <button
        type="submit"
        className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
      >
        Mettre à jour l'article
      </button>
    </form>
  );
}