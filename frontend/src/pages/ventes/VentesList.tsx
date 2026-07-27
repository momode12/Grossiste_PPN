import { useState, useEffect } from "react";
import { Eye, Trash2, Calendar, DollarSign, XCircle, Plus } from "lucide-react";
import DataTable from "@/components/DataTable";
import type { Column } from "@/components/DataTable";
import Modal from "@/components/Modal";
import VenteCreate from "./VentesCreate";
import VenteDetails from "./VentesDetails";
import { getVentes, deleteVente, cancelVente } from "@/services/venteService";
import {
  confirmDelete,
  confirmAction,
  showSuccess,
  showError,
} from "@/utils/sweetAlertUtils";
import type { Vente } from "@/types/vente";
import { useAuthContext } from "@/context/AuthContext";

export default function VentesList() {
  const [ventes, setVentes] = useState<Vente[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedVenteId, setSelectedVenteId] = useState<number | null>(null);
  const { user } = useAuthContext();

  const loadVentes = async () => {
    try {
      const data = await getVentes();
      setVentes(data);
    } catch {
      showError("Erreur lors du chargement des ventes");
    }
  };

  // Chargement initial isolé, avec garde contre le setState après démontage
  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const data = await getVentes();
        if (active) setVentes(data);
      } catch {
        if (active) showError("Erreur lors du chargement des ventes");
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const handleDelete = async (id: number) => {
    const result = await confirmDelete(
      "Supprimer cette vente ?",
      "⚠️ Le stock ne sera PAS restauré."
    );

    if (result.isConfirmed) {
      try {
        await deleteVente(id);
        showSuccess("Vente supprimée");
        loadVentes();
      } catch {
        showError("Erreur lors de la suppression");
      }
    }
  };

  const handleCancel = async (id: number) => {
    const result = await confirmAction(
      "Annuler cette vente ?",
      "Le stock sera restauré.",
      "Oui, annuler",
      "Non",
      "warning"
    );

    if (result.isConfirmed) {
      try {
        await cancelVente(id);
        showSuccess("Vente annulée avec succès");
        loadVentes();
      } catch {
        showError("Erreur lors de l'annulation");
      }
    }
  };

  const handleCloseCreateModal = (venteCreee?: boolean) => {
    setShowCreateModal(false);
    if (venteCreee) loadVentes();
  };

  const openDetailModal = (id: number) => {
    setSelectedVenteId(id);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelectedVenteId(null);
    setShowDetailModal(false);
  };

  /* ===== Statistiques ===== */
  const totalVentes = ventes.length;
  const montantTotal = ventes.reduce((sum, v) => sum + Number(v.total), 0);

  /* ===== Colonnes ===== */
  const columns: Column<Vente>[] = [
    {
      key: "id",
      label: "N°",
      render: (vente) => (
        <span className="font-mono font-semibold text-indigo-600">
          #{vente.id.toString().padStart(4, "0")}
        </span>
      ),
    },
    {
      key: "date",
      label: "Date",
      render: (vente) => (
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-slate-400" />
          {new Date(vente.date).toLocaleString("fr-FR")}
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (vente) => (
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
          {vente.type}
        </span>
      ),
    },
    {
      key: "items",
      label: "Articles",
      render: (vente) => `${vente.items?.length || 0} article(s)`,
    },
    {
      key: "total",
      label: "Total",
      render: (vente) => (
        <div className="flex items-center gap-2 font-semibold text-green-600">
          <DollarSign size={16} />
          {Number(vente.total).toFixed(2)} Ar
        </div>
      ),
    },
  ];

  /* ===== Actions pour DataTable ===== */
  const actions = (vente: Vente) => (
    <>
      <button
        onClick={() => openDetailModal(vente.id)}
        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
        title="Voir détails"
      >
        <Eye size={18} />
      </button>

      {["admin", "manager"].includes(user?.role || "") && (
        <button
          onClick={() => handleCancel(vente.id)}
          className="p-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors"
          title="Annuler (restaurer stock)"
        >
          <XCircle size={18} />
        </button>
      )}

      {user?.role === "admin" && (
        <button
          onClick={() => handleDelete(vente.id)}
          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          title="Supprimer définitivement"
        >
          <Trash2 size={18} />
        </button>
      )}
    </>
  );

  return (
    <div className="p-4">
      {/* En-tête avec bouton de création */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">Liste des ventes</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
        >
          <Plus size={18} />
          Nouvelle vente
        </button>
      </div>

      {/* Statistiques */}
      <div className="mb-6 grid grid-cols-2 gap-6 text-center">
        <div className="bg-white p-4 rounded-xl shadow border border-slate-200">
          <p className="text-sm text-slate-500 font-medium">Nombre total de ventes</p>
          <p className="mt-2 text-2xl font-bold text-indigo-700">{totalVentes}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border border-slate-200">
          <p className="text-sm text-slate-500 font-medium">Montant total (Ar)</p>
          <p className="mt-2 text-2xl font-bold text-green-600">{montantTotal.toFixed(2)}</p>
        </div>
      </div>

      <DataTable
        data={ventes}
        columns={columns}
        actions={actions}
        emptyMessage="Aucune vente trouvée"
      />

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Nouvelle vente"
        size="3xl"
      >
        <VenteCreate onClose={handleCloseCreateModal} />
      </Modal>

      <Modal
        isOpen={showDetailModal}
        onClose={closeDetailModal}
        title={`Détail de la vente #${selectedVenteId
          ?.toString()
          .padStart(4, "0")}`}
        size="4xl"
      >
        {selectedVenteId && <VenteDetails id={selectedVenteId} />}
      </Modal>
    </div>
  );
}