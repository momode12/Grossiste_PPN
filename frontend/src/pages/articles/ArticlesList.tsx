import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getArticles, deleteArticle } from "@/services/articleService";
import type { Article } from "@/types/article";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import { 
  showSuccess, 
  showError, 
  confirmDelete, 
  showLoading, 
  closeLoading 
} from "@/utils/sweetAlertUtils";
import { Plus, Eye, Pencil, Trash2, Package, AlertCircle } from "lucide-react";
import ArticlesCreate from "./ArticlesCreate";
import ArticlesEdit from "./ArticlesEdit";

export default function ArticlesList() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const data = await getArticles();
      setArticles(data);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as Error & { response?: { data?: { error?: string } } }).response?.data?.error || "Impossible de charger les articles"
        : "Impossible de charger les articles";
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (article: Article) => {
    const confirmed = await confirmDelete(
      `Voulez-vous vraiment supprimer <strong>${article.nom}</strong> ?`,
      "Supprimer l'article ?"
    );

    if (confirmed) {
      showLoading("Suppression en cours...");
      try {
        await deleteArticle(article.id);
        closeLoading();
        await showSuccess("L'article a été supprimé avec succès");
        fetchArticles();
      } catch (error: unknown) {
        closeLoading();
        const errorMessage = error instanceof Error && 'response' in error 
          ? (error as Error & { response?: { data?: { error?: string } } }).response?.data?.error || "Impossible de supprimer l'article"
          : "Impossible de supprimer l'article";
        showError(errorMessage);
      }
    }
  };

  const handleSuccess = () => {
    fetchArticles();
  };

  const getStockBadge = (stock: number, stockMin: number) => {
    if (stock <= 0) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
          <AlertCircle size={14} />
          Rupture
        </span>
      );
    } else if (stock <= stockMin) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200">
          <AlertCircle size={14} />
          Stock faible
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
        En stock
      </span>
    );
  };

  const columns = [
    {
      key: "nom" as keyof Article,
      label: "Nom",
      render: (item: Article) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-lg flex items-center justify-center">
            <Package size={16} className="text-indigo-600" />
          </div>
          <span className="font-medium text-slate-800">{item.nom}</span>
        </div>
      )
    },
    {
      key: "prix_vente" as keyof Article,
      label: "Prix de vente",
      render: (item: Article) => (
        <span className="font-semibold text-indigo-600">
          {Math.round(item.prix_vente).toLocaleString("fr-FR")} Ar
        </span>
      )
    },
    {
      key: "stock" as keyof Article,
      label: "Stock",
      render: (item: Article) => (
        <div className="flex flex-col gap-1">
          <span className="font-medium text-slate-700">
            {item.stock} {item.unite || "unité(s)"}
          </span>
          {getStockBadge(item.stock, item.stock_minimum)}
        </div>
      )
    },
    {
      key: "stock_minimum" as keyof Article,
      label: "Stock min.",
      render: (item: Article) => (
        <span className="text-slate-600">
          {item.stock_minimum} {item.unite || "unité(s)"}
        </span>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Chargement des articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Package className="text-indigo-600" size={28} />
            Gestion des Articles
          </h2>
          <p className="text-slate-600 mt-1">
            Gérez vos produits et leur stock
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all"
        >
          <Plus size={20} />
          Nouvel Article
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Total Articles</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{articles.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl flex items-center justify-center">
              <Package className="text-indigo-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Stock faible</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">
                {articles.filter(a => a.stock > 0 && a.stock <= a.stock_minimum).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="text-orange-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Rupture de stock</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {articles.filter(a => a.stock <= 0).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="text-red-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={articles}
        emptyMessage="Aucun article trouvé"
        actions={(item) => (
          <>
            <button
              onClick={() => navigate(`/admin/articles/${item.id}`)}
              className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
              title="Voir"
            >
              <Eye size={18} />
            </button>
            <button
              onClick={() => {
                setSelectedArticle(item);
                setShowEditModal(true);
              }}
              className="p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors"
              title="Modifier"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={() => handleDelete(item)}
              className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
              title="Supprimer"
            >
              <Trash2 size={18} />
            </button>
          </>
        )}
      />

      {/* Create Modal */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Nouvel Article"
        >
          <ArticlesCreate
            onSuccess={() => {
              setShowCreateModal(false);
              handleSuccess();
            }}
          />
        </Modal>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedArticle && (
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Modifier Article"
        >
          <ArticlesEdit
            article={selectedArticle}
            onSuccess={() => {
              setShowEditModal(false);
              handleSuccess();
            }}
          />
        </Modal>
      )}
    </div>
  );
}