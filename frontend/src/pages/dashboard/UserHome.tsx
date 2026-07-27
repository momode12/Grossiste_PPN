import React, { useEffect, useState } from "react";
import {
  getVentesByUser,
  getVentesStats,
} from "@/services/venteService";
import { getUser } from "@/services/userService";
import { getArticles } from "@/services/articleService";
import {
  ShoppingCart,
  Wallet,
  AlertCircle,
  Calendar,
  Package,
  AlertTriangle,
} from "lucide-react";

/* =========================
   TYPES SPÉCIFIQUES À LA PAGE
   ========================= */

interface VenteResume {
  id: number;
  date: string;
  total: number;
  statut: string;
}

interface VenteStats {
  totalVentes?: number;
  totalMontant?: number;
}

interface ArticleResume {
  id: number;
  nom: string;
  stock: number;
  stock_minimum: number;
}

interface UserHomeProps {
  role: "admin" | "manager" | "user" | "caissier" | "magasinier" | string;
  userId: number;
}

/* =========================
   COMPOSANT
   ========================= */

const UserHome: React.FC<UserHomeProps> = ({ role, userId }) => {
  const [ventes, setVentes] = useState<VenteResume[]>([]);
  const [stats, setStats] = useState<VenteStats>({});
  const [articles, setArticles] = useState<ArticleResume[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      return;
    }

    let active = true;

    (async () => {
      setLoading(true);
      setError(null);

      try {
        /* -------- USER INFO -------- */
        const userData = await getUser(userId);
        if (!active) return;
        setUserName(userData.name || userData.username || "Utilisateur");

        /* -------- USER / CAISSIER : ventes personnelles -------- */
        if (role === "user" || role === "caissier") {
          const ventesUser = await getVentesByUser(userId);
          if (!active) return;

          const ventesResume: VenteResume[] = (ventesUser || []).map(
            (v: any) => ({
              id: v.id,
              date: v.date,
              total: v.total,
              statut: v.type ?? "N/A",
            })
          );

          setVentes(ventesResume);
        }

        /* -------- MANAGER / ADMIN : stats globales -------- */
        if (role === "manager" || role === "admin") {
          const statsData = await getVentesStats();
          if (!active) return;
          setStats(statsData || {});
        }

        /* -------- MAGASINIER : état des stocks -------- */
        if (role === "magasinier") {
          const articlesData = await getArticles();
          if (!active) return;
          setArticles(articlesData || []);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des données :", err);
        if (active) {
          setError(
            "Impossible de charger vos données. Vérifiez votre connexion ou réessayez."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [role, userId]);

  /* =========================
     RENDER
     ========================= */

  if (!userId) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-slate-600 font-medium">
              Chargement de votre session...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const articlesStockFaible = articles.filter(
    (a) => a.stock <= a.stock_minimum
  );

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Bienvenue, {userName || "..."} !
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-slate-600 font-medium">Chargement des données...</p>
          </div>
        </div>
      ) : (
        <>
          {/* ===== ADMIN / MANAGER ===== */}
          {(role === "admin" || role === "manager") && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-800">
                Tableau de bord {role === "admin" ? "Administrateur" : "Manager"}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 text-sm">Total des ventes</p>
                      <p className="text-2xl font-bold text-slate-800 mt-1">
                        {stats.totalVentes ?? "—"}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <ShoppingCart className="text-indigo-600" size={24} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 text-sm">Chiffre d'affaires total</p>
                      <p className="text-2xl font-bold text-slate-800 mt-1">
                        {stats.totalMontant
                          ? stats.totalMontant.toLocaleString("fr-FR") + " Ar"
                          : "—"}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Wallet className="text-green-600" size={24} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== USER / CAISSIER ===== */}
          {(role === "user" || role === "caissier") && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-800">
                Vos ventes récentes
              </h2>

              {ventes.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-400">
                  <ShoppingCart size={40} className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm">
                    Vous n'avez pas encore effectué de ventes.
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="text-left px-6 py-3 font-semibold text-slate-600">
                          Date
                        </th>
                        <th className="text-right px-6 py-3 font-semibold text-slate-600">
                          Montant (Ar)
                        </th>
                        <th className="text-center px-6 py-3 font-semibold text-slate-600">
                          Statut
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {ventes.map((vente) => (
                        <tr key={vente.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-slate-700">
                            <div className="flex items-center gap-2">
                              <Calendar size={16} className="text-slate-400" />
                              {vente.date}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right font-semibold text-slate-800">
                            {vente.total.toLocaleString("fr-FR")}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                              {vente.statut}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ===== MAGASINIER ===== */}
          {role === "magasinier" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-800">
                Aperçu des stocks
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 text-sm">Total articles</p>
                      <p className="text-2xl font-bold text-slate-800 mt-1">
                        {articles.length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <Package className="text-indigo-600" size={24} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 text-sm">Stock faible / rupture</p>
                      <p className="text-2xl font-bold text-orange-600 mt-1">
                        {articlesStockFaible.length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <AlertTriangle className="text-orange-600" size={24} />
                    </div>
                  </div>
                </div>
              </div>

              {articlesStockFaible.length > 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-6 py-3 bg-slate-50 border-b border-slate-200">
                    <p className="text-sm font-semibold text-slate-600">
                      Articles à réapprovisionner
                    </p>
                  </div>
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="text-left px-6 py-3 font-semibold text-slate-600">
                          Produit
                        </th>
                        <th className="text-center px-6 py-3 font-semibold text-slate-600">
                          Stock actuel
                        </th>
                        <th className="text-center px-6 py-3 font-semibold text-slate-600">
                          Stock min.
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {articlesStockFaible.map((article) => (
                        <tr key={article.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-800">
                            {article.nom}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                              {article.stock}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center text-slate-600">
                            {article.stock_minimum}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-400">
                  <Package size={40} className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Tous les stocks sont à niveau normal</p>
                </div>
              )}
            </div>
          )}

          {/* ===== AUTRE ===== */}
          {!["admin", "manager", "user", "caissier", "magasinier"].includes(
            role
          ) && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-3">
              <AlertCircle className="text-orange-600" size={20} />
              <p className="text-sm text-orange-700">
                Rôle non reconnu. Accès limité.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserHome;