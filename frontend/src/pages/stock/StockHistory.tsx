import { useEffect, useState } from "react";
import { getStockEntries } from "@/services/stockService";
import type { StockEntry } from "@/types/stock";
import DataTable from "@/components/DataTable";
import { showError } from "@/utils/sweetAlertUtils";
import { 
  History, 
  Package, 
  TrendingUp, 
  Calendar, 
  MessageSquare, 
  User 
} from "lucide-react";

export default function StockHistory() {
  const [entries, setEntries] = useState<StockEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const data = await getStockEntries();
      setEntries(data);
    } catch (error: any) {
      showError(
        error.response?.data?.error || "Impossible de charger l'historique des stocks"
      );
    } finally {
      setLoading(false);
    }
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
        <div className="flex items-center gap-2 text-slate-600">
          <User size={16} />
          <span>{item.user?.username || `User #${item.user_id}`}</span>
        </div>
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
          <p className="text-slate-600 font-medium">Chargement de l'historique...</p>
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
            <History className="text-indigo-600" size={28} />
            Historique des Stocks
          </h2>
          <p className="text-slate-600 mt-1">
            Consultez l'historique complet des mouvements de stock
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Total Entrées</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{entries.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl flex items-center justify-center">
              <History className="text-indigo-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Articles concernés</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">
                {new Set(entries.map(e => e.article_id)).size}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
              <Package className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Total Quantité Ajoutée</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                +{entries.reduce((sum, e) => sum + e.quantite, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={entries}
        emptyMessage="Aucun historique de stock disponible"
      />
    </div>
  );
}