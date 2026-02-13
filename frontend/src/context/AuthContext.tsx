import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export type UserRole = "admin" | "manager" | "caissier" | "magasinier";

export interface User {
  role: UserRole;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (value: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper pour initialiser user à partir du localStorage
const initializeAuth = (): { user: User | null; isAuthenticated: boolean } => {
  const token = localStorage.getItem("access_token");
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return {
        user: { role: payload.role as UserRole, email: payload.email },
        isAuthenticated: true,
      };
    } catch {
      localStorage.removeItem("access_token");
    }
  }
  return { user: null, isAuthenticated: false };
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(() => initializeAuth().user);
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => initializeAuth().isAuthenticated
  );

  // ⚡ Sauvegarder user dans localStorage pour persistance
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const logout = () => {
    const currentRole = user?.role;
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("access_token");

    // Redirection selon rôle
    if (currentRole === "admin") navigate("/login", { replace: true });
    else navigate("/user", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, setUser, setIsAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personnalisé
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within AuthProvider");
  return context;
}
