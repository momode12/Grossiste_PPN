import React, { useEffect, useState } from "react";
import { Trash2, Eye, RefreshCw, Plus, Wallet, AlertCircle } from "lucide-react";
import DataTable from "@/components/DataTable";
import { getCaisseEntries, deleteCaisseEntry } from "@/services/caisseService";
import CaisseEntry from "./CaisseEntry";
import CaisseSummary from "./CaisseSummary";
import { showSuccess, showError, confirmAction } from "@/utils/sweetAlertUtils";
import Swal from "sweetalert2";
import type { Caisse } from "@/types/caisse";

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (item: T) => React.ReactNode;
}

export default function CaisseList() {
  const [caisses, setCaisses] = useState<Caisse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showEntryModal, setShowEntryModal] = useState(false);

  // Récupérer les données
  const fetchCaisses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCaisseEntries();
      setCaisses(data);
    } catch (err) {
      console.error("Erreur récupération caisses:", err);
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
      setError(errorMessage);
      showError(errorMessage, "Erreur de chargement");
      setCaisses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCaisseEntries();
        if (active) setCaisses(data);
      } catch (err) {
        if (!active) return;
        console.error("Erreur récupération caisses:", err);
        const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
        setError(errorMessage);
        showError(errorMessage, "Erreur de chargement");
        setCaisses([]);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  // Format date
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleString("fr-FR", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return dateStr;
    }
  };

  // Format montant
  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "decimal",
      minimumFractionDigits: 2,
    }).format(Math.abs(montant));
  };

  // Afficher le type en français
  const getTypeLabel = (type: string) => {
    return type === "recette" ? "Entrée" : "Sortie";
  };

  // Voir les détails
  const handleView = (caisse: Caisse) => {
    const typeLabel = getTypeLabel(caisse.type);
    Swal.fire({
      title: `Détails du mouvement #${caisse.id}`,
      html: `
        <div class="text-left space-y-3">
          <div class="border-b pb-2">
            <p class="text-sm text-gray-500">Date</p>
            <p class="font-semibold">${formatDate(caisse.date)}</p>
          </div>
          <div class="border-b pb-2">
            <p class="text-sm text-gray-500">Type</p>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              caisse.type === "recette"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }">
              ${typeLabel}
            </span>
          </div>
          <div class="border-b pb-2">
            <p class="text-sm text-gray-500">Montant</p>
            <p class="font-semibold text-lg ${
              caisse.montant >= 0 ? "text-green-600" : "text-red-600"
            }">
              ${caisse.montant >= 0 ? "+" : "-"}${formatMontant(caisse.montant)} Ar
            </p>
          </div>
          <div class="border-b pb-2">
            <p class="text-sm text-gray-500">Description</p>
            <p>${
              caisse.description || '<em class="text-gray-400">Non renseignée</em>'
            }</p>
          </div>
        </div>
      `,
      icon: "info",
      confirmButtonColor: "#4f46e5",
      confirmButtonText: "Fermer",
      width: "500px",
    });
  };

  // Supprimer
  const handleDelete = async (caisse: Caisse) => {
    const result = await confirmAction(
      "Supprimer ce mouvement ?",
      "Cette action est irréversible",
      "Oui, supprimer"
    );

    if (result.isConfirmed) {
      try {
        await deleteCaisseEntry(caisse.id);
        showSuccess("Mouvement supprimé avec succès");
        fetchCaisses();
      } catch (error: any) {
        showError(
          error.response?.data?.message || "Erreur lors de la suppression"
        );
      }
    }
  };

  // Colonnes du tableau
  const columns: Column<Caisse>[] = [
    {
      key: "id",
      label: "ID",
      render: (item) => (
        <span className="font-mono text-slate-600">#{item.id}</span>
      ),
    },
    {
      key: "date",
      label: "Date",
      render: (item) => (
        <span className="text-slate-700">{formatDate(item.date)}</span>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (item) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            item.type === "recette"
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          {getTypeLabel(item.type)}
        </span>
      ),
    },
    {
      key: "montant",
      label: "Montant",
      render: (item) => (
        <span
          className={`font-semibold ${
            item.montant >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {item.montant >= 0 ? "+" : "-"}
          {formatMontant(item.montant)} Ar
        </span>
      ),
    },
    {
      key: "description",
      label: "Description",
      render: (item) =>
        item.description ? (
          <span className="text-slate-700">{item.description}</span>
        ) : (
          <em className="text-slate-400">Non renseignée</em>
        ),
    },
  ];

  // Calcul des statistiques
  const soldeTotal = caisses.reduce((acc, c) => acc + c.montant, 0);
  const totalEntrees = caisses
    .filter((c) => c.montant > 0)
    .reduce((acc, c) => acc + c.montant, 0);
  const totalSorties = Math.abs(
    caisses.filter((c) => c.montant < 0).reduce((acc, c) => acc + c.montant, 0)
  );
  const nombreMouvements = caisses.length;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Wallet className="text-indigo-600" size={28} />
            Gestion de Caisse
          </h2>
          <p className="text-slate-600 mt-1">
            Suivi des entrées et sorties de caisse
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={fetchCaisses}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium shadow-sm hover:bg-slate-50 transition-all disabled:opacity-50"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            Actualiser
          </button>

          <button
            onClick={() => setShowEntryModal(true)}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all"
          >
            <Plus size={20} />
            Nouveau mouvement
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <CaisseSummary
        soldeTotal={soldeTotal}
        totalEntrees={totalEntrees}
        totalSorties={totalSorties}
        nombreMouvements={nombreMouvements}
      />

      {/* Gestion des erreurs */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <p className="font-semibold text-red-800">Erreur de chargement</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <button
                onClick={fetchCaisses}
                className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loader */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-slate-600 font-medium">Chargement des données...</p>
          </div>
        </div>
      ) : (
        /* Table */
        <DataTable
          columns={columns}
          data={caisses}
          emptyMessage="Aucun mouvement de caisse trouvé"
          actions={(item) => (
            <>
              <button
                onClick={() => handleView(item)}
                className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                title="Voir"
              >
                <Eye size={18} />
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
      )}

      {/* Modal d'ajout */}
      {showEntryModal && (
        <CaisseEntry
          onClose={(created) => {
            setShowEntryModal(false);
            if (created) fetchCaisses();
          }}
        />
      )}
    </div>
  );
}