import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext"; // ✅ CORRECT


interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuthContext();

  // 🔒 NON AUTHENTIFIÉ
  if (!isAuthenticated) {
    // Si la route est réservée à l’admin → login admin
    if (allowedRoles?.includes("admin")) {
      return <Navigate to="/login" replace />;
    }

    // Sinon → login user
    return <Navigate to="/user" replace />;
  }

  // 🔐 AUTHENTIFIÉ MAIS RÔLE NON AUTORISÉ
  if (allowedRoles && !allowedRoles.includes(user!.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ AUTORISÉ
  return <>{children}</>;
};

export default ProtectedRoute;
