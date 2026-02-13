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
      gradient: "from-indigo-500 to-blue-500",
      bgLight: "bg-indigo-50",
      border: "border-indigo-200",
      text: "text-indigo-700",
    },
    {
      id: "mois" as View,
      label: "Ventes par mois",
      icon: BarChart3,
      gradient: "from-purple-500 to-pink-500",
      bgLight: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-700",
    },
    {
      id: "stock" as View,
      label: "État des stocks",
      icon: Package,
      gradient: "from-green-500 to-emerald-500",
      bgLight: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
    },
    {
      id: "produits" as View,
      label: "Top produits",
      icon: Award,
      gradient: "from-orange-500 to-amber-500",
      bgLight: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-700",
    },
  ];

  const currentView = views.find((v) => v.id === view);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center">
              <BarChart3 className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Dashboard des Rapports
              </h1>
              <p className="text-slate-600">
                Analyse complète de vos performances commerciales
              </p>
            </div>
          </div>
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
                className={`p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                  isActive
                    ? `bg-gradient-to-br ${v.gradient} shadow-lg`
                    : `bg-white border-2 ${v.border}`
                }`}
              >
                <div className="flex flex-col items-center space-y-3">
                  <div
                    className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                      isActive ? "bg-white bg-opacity-20" : v.bgLight
                    }`}
                  >
                    <Icon
                      size={28}
                      className={isActive ? "text-white" : v.text}
                    />
                  </div>
                  <p
                    className={`font-bold ${
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
        <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-xl shadow border">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br ${currentView?.gradient}`}
          >
            {currentView && (
              <currentView.icon className="text-white" size={20} />
            )}
          </div>
          <div>
            <p className="text-xs text-slate-500">Rapport actuel</p>
            <p className="font-bold">{currentView?.label}</p>
          </div>
        </div>

        {/* Contenu */}
        <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {view === "jour" && <RapportVentesJour />}
            {view === "mois" && <RapportVentesMois />}
            {view === "stock" && <RapportStocks />}
            {view === "produits" && (
              <div className="p-12 text-center text-slate-500">
                <Award size={48} className="mx-auto mb-4 text-slate-300" />
                <p className="font-medium">
                  Composant Top Produits à intégrer
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
