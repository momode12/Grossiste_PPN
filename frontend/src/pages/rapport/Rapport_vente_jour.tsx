import { useEffect, useState } from "react";
import { Calendar, TrendingUp } from "lucide-react";
import { getRapportVentesJour } from "@/services/venteService";

export default function RapportVentesJour() {
  const [total, setTotal] = useState(0);
  const [date, setDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getRapportVentesJour()
      .then((data) => {
        if (active) {
          setTotal(data.total ?? 0);
          setDate(data.date ?? null);
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
        <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center">
          <Calendar className="text-indigo-600" size={22} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Rapport des ventes du jour
          </h2>
          <p className="text-slate-500 text-sm">
            Synthèse des ventes journalières
          </p>
        </div>
      </div>

      {/* Carte principale */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 relative overflow-hidden">
        <TrendingUp
          size={100}
          className="absolute right-4 bottom-4 text-indigo-50"
        />

        {loading ? (
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium">Chargement des données...</p>
          </div>
        ) : (
          <>
            <p className="text-sm uppercase tracking-wide text-slate-500 font-medium">
              Chiffre d'affaires
            </p>

            <div className="mt-2 flex items-end gap-2">
              <span className="text-4xl font-extrabold text-indigo-600">
                {total.toLocaleString("fr-FR")}
              </span>
              <span className="text-lg font-semibold mb-1 text-slate-600">Ar</span>
            </div>

            <p className="mt-4 text-sm text-slate-500 flex items-center gap-1.5">
              <Calendar size={14} />
              {formattedDate}
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