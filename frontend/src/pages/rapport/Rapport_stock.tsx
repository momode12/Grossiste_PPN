import { useEffect, useState } from "react";
import { Package, AlertTriangle, CheckCircle } from "lucide-react";
import { getArticles } from "@/services/articleService";

type Article = {
  id: number;
  nom: string;
  stock: number;
};

export default function RapportStocks() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArticles().then((data) => {
      setArticles(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
          <Package className="text-white" size={22} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Rapport des stocks
          </h2>
          <p className="text-slate-500 text-sm">
            État actuel des produits en stock
          </p>
        </div>
      </div>

      {/* Contenu */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-6 text-slate-500">
            Chargement des stocks...
          </div>
        ) : articles.length === 0 ? (
          <div className="p-6 text-slate-500">
            Aucun article trouvé.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-slate-600">
                    Produit
                  </th>
                  <th className="text-center px-6 py-4 font-semibold text-slate-600">
                    Quantité
                  </th>
                  <th className="text-center px-6 py-4 font-semibold text-slate-600">
                    Statut
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {articles.map((article) => {
                  const isLowStock = article.stock <= 5;

                  return (
                    <tr
                      key={article.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {article.nom}
                      </td>

                      <td className="px-6 py-4 text-center font-semibold">
                        {article.stock}
                      </td>

                      <td className="px-6 py-4 text-center">
                        {isLowStock ? (
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                            <AlertTriangle size={14} />
                            Stock faible
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                            <CheckCircle size={14} />
                            Normal
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Légende */}
      <div className="flex gap-6 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          Stock normal
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          Stock faible (≤ 5)
        </div>
      </div>
    </div>
  );
}
