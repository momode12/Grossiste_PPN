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
    let active = true;

    getArticles()
      .then((data) => {
        if (active) {
          setArticles(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">
          <Package className="text-green-600" size={22} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Rapport des stocks
          </h2>
          <p className="text-slate-500 text-sm">
            État actuel des produits en stock
          </p>
        </div>
      </div>

      {/* Contenu */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="text-slate-500 text-sm">Chargement des stocks...</p>
            </div>
          </div>
        ) : articles.length === 0 ? (
          <div className="p-10 text-center text-slate-400">
            <Package size={40} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">Aucun article trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">
                    Produit
                  </th>
                  <th className="text-center px-6 py-3 font-semibold text-slate-600">
                    Quantité
                  </th>
                  <th className="text-center px-6 py-3 font-semibold text-slate-600">
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

                      <td className="px-6 py-4 text-center font-semibold text-slate-700">
                        {article.stock}
                      </td>

                      <td className="px-6 py-4 text-center">
                        {isLowStock ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                            <AlertTriangle size={14} />
                            Stock faible
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
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
          <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
          Stock normal
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
          Stock faible (≤ 5)
        </div>
      </div>
    </div>
  );
}