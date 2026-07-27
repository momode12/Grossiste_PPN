import { useEffect, useState } from "react";
import { BarChart3, Calendar } from "lucide-react";
import { getRapportVentesMois } from "@/services/venteService";

interface MoisData {
  mois: string;
  total: number;
}

export default function RapportVentesMois() {
  const [data, setData] = useState<MoisData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getRapportVentesMois()
      .then((res) => {
        if (active) {
          setData(res);
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
        <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
          <BarChart3 className="text-blue-600" size={22} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Rapport des ventes par mois
          </h2>
          <p className="text-slate-500 text-sm">
            Analyse mensuelle du chiffre d'affaires
          </p>
        </div>
      </div>

      {/* Carte tableau */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="text-slate-500 text-sm">
                Chargement des données mensuelles...
              </p>
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="p-10 text-center text-slate-400">
            <BarChart3 size={40} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">Aucune donnée disponible</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">
                    Mois
                  </th>
                  <th className="text-right px-6 py-3 font-semibold text-slate-600">
                    Total (Ar)
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {data.map((m, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-slate-400" />
                        {m.mois}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right font-bold text-indigo-600">
                      {m.total.toLocaleString("fr-FR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Note */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-600">
        Les montants affichés correspondent au chiffre d'affaires total généré
        pour chaque mois, basé sur les ventes validées.
      </div>
    </div>
  );
}