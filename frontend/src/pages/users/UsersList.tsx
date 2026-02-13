import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import DataTable from "@/components/DataTable";
import type { User } from "@/types/user";
import UserEdit from "./UserEdit";
import { getUsers, deleteUser } from "@/services/userService";
import { 
  showSuccess, 
  showError, 
  confirmDelete, 
  showLoading, 
  closeLoading 
} from "@/utils/sweetAlertUtils";

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Récupérer la liste des utilisateurs
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error && 'response' in err
        ? (err as Error & { response?: { data?: { message?: string } } }).response?.data?.message || "Impossible de charger les utilisateurs"
        : "Impossible de charger les utilisateurs";
      showError(errorMessage, "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Supprimer un utilisateur
  const handleDelete = async (user: User) => {
    const result = await confirmDelete(
      `Supprimer ${user.name} ?`,
      "Cette action est irréversible !",
      "Oui, supprimer",
      "Annuler"
    );

    if (result.isConfirmed) {
      try {
        showLoading("Suppression en cours...", "Veuillez patienter");
        await deleteUser(user.id);
        closeLoading();
        showSuccess(`${user.name} supprimé avec succès !`);
        fetchUsers();
      } catch (err: unknown) {
        closeLoading();
        showError(
          err instanceof Error && 'response' in err
            ? (err as Error & { response?: { data?: { message?: string } } }).response?.data?.message || "Impossible de supprimer l'utilisateur"
            : "Impossible de supprimer l'utilisateur",
          "Erreur de suppression"
        );
      }
    }
  };

  // Ouvrir le modal d'édition
  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  // Callback après modification réussie
  const handleUpdateSuccess = () => {
    setIsModalOpen(false);
    fetchUsers();
    showSuccess("Utilisateur modifié avec succès !");
  };

  // Colonnes de la table
  const columns = [
    { key: "id" as keyof User, label: "ID" },
    { key: "name" as keyof User, label: "Nom" },
    { key: "username" as keyof User, label: "Username" },
    { key: "email" as keyof User, label: "Email" },
    { key: "role" as keyof User, label: "Rôle" },
    {
      key: "status" as keyof User,
      label: "Statut",
      render: (user: User) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            user.status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {user.status === "active" ? "Actif" : "Inactif"}
        </span>
      ),
    },
    {
      key: "created_at" as keyof User,
      label: "Créé le",
      render: (user: User) =>
        new Date(user.created_at).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
  ];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Utilisateurs</h1>
          <p className="text-slate-600 mt-1">
            Gérez les utilisateurs de l'application
          </p>
        </div>
      </div>

      {/* Table des utilisateurs */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={users}
          actions={(user) => (
            <>
              <button
                onClick={() => handleEdit(user)}
                className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition"
                title="Modifier"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={() => handleDelete(user)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Supprimer"
              >
                <Trash2 size={18} />
              </button>
            </>
          )}
          emptyMessage="Aucun utilisateur trouvé."
        />
      )}

      {/* Modal d'édition */}
      {editingUser && (
        <UserEdit
          user={editingUser}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
}