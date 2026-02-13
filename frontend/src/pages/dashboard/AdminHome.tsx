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
    async function fetchData() {
      try {
        const [ventesJour, ventesMois, users, articles] = await Promise.all([
          getRapportVentesJour(),
          getRapportVentesMois(),
          getUsers(),
          getArticles(),
        ]);

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
      } catch (err) {
        setError("Erreur lors du chargement des données.");
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Chargement du dashboard...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-8">Bienvenue sur le Dashboard Admin</h1>

      {/* Cartes KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 text-indigo-700 shadow-sm">
          <h2 className="font-semibold text-lg">Chiffre d’affaires (Jour)</h2>
          <p className="text-2xl font-bold">{kpis?.chiffreAffairesJour.toLocaleString()} Ar</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-purple-700 shadow-sm">
          <h2 className="font-semibold text-lg">Chiffre d’affaires (Mois)</h2>
          <p className="text-2xl font-bold">{kpis?.chiffreAffairesMois.toLocaleString()} Ar</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-green-700 shadow-sm">
          <h2 className="font-semibold text-lg">Nombre de clients</h2>
          <p className="text-2xl font-bold">{kpis?.nombreClients}</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 text-orange-700 shadow-sm">
          <h2 className="font-semibold text-lg">Nombre de produits</h2>
          <p className="text-2xl font-bold">{kpis?.nombreProduits}</p>
        </div>
      </div>

      {/* Graphique des ventes mensuelles */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="font-semibold text-xl mb-4">Évolution des ventes ce mois-ci</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={ventesMoisData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
