import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";

type CaisseSummaryProps = {
  soldeTotal: number;
  totalEntrees: number;
  totalSorties: number;
  nombreMouvements: number;
};

export default function CaisseSummary({
  soldeTotal,
  totalEntrees,
  totalSorties,
  nombreMouvements,
}: CaisseSummaryProps) {
  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(montant);
  };

  const stats = [
    {
      label: "Solde Total",
      value: soldeTotal,
      icon: DollarSign,
      color: soldeTotal >= 0 ? "green" : "red",
      gradient: soldeTotal >= 0
        ? "from-green-50 to-emerald-50"
        : "from-red-50 to-rose-50",
      borderColor: soldeTotal >= 0 ? "border-green-200" : "border-red-200",
      textColor: soldeTotal >= 0 ? "text-green-600" : "text-red-600",
      iconBg: soldeTotal >= 0 ? "bg-green-100" : "bg-red-100",
    },
    {
      label: "Total Entrées",
      value: totalEntrees,
      icon: TrendingUp,
      color: "green",
      gradient: "from-green-50 to-emerald-50",
      borderColor: "border-green-200",
      textColor: "text-green-600",
      iconBg: "bg-green-100",
    },
    {
      label: "Total Sorties",
      value: totalSorties,
      icon: TrendingDown,
      color: "red",
      gradient: "from-red-50 to-rose-50",
      borderColor: "border-red-200",
      textColor: "text-red-600",
      iconBg: "bg-red-100",
    },
    {
      label: "Nombre de mouvements",
      value: nombreMouvements,
      icon: Activity,
      color: "blue",
      gradient: "from-blue-50 to-indigo-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-600",
      iconBg: "bg-blue-100",
      isCount: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`bg-gradient-to-br ${stat.gradient} rounded-xl p-5 border ${stat.borderColor} shadow-sm hover:shadow-md transition-shadow`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`${stat.iconBg} p-3 rounded-lg`}>
              <stat.icon className={stat.textColor} size={24} />
            </div>
            {index === 0 && (
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  soldeTotal >= 0
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {soldeTotal >= 0 ? "Positif" : "Négatif"}
              </span>
            )}
          </div>
          
          <div>
            <p className="text-sm text-slate-600 font-medium mb-1">
              {stat.label}
            </p>
            <p className={`text-2xl font-bold ${stat.textColor}`}>
              {stat.isCount
                ? stat.value
                : `${formatMontant(Math.abs(stat.value))} Ar`}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}