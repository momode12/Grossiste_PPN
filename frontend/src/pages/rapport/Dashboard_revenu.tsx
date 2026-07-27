import { useState } from "react";
import { Calendar, Package, BarChart3, Award } from "lucide-react";
import RapportVentesJour from "./Rapport_vente_jour";
import RapportVentesMois from "./Rapport_vente_mois";
import RapportStocks from "./Rapport_stock";

type View = "jour" | "mois" | "stock" | "produits";

export default function DashboardRevenu() {
  const [view, setView] = useState<View>("jour");

  const views = [
    {
      id: "jour" as View,
      label: "Ventes du jour",
      icon: Calendar,
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
    {
      id: "mois" as View,
      label: "Ventes par mois",
      icon: BarChart3,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      id: "stock" as View,
      label: "État des stocks",
      icon: Package,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      id: "produits" as View,
      label: "Top produits",
      icon: Award,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  const currentView = views.find((v) => v.id === view);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <BarChart3 className="text-indigo-600" size={28} />
          Dashboard des Rapports
        </h1>
        <p className="text-slate-600 mt-1">
          Analyse complète de vos performances commerciales
        </p>
      </div>

      {/* Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {views.map((v) => {
          const Icon = v.icon;
          const isActive = view === v.id;

          return (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              className={`p-5 rounded-xl border transition-all text-left ${
                isActive
                  ? "bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-500/30"
                  : "bg-white border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isActive ? "bg-white/20" : v.iconBg
                  }`}
                >
                  <Icon
                    size={22}
                    className={isActive ? "text-white" : v.iconColor}
                  />
                </div>
                <p
                  className={`font-semibold ${
                    isActive ? "text-white" : "text-slate-800"
                  }`}
                >
                  {v.label}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Vue active */}
      <div className="flex items-center gap-3 px-5 py-3 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${currentView?.iconBg}`}
        >
          {currentView && (
            <currentView.icon className={currentView.iconColor} size={20} />
          )}
        </div>
        <div>
          <p className="text-xs text-slate-500">Rapport actuel</p>
          <p className="font-semibold text-slate-800">{currentView?.label}</p>
        </div>
      </div>

      {/* Contenu */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {view === "jour" && <RapportVentesJour />}
        {view === "mois" && <RapportVentesMois />}
        {view === "stock" && <RapportStocks />}
        {view === "produits" && (
          <div className="p-12 text-center text-slate-400">
            <Award size={40} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm font-medium">
              Composant Top Produits à intégrer
            </p>
          </div>
        )}
      </div>
    </div>
  );
}