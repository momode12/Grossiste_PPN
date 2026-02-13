import React, { useEffect, useState } from "react";
import {
  getVentesByUser,
  getVentesStats,
} from "@/services/venteService";
import { getUser } from "@/services/userService";

/* =========================
   TYPES SPÉCIFIQUES À LA PAGE
   ========================= */

interface VenteResume {
  id: number;
  date: string;
  total: number;
  statut: string;
}

interface VenteStats {
  totalVentes?: number;
  totalMontant?: number;
}

interface UserHomeProps {
  role: "admin" | "manager" | "user" | string;
  userId: number;
}

/* =========================
   COMPOSANT
   ========================= */

const UserHome: React.FC<UserHomeProps> = ({ role, userId }) => {
  const [ventes, setVentes] = useState<VenteResume[]>([]);
  const [stats, setStats] = useState<VenteStats>({});
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      try {
        /* -------- USER -------- */
        if (role === "user") {
          const ventesUser = await getVentesByUser(userId);

          const ventesResume: VenteResume[] = ventesUser.map((v: any) => ({
            id: v.id,
            date: v.date,
            total: v.total,
            statut: v.type ?? "N/A",
          }));

          setVentes(ventesResume);
        }

        /* -------- MANAGER / ADMIN -------- */
        if (role === "manager" || role === "admin") {
          const statsData = await getVentesStats();
          setStats(statsData);
        }

        /* -------- USER INFO -------- */
        const userData = await getUser(userId);
        setUserName(
          userData.name || userData.username || "Utilisateur"
        );
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      }
    }

    fetchData();
  }, [role, userId]);

  /* =========================
     RENDER
     ========================= */

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Bienvenue, {userName} !
      </h1>

      {/* ===== ADMIN ===== */}
      {role === "admin" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Tableau de bord Administrateur
          </h2>

          <ul className="list-disc ml-6 mb-6">
            <li>Total des ventes : {stats.totalVentes ?? "Chargement..."}</li>
            <li>
              Chiffre d’affaires total :{" "}
              {stats.totalMontant
                ? stats.totalMontant.toLocaleString() + " Ar"
                : "Chargement..."}
            </li>
          </ul>
        </div>
      )}

      {/* ===== MANAGER ===== */}
      {role === "manager" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Tableau de bord Manager
          </h2>

          <ul className="list-disc ml-6 mb-6">
            <li>Total des ventes : {stats.totalVentes ?? "Chargement..."}</li>
            <li>
              Chiffre d’affaires total :{" "}
              {stats.totalMontant
                ? stats.totalMontant.toLocaleString() + " Ar"
                : "Chargement..."}
            </li>
          </ul>
        </div>
      )}

      {/* ===== USER ===== */}
      {role === "user" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Vos ventes récentes
          </h2>

          {ventes.length === 0 ? (
            <p>Vous n’avez pas encore effectué de ventes.</p>
          ) : (
            <table className="w-full border border-gray-300 border-collapse">
              <thead>
                <tr>
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Montant (Ar)</th>
                  <th className="border p-2">Statut</th>
                </tr>
              </thead>
              <tbody>
                {ventes.map((vente) => (
                  <tr key={vente.id}>
                    <td className="border p-2">{vente.date}</td>
                    <td className="border p-2">
                      {vente.total.toLocaleString()}
                    </td>
                    <td className="border p-2">{vente.statut}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ===== AUTRE ===== */}
      {!["admin", "manager", "user"].includes(role) && (
        <p>Rôle non reconnu. Accès limité.</p>
      )}
    </div>
  );
};

export default UserHome;
