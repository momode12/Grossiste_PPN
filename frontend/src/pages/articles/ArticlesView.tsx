import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getArticle, deleteArticle } from "@/services/articleService";
import type { Article } from "@/types/article";
import Swal from "sweetalert2";
import { 
  ArrowLeft, Edit, Trash2, Package, Tag, DollarSign, 
  Layers, AlertCircle, Calendar, Box 
} from "lucide-react";

export default function ArticleView() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchArticle(parseInt(id));
    }
  }, [id]);

  const fetchArticle = async (articleId: number) => {
    try {
      setLoading(true);
      const data = await getArticle(articleId);
      setArticle(data);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as Error & { response?: { data?: { error?: string } } }).response?.data?.error || "Article introuvable"
        : "Article introuvable";
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: errorMessage,
        customClass: { popup: "rounded-xl" }
      });
      navigate("/admin/articles");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!article) return;

    const result = await Swal.fire({
      title: "Supprimer l'article ?",
      html: `Voulez-vous vraiment supprimer <strong>${article.nom}</strong> ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
      reverseButtons: true,
      customClass: { popup: "rounded-xl" }
    });

    if (result.isConfirmed) {
      try {
        await deleteArticle(article.id);
        await Swal.fire({
          icon: "success",
          title: "Supprimé !",
          text: "L'article a été supprimé avec succès",
          timer: 2000,
          showConfirmButton: false,
          customClass: { popup: "rounded-xl" }
        });
        navigate("/admin/articles");
      } catch (error: unknown) {
        const errorMessage = error instanceof Error && 'response' in error 
          ? (error as Error & { response?: { data?: { error?: string } } }).response?.data?.error || "Impossible de supprimer l'article"
          : "Impossible de supprimer l'article";
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: errorMessage,
          customClass: { popup: "rounded-xl" }
        });
      }
    }
  };

  const getStockStatus = () => {
    if (!article) return { color: "gray", label: "N/A", icon: AlertCircle };
    
    if (article.stock <= 0) {
      return { 
        color: "red", 
        label: "Rupture de stock", 
        icon: AlertCircle,
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        textColor: "text-red-700"
      };
    } else if (article.stock <= article.stock_minimum) {
      return { 
        color: "orange", 
        label: "Stock faible", 
        icon: AlertCircle,
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        textColor: "text-orange-700"
      };
    }
    return { 
      color: "green", 
      label: "En stock", 
      icon: Box,
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-700"
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Chargement de l'article...</p>
        </div>
      </div>
    );
  }

  if (!article) return null;

  const stockStatus = getStockStatus();
  const StatusIcon = stockStatus.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/articles")}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={24} className="text-slate-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Package className="text-indigo-600" size={28} />
              Détails de l'Article
            </h2>
            <p className="text-slate-600 mt-1">
              Informations complètes sur l'article
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/admin/articles/${article.id}/edit`)}
            className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/30"
          >
            <Edit size={20} />
            Modifier
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-red-500/30"
          >
            <Trash2 size={20} />
            Supprimer
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Article Info Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-2xl flex items-center justify-center">
                <Package size={32} className="text-indigo-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-800">{article.nom}</h3>
                <p className="text-slate-600 mt-1">
                  Créé le {new Date(article.created_at).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <DollarSign size={20} className="text-indigo-600" />
                  </div>
                  <p className="text-sm font-medium text-slate-600">Prix de vente</p>
                </div>
                <p className="text-2xl font-bold text-indigo-600">
                  {article.prix_vente.toLocaleString("fr-FR")} Ar
                </p>
              </div>

              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Tag size={20} className="text-blue-600" />
                  </div>
                  <p className="text-sm font-medium text-slate-600">Unité</p>
                </div>
                <p className="text-2xl font-bold text-slate-800">
                  {article.unite || "N/A"}
                </p>
              </div>

              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Layers size={20} className="text-purple-600" />
                  </div>
                  <p className="text-sm font-medium text-slate-600">Catégorie</p>
                </div>
                <p className="text-xl font-bold text-slate-800">
                  {article.categorie_id ? `Catégorie #${article.categorie_id}` : "Sans catégorie"}
                </p>
              </div>

              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center">
                    <Calendar size={20} className="text-slate-600" />
                  </div>
                  <p className="text-sm font-medium text-slate-600">Date de création</p>
                </div>
                <p className="text-sm font-bold text-slate-800">
                  {new Date(article.created_at).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stock Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h4 className="text-lg font-bold text-slate-800 mb-4">État du Stock</h4>
            
            <div className={`${stockStatus.bgColor} ${stockStatus.borderColor} border-2 rounded-xl p-4 mb-4`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${stockStatus.textColor}`}>Statut</span>
                <StatusIcon className={stockStatus.textColor} size={20} />
              </div>
              <p className={`text-xl font-bold ${stockStatus.textColor}`}>
                {stockStatus.label}
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <p className="text-sm text-slate-600 mb-1">Stock actuel</p>
                <p className="text-3xl font-bold text-slate-800">
                  {article.stock} 
                  <span className="text-lg text-slate-600 ml-2">
                    {article.unite || "unité(s)"}
                  </span>
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <p className="text-sm text-slate-600 mb-1">Stock minimum</p>
                <p className="text-2xl font-bold text-slate-800">
                  {article.stock_minimum}
                  <span className="text-lg text-slate-600 ml-2">
                    {article.unite || "unité(s)"}
                  </span>
                </p>
              </div>

              {article.stock > article.stock_minimum && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-sm text-green-800 font-medium">
                    ✓ Stock suffisant
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    {article.stock - article.stock_minimum} {article.unite || "unité(s)"} au-dessus du minimum
                  </p>
                </div>
              )}

              {article.stock > 0 && article.stock <= article.stock_minimum && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <p className="text-sm text-orange-800 font-medium">
                    ⚠️ Réapprovisionnement conseillé
                  </p>
                  <p className="text-xs text-orange-600 mt-1">
                    Le stock est inférieur ou égal au seuil minimum
                  </p>
                </div>
              )}

              {article.stock <= 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm text-red-800 font-medium">
                    ⛔ Rupture de stock
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    Réapprovisionnement urgent nécessaire
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}