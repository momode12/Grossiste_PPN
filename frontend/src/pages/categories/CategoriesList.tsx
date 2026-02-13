import { useState, useEffect } from "react";
import { Pencil, Trash2, Plus, Eye } from "lucide-react";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import { getCategories, deleteCategory } from "@/services/categoryService";
import type { Category } from "@/types/category";
import CategoryForm from "./CategoryForm";
import CategoryView from "./CategoryView";
import { 
  showSuccess, 
  showError, 
  confirmDelete, 
  showLoading, 
  closeLoading 
} from "@/utils/sweetAlertUtils";

export default function CategoriesList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error && 'response' in err
        ? (err as Error & { response?: { data?: { message?: string } } }).response?.data?.message || "Erreur lors du chargement des catégories"
        : "Erreur lors du chargement des catégories";
      showError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleView = (category: Category) => {
    setSelectedCategory(category);
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = async (category: Category) => {
    const result = await confirmDelete(
      'Supprimer la catégorie ?',
      `Voulez-vous vraiment supprimer la catégorie "${category.nom}" ?`,
      'Oui, supprimer',
      'Annuler'
    );

    if (result.isConfirmed) {
      try {
        showLoading('Suppression en cours...', 'Veuillez patienter');
        await deleteCategory(category.id);
        closeLoading();
        await loadCategories();
        showSuccess('Catégorie supprimée avec succès !');
      } catch (err: unknown) {
        closeLoading();
        showError(
          err instanceof Error && 'response' in err
            ? (err as Error & { response?: { data?: { message?: string } } }).response?.data?.message || 'Erreur lors de la suppression de la catégorie'
            : 'Erreur lors de la suppression de la catégorie'
        );
        console.error(err);
      }
    }
  };

  const handleFormSuccess = async () => {
    setIsModalOpen(false);
    await loadCategories();
    showSuccess(
      selectedCategory 
        ? 'Catégorie modifiée avec succès !' 
        : 'Catégorie créée avec succès !'
    );
  };

  const columns = [
    {
      key: "id" as keyof Category,
      label: "ID",
    },
    {
      key: "nom" as keyof Category,
      label: "Nom de la catégorie",
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Catégories</h1>
          <p className="text-slate-600 mt-1">
            Gérez les catégories de produits
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus size={20} />
          Nouvelle catégorie
        </button>
      </div>

      {/* Message d'erreur - Supprimé car on utilise SweetAlert2 */}

      {/* Table des catégories */}
      <DataTable
        columns={columns}
        data={categories}
        actions={(category) => (
          <>
            <button
              onClick={() => handleView(category)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
              title="Voir"
            >
              <Eye size={18} />
            </button>
            <button
              onClick={() => handleEdit(category)}
              className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition"
              title="Modifier"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={() => handleDeleteClick(category)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              title="Supprimer"
            >
              <Trash2 size={18} />
            </button>
          </>
        )}
        emptyMessage="Aucune catégorie trouvée. Cliquez sur 'Nouvelle catégorie' pour commencer."
      />

      {/* Modal de création/modification */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCategory ? "Modifier la catégorie" : "Nouvelle catégorie"}
      >
        <CategoryForm
          category={selectedCategory}
          onSuccess={handleFormSuccess}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* Modal de visualisation */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Détails de la catégorie"
      >
        {selectedCategory && <CategoryView category={selectedCategory} />}
      </Modal>
    </div>
  );
}