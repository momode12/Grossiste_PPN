import { useEffect, useState } from "react";
import { Calendar, TrendingUp } from "lucide-react";
import { getRapportVentesJour } from "@/services/venteService";

export default function RapportVentesJour() {
  const [total, setTotal] = useState(0);
  const [date, setDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRapportVentesJour().then((data) => {
      console.log("Rapport ventes jour:", data);
      setTotal(data.total ?? 0);
      setDate(data.date ?? null);
      setLoading(false);
    });
  }, []);

  const formattedDate = date
    ? new Date(date).toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center shadow-lg">
          <Calendar className="text-white" size={22} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Rapport des ventes du jour
          </h2>
          <p className="text-slate-500 text-sm">
            Synthèse des ventes journalières
          </p>
        </div>
      </div>

      {/* Carte principale */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 shadow-xl text-white relative overflow-hidden">
        {/* Icône décorative */}
        <TrendingUp
          size={120}
          className="absolute right-4 bottom-4 opacity-10"
        />

        {loading ? (
          <p className="text-lg font-medium">Chargement des données...</p>
        ) : (
          <>
            <p className="text-sm uppercase tracking-wide opacity-90">
              Chiffre d’affaires
            </p>

            <div className="mt-2 flex items-end gap-2">
              <span className="text-4xl font-extrabold">
                {total.toLocaleString()}
              </span>
              <span className="text-lg font-semibold mb-1">Ar</span>
            </div>

            <p className="mt-4 text-sm opacity-90">
              📅 {formattedDate}
            </p>
          </>
        )}
      </div>

      {/* Information complémentaire */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-600">
        Ce rapport représente le total des ventes enregistrées pour la journée
        en cours. Les montants sont calculés automatiquement à partir des
        transactions validées.
      </div>
    </div>
  );
}
