import type { Category } from "@/types/category";

interface CategoryViewProps {
  category: Category;
}

export default function CategoryView({ category }: CategoryViewProps) {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-6 border border-indigo-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600 mb-1">ID de la catégorie</p>
            <p className="text-2xl font-bold text-indigo-600">#{category.id}</p>
          </div>
          <div className="bg-white p-3 rounded-full shadow-sm">
            <svg
              className="w-8 h-8 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 border border-slate-200 space-y-4">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Nom de la catégorie
          </p>
          <p className="text-lg font-semibold text-slate-800">{category.nom}</p>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              Catégorie créée le{" "}
              {new Date().toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <svg
            className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">À propos de cette catégorie</p>
            <p className="text-blue-700">
              Cette catégorie peut être utilisée pour classer et organiser vos
              articles. Modifiez ou supprimez-la depuis la liste des catégories.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}