import { useEffect, useState } from "react";
import {
  getRapportVentesJour,
  getRapportVentesMois,
} from "@/services/venteService";
import { getUsers } from "@/services/userService";
import { getArticles } from "@/services/articleService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Wallet,
  TrendingUp,
  Users,
  Package,
  AlertTriangle,
  BarChart3,
} from "lucide-react";

interface KPIs {
  chiffreAffairesJour: number;
  chiffreAffairesMois: number;
  nombreClients: number;
  nombreProduits: number;
}

interface VenteMois {
  date: string;
  total: number;
}

export default function AdminHome() {
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [ventesMoisData, setVentesMoisData] = useState<VenteMois[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const [ventesJour, ventesMois, users, articles] = await Promise.all([
          getRapportVentesJour(),
          getRapportVentesMois(),
          getUsers(),
          getArticles(),
        ]);

        if (!active) return;

        const chiffreAffairesJour = ventesJour?.total ?? 0;
        const chiffreAffairesMois = ventesMois
          ? ventesMois.reduce((acc: number, cur: VenteMois) => acc + cur.total, 0)
          : 0;
        const nombreClients = users.length;
        const nombreProduits = articles.length;

        setVentesMoisData(ventesMois || []);
        setKpis({
          chiffreAffairesJour,
          chiffreAffairesMois,
          nombreClients,
          nombreProduits,
        });
        setLoading(false);
      } catch {
        if (active) {
          setError("Erreur lors du chargement des données.");
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
          <AlertTriangle size={22} className="flex-shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <BarChart3 className="text-indigo-600" size={28} />
          Tableau de bord
        </h1>
        <p className="text-slate-600 mt-1">
          Vue d'ensemble de votre activité
        </p>
      </div>

      {/* Cartes KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Chiffre d'affaires (Jour)</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">
                {kpis?.chiffreAffairesJour.toLocaleString("fr-FR")} Ar
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl flex items-center justify-center">
              <Wallet className="text-indigo-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Chiffre d'affaires (Mois)</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">
                {kpis?.chiffreAffairesMois.toLocaleString("fr-FR")} Ar
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-indigo-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Nombre de clients</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">
                {kpis?.nombreClients}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
              <Users className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Nombre de produits</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">
                {kpis?.nombreProduits}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center">
              <Package className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Graphique des ventes mensuelles */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
        <h2 className="font-semibold text-lg text-slate-800 mb-4">
          Évolution des ventes ce mois-ci
        </h2>
        {ventesMoisData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <TrendingUp size={40} className="mb-3 opacity-50" />
            <p className="text-sm">Aucune donnée de vente pour ce mois</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ventesMoisData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="date" stroke="#64748B" fontSize={12} />
              <YAxis stroke="#64748B" fontSize={12} />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
                formatter={(value: number | undefined) => [
                  `${(value ?? 0).toLocaleString("fr-FR")} Ar`,
                  "Total",
                ]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                name="Ventes"
                stroke="#4F46E5"
                strokeWidth={2}
                dot={{ r: 3, fill: "#4F46E5" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}