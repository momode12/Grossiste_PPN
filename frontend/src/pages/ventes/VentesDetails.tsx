import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, User, Package, DollarSign, FileText, Printer } from "lucide-react";
import { getVente } from "@/services/venteService";
import { showError } from "@/utils/sweetAlertUtils";
import type { Vente } from "@/types/vente";

interface VenteDetailsProps {
  id?: number;
}

export default function VenteDetails({ id: propId }: VenteDetailsProps) {
  const params = useParams<{ id: string }>();
  const id = propId ?? (params.id ? parseInt(params.id) : undefined);
  const [vente, setVente] = useState<Vente | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadVente();
  }, [id]);

  const loadVente = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await getVente(id);
      setVente(data);
    } catch (error) {
      showError("Erreur lors du chargement de la vente");
      navigate("/dashboard/ventes");
    } finally {
      setLoading(false);
    }
  };

  const imprimerRecu = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!vente) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Vente introuvable</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      {!propId && (
        <div className="flex justify-between items-center print:hidden">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard/ventes")}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Vente #{vente.id.toString().padStart(4, "0")}
              </h1>
              <p className="text-slate-500 mt-1">Détails de la transaction</p>
            </div>
          </div>
          <button
            onClick={imprimerRecu}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <Printer size={20} />
            Imprimer
          </button>
        </div>
      )}

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations générales */}
        <div className="lg:col-span-2 space-y-6">
          {/* En-tête de vente */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <FileText size={24} className="text-indigo-600" />
              Informations
            </h2>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-slate-500 font-medium">Date</label>
                <div className="flex items-center gap-2 mt-2">
                  <Calendar size={18} className="text-slate-400" />
                  <p className="text-slate-800 font-semibold">
                    {new Date(vente.date).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-500 font-medium">Type de vente</label>
                <p className="mt-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {vente.type}
                  </span>
                </p>
              </div>

              <div>
                <label className="text-sm text-slate-500 font-medium">Vendeur</label>
                <div className="flex items-center gap-2 mt-2">
                  <User size={18} className="text-slate-400" />
                  <p className="text-slate-800 font-semibold">
                    ID: {vente.user_id || "N/A"}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-500 font-medium">Nombre d'articles</label>
                <div className="flex items-center gap-2 mt-2">
                  <Package size={18} className="text-slate-400" />
                  <p className="text-slate-800 font-semibold">
                    {vente.items?.length || 0} article(s)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Articles vendus */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Package size={24} className="text-indigo-600" />
              Articles vendus
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
                      Article
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">
                      Quantité
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">
                      Prix unitaire
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {vente.items?.map((item, index) => (
                    <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-800">
                          {item.article?.nom || `Article #${item.article_id}`}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-3 py-1 bg-slate-100 rounded-full font-semibold">
                          {item.quantite}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-700">
                        {parseFloat(item.prix_unitaire.toString()).toFixed(2)} Ar
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-800">
                        {(item.quantite * parseFloat(item.prix_unitaire.toString())).toFixed(2)} Ar
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Résumé */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-fit sticky top-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <DollarSign size={24} className="text-green-600" />
            Résumé
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <span className="text-slate-600">Sous-total</span>
              <span className="font-semibold text-slate-800">
                {parseFloat(vente.total.toString()).toFixed(2)} Ar
              </span>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <span className="text-slate-600">TVA (0%)</span>
              <span className="font-semibold text-slate-800">0.00 Ar</span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-lg font-bold text-slate-800">Total</span>
              <span className="text-2xl font-bold text-green-600">
                {parseFloat(vente.total.toString()).toFixed(2)} Ar
              </span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
              <p className="text-sm text-green-700 font-medium text-center">
                ✓ Vente confirmée
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section d'impression */}
      {!propId && (
        <div className="hidden print:block print:break-before-page">
          <div className="max-w-2xl mx-auto p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">REÇU DE VENTE</h1>
              <p className="text-gray-600">N° {vente.id.toString().padStart(4, "0")}</p>
            </div>

            <div className="mb-6 border-b pb-4">
              <p><strong>Date:</strong> {new Date(vente.date).toLocaleString("fr-FR")}</p>
              <p><strong>Type:</strong> {vente.type}</p>
            </div>

            <table className="w-full mb-6">
              <thead className="border-b-2 border-black">
                <tr>
                  <th className="text-left py-2">Article</th>
                  <th className="text-center py-2">Qté</th>
                  <th className="text-right py-2">P.U</th>
                  <th className="text-right py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {vente.items?.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{item.article?.nom || `Article #${item.article_id}`}</td>
                    <td className="text-center py-2">{item.quantite}</td>
                    <td className="text-right py-2">{parseFloat(item.prix_unitaire.toString()).toFixed(2)}</td>
                    <td className="text-right py-2">
                      {(item.quantite * parseFloat(item.prix_unitaire.toString())).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-right border-t-2 border-black pt-4">
              <p className="text-2xl font-bold">
                TOTAL: {parseFloat(vente.total.toString()).toFixed(2)} Ar
              </p>
            </div>

            <div className="text-center mt-8 text-sm text-gray-600">
              <p>Merci de votre visite !</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
