import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminHome from "@/pages/dashboard/AdminHome";
import UserHome from "@/pages/dashboard/UserHome";

// Admin pages
import AdminDashboard from "@/pages/Dashboard";
import UsersList from "@/pages/users/UsersList";
import CategoriesList from "@/pages/categories/CategoriesList";
import ArticlesList from "@/pages/articles/ArticlesList";
import StockList from "@/pages/stock/StockList";
import VentesList from "@/pages/ventes/VentesList";
import CaisseList from "@/pages/caisse/CaisseList";
import SettingPage from "@/pages/settings/SettingPage";

// Auth pages
import Login from "@/pages/auth/AdminLogin";
import UserLogin from "@/pages/auth/UserLogin";
import RegisterUser from "@/pages/auth/Register";
import Unauthorized from "@/pages/auth/Unauthorized";

// ✅ Dashboard Rapports (remplace le placeholder)
import DashboardRevenu from "@/pages/rapport/Dashboard_revenu";

// Wrapper pour UserHome qui récupère les infos de l'utilisateur connecté
const UserHomeWrapper: React.FC = () => {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  
  return <UserHome role={user?.role || "caissier"} userId={user?.id || ""} />;
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Pages publiques */}
          <Route path="/login" element={<Login />} />
          <Route path="/user" element={<UserLogin />} />
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Dashboard unifié pour Admin */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminHome />} />
            <Route path="users" element={<UsersList />} />
            <Route path="categories" element={<CategoriesList />} />
            <Route path="articles" element={<ArticlesList />} />
            <Route path="stock" element={<StockList />} />
            <Route path="ventes" element={<VentesList />} />
            <Route path="caisse" element={<CaisseList />} />
            <Route path="rapports" element={<DashboardRevenu />} />
            <Route path="settings" element={<SettingPage />} />
          </Route>

          {/* Dashboard pour Manager / Caissier / Magasinier */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute allowedRoles={["manager", "caissier", "magasinier"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<UserHomeWrapper />} />
            <Route path="articles" element={<ArticlesList />} />
            <Route path="stock" element={<StockList />} />
            <Route path="ventes" element={<VentesList />} />
            <Route path="caisse" element={<CaisseList />} />
            <Route path="rapports" element={<DashboardRevenu />} />
          </Route>

          {/* Page par défaut */}
          <Route path="*" element={<Login />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;