import { useEffect, useState } from "react";
import { getStockEntries, deleteStockEntry } from "@/services/stockService";
import type { StockEntry } from "@/types/stock";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import StockEntryForm from "./StockEntry";
import { 
  showSuccess, 
  showError, 
  confirmDelete,
  showLoading, 
  closeLoading 
} from "@/utils/sweetAlertUtils";
import { Plus, Package, TrendingUp, Calendar, MessageSquare, Trash2 } from "lucide-react";

export default function StockList() {
  const [entries, setEntries] = useState<StockEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const entriesData = await getStockEntries();
      setEntries(entriesData);
    } catch (error: any) {
      showError(
        error.response?.data?.error || "Impossible de charger les données"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (entry: StockEntry) => {
    const articleName = entry.article?.nom || `Article #${entry.article_id}`;
    const confirmed = await confirmDelete(
      `Voulez-vous vraiment supprimer cette entrée de stock pour <strong>${articleName}</strong> ?`,
      "Supprimer l'entrée ?"
    );

    if (confirmed) {
      showLoading("Suppression en cours...");
      try {
        await deleteStockEntry(entry.id);
        closeLoading();
        await showSuccess("L'entrée de stock a été supprimée");
        fetchData();
      } catch (error: any) {
        closeLoading();
        showError(
          error.response?.data?.error || "Impossible de supprimer l'entrée"
        );
      }
    }
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSuccess = () => {
    handleCloseModal();
    fetchData();
  };

  const columns = [
    {
      key: "article_id" as keyof StockEntry,
      label: "Article",
      render: (item: StockEntry) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-lg flex items-center justify-center">
            <Package size={16} className="text-indigo-600" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-slate-800">
              {item.article?.nom || `Article #${item.article_id}`}
            </span>
            {item.article?.unite && (
              <span className="text-xs text-slate-500">
                Stock actuel: {item.article.stock} {item.article.unite}
              </span>
            )}
          </div>
        </div>
      )
    },
    {
      key: "quantite" as keyof StockEntry,
      label: "Quantité ajoutée",
      render: (item: StockEntry) => (
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-green-600" />
          <span className="font-semibold text-green-600">
            +{item.quantite} {item.article?.unite || ""}
          </span>
        </div>
      )
    },
    {
      key: "date" as keyof StockEntry,
      label: "Date",
      render: (item: StockEntry) => (
        <div className="flex items-center gap-2 text-slate-600">
          <Calendar size={16} />
          <span>
            {new Date(item.date).toLocaleString("fr-FR", {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </span>
        </div>
      )
    },
    {
      key: "user_id" as keyof StockEntry,
      label: "Ajouté par",
      render: (item: StockEntry) => (
        <span className="text-slate-600">
          {item.user?.username || `User #${item.user_id}`}
        </span>
      )
    },
    {
      key: "commentaire" as keyof StockEntry,
      label: "Commentaire",
      render: (item: StockEntry) => (
        item.commentaire ? (
          <div className="flex items-center gap-2 text-slate-600">
            <MessageSquare size={16} />
            <span className="italic">{item.commentaire}</span>
          </div>
        ) : (
          <span className="text-slate-400 italic">Aucun commentaire</span>
        )
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Chargement des entrées de stock...</p>
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
            <TrendingUp className="text-green-600" size={28} />
            Entrées de Stock
          </h2>
          <p className="text-slate-600 mt-1">
            Historique des approvisionnements
          </p>
        </div>
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-medium shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all"
        >
          <Plus size={20} />
          Nouvelle Entrée
        </button>
      </div>

      {/* Stats Card */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm">Total Entrées</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{entries.length}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
            <TrendingUp className="text-green-600" size={24} />
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={entries}
        emptyMessage="Aucune entrée de stock"
        actions={(item) => (
          <button
            onClick={() => handleDelete(item)}
            className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
            title="Supprimer"
          >
            <Trash2 size={18} />
          </button>
        )}
      />

      {/* Modal d'ajout */}
      <Modal 
        isOpen={modalOpen} 
        onClose={handleCloseModal}
        size="md" 
      >
        <StockEntryForm 
          onSuccess={handleSuccess}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
}