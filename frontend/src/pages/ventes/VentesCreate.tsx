import { useState, useEffect } from "react";
import { Plus, Trash2, ShoppingCart, Save, Search, Minus, X, FileText, Printer, Download } from "lucide-react";
import { getArticles } from "@/services/articleService";
import { createVente } from "@/services/venteService";
import { showSuccess, showError, showWarning, confirmAction } from "@/utils/sweetAlertUtils";
import type { Article } from "@/types/article";
import type { PanierItem, VenteType } from "@/types/vente";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type VenteCreateProps = {
  onClose: (venteCreee?: boolean) => void;
};

export default function VenteCreate({ onClose }: VenteCreateProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [panier, setPanier] = useState<PanierItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeVente, setTypeVente] = useState("comptant");
  const [loading, setLoading] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [generatingPDF, setGeneratingPDF] = useState(false);
  

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const data = await getArticles();
      setArticles(data.filter((a: Article) => a.stock > 0));
    } catch (error) {
      showError("Erreur lors du chargement des articles");
    }
  };

  const filteredArticles = articles.filter((article) =>
    article.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ajouterAuPanier = (article: Article) => {
    const existant = panier.find((item) => item.article_id === article.id);

    if (existant) {
      if (existant.quantite >= article.stock) {
        showWarning("Stock insuffisant !");
        return;
      }
      setPanier(
        panier.map((item) =>
          item.article_id === article.id
            ? {
                ...item,
                quantite: item.quantite + 1,
                total: (item.quantite + 1) * item.prix_unitaire,
              }
            : item
        )
      );
    } else {
      setPanier([
        ...panier,
        {
          article_id: article.id,
          nom: article.nom,
          prix_unitaire: article.prix_vente,
          quantite: 1,
          stock_disponible: article.stock,
          total: article.prix_vente,
          unite: article.unite,
        },
      ]);
    }
  };

  const modifierQuantite = (article_id: number, delta: number) => {
    setPanier(
      panier.map((item) => {
        if (item.article_id === article_id) {
          const nouvelleQuantite = Math.max(1, Math.min(item.quantite + delta, item.stock_disponible));
          return {
            ...item,
            quantite: nouvelleQuantite,
            total: nouvelleQuantite * item.prix_unitaire,
          };
        }
        return item;
      })
    );
  };

  const retirerDuPanier = (article_id: number) => {
    setPanier(panier.filter((item) => item.article_id !== article_id));
  };

  const viderPanier = async () => {
    const result = await confirmAction(
      "Vider le panier ?",
      "Tous les articles seront retirés",
      "Oui, vider"
    );
    if (result.isConfirmed) {
      setPanier([]);
      showSuccess("Panier vidé");
    }
  };

  const calculerTotal = () => {
    return panier.reduce((sum, item) => sum + item.total, 0);
  };

  const validerVente = async () => {
    if (panier.length === 0) {
      showWarning("Le panier est vide !");
      return;
    }

    const result = await confirmAction(
      "Confirmer la vente ?",
      `Total: ${calculerTotal().toFixed(2)} Ar`,
      "Confirmer"
    );

    if (result.isConfirmed) {
      try {
        setLoading(true);
        await createVente({
          type: typeVente as VenteType,
          items: panier.map((item) => ({
            article_id: item.article_id,
            quantite: item.quantite,
          })),
        });
        showSuccess("Vente enregistrée avec succès !");
        setLoading(false);
        setShowClientModal(true);
      } catch (error: any) {
        setLoading(false);
        showError(error.response?.data?.message || "Erreur lors de la vente");
      }
    }
  };

  const genererFacturePDF = async () => {
    console.log("génération facture démarrée");
    if (!clientName.trim()) {
      showWarning("Veuillez entrer le nom du client");
      return;
    }

    setGeneratingPDF(true);

    // Création d'un container HTML invisible
    const factureHTML = document.createElement("div");
    factureHTML.style.width = "210mm";
    factureHTML.style.padding = "20px";
    factureHTML.style.backgroundColor = "white";
    factureHTML.style.color = "#000";
    factureHTML.style.position = "fixed";
    factureHTML.style.top = "-9999px";
    factureHTML.innerHTML = `
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #4F46E5; padding-bottom: 20px;">
        <h1 style="margin: 0; font-size: 32px; color: #4F46E5; font-weight: bold;">FACTURE DE VENTE</h1>
        <p style="margin: 8px 0; color: #64748B; font-size: 14px;">N° ${Date.now()}</p>
        <p style="margin: 5px 0; color: #64748B; font-size: 13px;">${new Date().toLocaleDateString("fr-FR")} - ${new Date().toLocaleTimeString("fr-FR")}</p>
      </div>
      
      <div style="display: flex; justify-content: space-between; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #F8FAFC 0%, #E0E7FF 100%); border-radius: 12px; border: 2px solid #E0E7FF;">
        <div style="flex: 1;">
          <h3 style="margin: 0 0 12px 0; color: #4F46E5; font-size: 16px; font-weight: 600;">INFORMATIONS CLIENT</h3>
          <p style="margin: 6px 0; font-size: 14px;"><strong style="color: #475569;">Nom:</strong> <span style="color: #1E293B;">${clientName}</span></p>
          ${clientPhone ? `<p style="margin: 6px 0; font-size: 14px;"><strong style="color: #475569;">Téléphone:</strong> <span style="color: #1E293B;">${clientPhone}</span></p>` : ''}
        </div>
        <div style="flex: 1; text-align: right;">
          <h3 style="margin: 0 0 12px 0; color: #4F46E5; font-size: 16px; font-weight: 600;">DÉTAILS DE VENTE</h3>
          <p style="margin: 6px 0; font-size: 14px;"><strong style="color: #475569;">Type:</strong> <span style="color: #1E293B; text-transform: capitalize;">${typeVente}</span></p>
          <p style="margin: 6px 0; font-size: 14px;"><strong style="color: #475569;">Articles:</strong> <span style="color: #1E293B;">${panier.length} article(s)</span></p>
        </div>
      </div>
      
      <table border="0" cellspacing="0" cellpadding="12" style="width:100%; border-collapse: collapse; margin-top: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <thead>
          <tr style="background: linear-gradient(135deg, #4F46E5 0%, #6366F1 100%);">
            <th style="text-align: left; color: white; font-size: 14px; padding: 14px; border-bottom: 3px solid #4338CA;">Article</th>
            <th style="text-align: center; color: white; font-size: 14px; padding: 14px; border-bottom: 3px solid #4338CA;">Unité</th>
            <th style="text-align: right; color: white; font-size: 14px; padding: 14px; border-bottom: 3px solid #4338CA;">Quantité</th>
            <th style="text-align: right; color: white; font-size: 14px; padding: 14px; border-bottom: 3px solid #4338CA;">Prix Unit. (Ar)</th>
            <th style="text-align: right; color: white; font-size: 14px; padding: 14px; border-bottom: 3px solid #4338CA;">Total (Ar)</th>
          </tr>
        </thead>
        <tbody>
          ${panier
            .map(
              (item, index) => `
            <tr style="background: ${index % 2 === 0 ? '#FFFFFF' : '#F8FAFC'}; border-bottom: 1px solid #E2E8F0;">
              <td style="padding: 12px; font-size: 13px; color: #1E293B;">${item.nom}</td>
              <td style="text-align: center; padding: 12px; font-size: 13px; color: #475569;">${item.unite || "-"}</td>
              <td style="text-align: right; padding: 12px; font-size: 13px; color: #475569; font-weight: 500;">${item.quantite}</td>
              <td style="text-align: right; padding: 12px; font-size: 13px; color: #475569;">${item.prix_unitaire.toFixed(2)}</td>
              <td style="text-align: right; padding: 12px; font-size: 14px; color: #0F172A; font-weight: 600;">${item.total.toFixed(2)}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
        <tfoot>
          <tr style="background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%); border-top: 3px solid #10B981;">
            <td colspan="4" style="text-align: right; font-weight: bold; font-size: 18px; padding: 18px; color: #065F46;">MONTANT TOTAL</td>
            <td style="text-align: right; font-weight: bold; font-size: 22px; color: #059669; padding: 18px;">${calculerTotal().toFixed(2)} Ar</td>
          </tr>
        </tfoot>
      </table>
      
      <div style="margin-top: 50px; padding-top: 20px; border-top: 2px solid #E2E8F0;">
        <div style="text-align: center; color: #64748B; font-size: 13px;">
          <p style="margin: 8px 0; font-weight: 600; color: #4F46E5;">Merci pour votre confiance !</p>
          <p style="margin: 5px 0;">Cette facture a été générée automatiquement</p>
          <p style="margin: 5px 0; font-size: 11px; color: #94A3B8;">Document généré le ${new Date().toLocaleString("fr-FR")}</p>
        </div>
      </div>
    `;
    document.body.appendChild(factureHTML);

    try {
      console.log("html2canvas démarrage...");
      const canvas = await html2canvas(factureHTML, { scale: 2 });
      console.log("html2canvas terminé");
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`facture_${clientName.replace(/\s+/g, "_")}_${Date.now()}.pdf`);
      showSuccess("Facture générée avec succès !");
      setGeneratingPDF(false);
      setShowClientModal(false);
      setPanier([]);
      setClientName("");
      setClientPhone("");
      onClose(true);
    } catch (error) {
      console.error("Erreur lors de la génération PDF:", error);
      showError("Erreur lors de la génération de la facture");
      setGeneratingPDF(false);
    } finally {
      document.body.removeChild(factureHTML);
    }
  };

  const annulerFacture = async () => {
    const result = await confirmAction(
      "Annuler sans facture ?",
      "La vente est enregistrée mais aucune facture ne sera générée",
      "Oui, annuler"
    );
    if (result.isConfirmed) {
      setShowClientModal(false);
      setPanier([]);
      setClientName("");
      setClientPhone("");
      onClose(true);
    }
  };

  return (
    <div className="w-full h-full">
      {/* Grid principal responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
        {/* Articles disponibles - 2 colonnes sur desktop */}
        <div className="lg:col-span-2 bg-slate-50 rounded-xl p-4 flex flex-col">
          {/* Barre de recherche */}
          <div className="mb-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Liste des articles */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {filteredArticles.length === 0 ? (
                <div className="col-span-full text-center py-12 text-slate-400">
                  <ShoppingCart size={48} className="mx-auto mb-3 opacity-50" />
                  <p>Aucun article trouvé</p>
                </div>
              ) : (
                filteredArticles.map((article) => (
                  <button
                    key={article.id}
                    onClick={() => ajouterAuPanier(article)}
                    className="p-3 bg-white border-2 border-slate-200 rounded-xl hover:border-indigo-500 hover:shadow-md transition-all text-left group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-slate-800 group-hover:text-indigo-600 text-sm line-clamp-1">
                        {article.nom}
                      </h3>
                      <Plus
                        size={16}
                        className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      />
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-green-600 font-bold">
                        {article.prix_vente.toFixed(2)} Ar
                      </span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                        {article.stock} {article.unite || ""}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Panier - 1 colonne sur desktop */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col max-h-[70vh] lg:max-h-full">
          {/* Header panier */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <ShoppingCart className="text-indigo-600" size={20} />
              <h2 className="text-lg font-bold text-slate-800">Panier ({panier.length})</h2>
            </div>
            {panier.length > 0 && (
              <button
                onClick={viderPanier}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Vider
              </button>
            )}
          </div>

          {panier.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-8">
              <ShoppingCart size={48} className="mb-3 opacity-50" />
              <p className="text-sm">Panier vide</p>
              <p className="text-xs mt-1">Ajoutez des articles</p>
            </div>
          ) : (
            <>
              {/* Liste des articles du panier */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-2">
                {panier.map((item) => (
                  <div
                    key={item.article_id}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-800 text-sm truncate">{item.nom}</h4>
                        <p className="text-xs text-slate-500">
                          {item.prix_unitaire.toFixed(2)} Ar × {item.quantite}
                        </p>
                      </div>
                      <button
                        onClick={() => retirerDuPanier(item.article_id)}
                        className="ml-2 text-red-500 hover:text-red-700 flex-shrink-0"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => modifierQuantite(item.article_id, -1)}
                          className="w-7 h-7 bg-white border border-slate-300 rounded flex items-center justify-center hover:bg-slate-100"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center font-semibold text-sm">{item.quantite}</span>
                        <button
                          onClick={() => modifierQuantite(item.article_id, 1)}
                          className="w-7 h-7 bg-white border border-slate-300 rounded flex items-center justify-center hover:bg-slate-100"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="font-bold text-green-600 text-sm">{item.total.toFixed(2)} Ar</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Type de vente */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">Type de vente</label>
                <select
                  value={typeVente}
                  onChange={(e) => setTypeVente(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="comptant">Comptant</option>
                  <option value="credit">Crédit</option>
                </select>
              </div>

              {/* Total et validation */}
              <div className="pt-3 border-t border-slate-200 space-y-3">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700">Total</span>
                    <span className="text-2xl font-bold text-green-600">{calculerTotal().toFixed(2)} Ar</span>
                  </div>
                </div>

                <button
                  onClick={validerVente}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  <Save size={20} />
                  {loading ? "Validation..." : "Valider la vente"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal amélioré pour la facture */}
      {showClientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden animate-fadeIn">
            {/* Header avec gradient */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 relative">
              <button
                onClick={annulerFacture}
                disabled={generatingPDF}
                className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title="Fermer"
              >
                <X size={20} />
              </button>
              
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Génération de facture</h3>
                  <p className="text-sm text-indigo-100">
                    {generatingPDF ? "Création en cours..." : "Informations client"}
                  </p>
                </div>
              </div>

              {/* Barre de progression */}
              <div className="mt-4 h-1 bg-white bg-opacity-30 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-white transition-all duration-700 ${
                    generatingPDF ? "w-full" : "w-1/2"
                  }`}
                />
              </div>
            </div>

            {/* Contenu du modal */}
            <div className="p-6">
              {!generatingPDF ? (
                <>
                  {/* Récapitulatif de la vente */}
                  <div className="mb-6 p-4 bg-gradient-to-br from-slate-50 to-indigo-50 rounded-lg border border-indigo-100">
                    <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <ShoppingCart size={16} className="text-indigo-600" />
                      Récapitulatif de vente
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Articles:</span>
                        <span className="font-medium text-slate-800">{panier.length} article(s)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Type:</span>
                        <span className="font-medium text-slate-800 capitalize">{typeVente}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-indigo-200">
                        <span className="text-slate-700 font-semibold">Total:</span>
                        <span className="font-bold text-green-600 text-lg">{calculerTotal().toFixed(2)} Ar</span>
                      </div>
                    </div>
                  </div>

                  {/* Formulaire client */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Nom du client <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Ex: Jean Dupont"
                        className="w-full border-2 border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        autoFocus
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Téléphone <span className="text-slate-400 text-xs">(optionnel)</span>
                      </label>
                      <input
                        type="tel"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="Ex: +261 34 12 345 67"
                        className="w-full border-2 border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={annulerFacture}
                      className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={genererFacturePDF}
                      disabled={!clientName.trim()}
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                    >
                      <Download size={18} />
                      Générer PDF
                    </button>
                  </div>

                  <p className="text-xs text-slate-500 text-center mt-4">
                    La facture sera téléchargée automatiquement
                  </p>
                </>
              ) : (
                /* État de chargement */
                <div className="py-8 flex flex-col items-center justify-center">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Printer className="text-indigo-600 animate-pulse" size={32} />
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-semibold text-slate-800 mb-2">
                    Génération de la facture...
                  </h4>
                  <p className="text-sm text-slate-600 text-center mb-4">
                    Veuillez patienter pendant la création du document PDF
                  </p>
                  
                  <div className="w-full max-w-xs">
                    <div className="flex justify-between text-xs text-slate-500 mb-2">
                      <span>Préparation du document</span>
                      <span>En cours...</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-600 to-blue-600 animate-pulse w-full"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}