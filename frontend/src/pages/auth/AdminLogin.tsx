import { useState } from "react";
import { Shield, Mail, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom"; // ✅ Ajout de Link
import api from "../../services/api";
import { useAuthContext } from "@/context/AuthContext";
import Swal from "sweetalert2";

interface AdminLogin {
  access_token: string;
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { setUser, setIsAuthenticated } = useAuthContext();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post<AdminLogin>("/auth/login", {
        email,
        password,
      });

      const token = response.data.access_token;
      localStorage.setItem("access_token", token);

      // Décoder le payload du token
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role;
      const userId = payload.sub || payload.id || payload.user_id;

      // ✅ Stocker les informations complètes de l'utilisateur
      const userData = {
        id: userId,
        role: role,
        email: payload.email || email,
        nom: payload.nom || "",
        prenom: payload.prenom || "",
      };

      // ✅ Stocker dans localStorage ET dans le contexte
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);

      if (role === "admin") {
        await Swal.fire({
          icon: "success",
          title: "Connexion réussie",
          text: "Bienvenue dans l'espace administrateur.",
          timer: 1500,
          showConfirmButton: false,
        });

        navigate("/admin", { replace: true });
      } else {
        await Swal.fire({
          icon: "error",
          title: "Accès refusé",
          text: "Veuillez utiliser la connexion utilisateur.",
          confirmButtonText: "OK",
        });

        localStorage.clear();
        navigate("/user", { replace: true });
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };

      const message =
        error.response?.data?.message || "Identifiants incorrects.";

      setError(message);

      Swal.fire({
        icon: "error",
        title: "Échec de connexion",
        text: message,
        confirmButtonText: "Réessayer",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 flex items-center justify-center p-3 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mb-3 shadow-xl shadow-blue-500/50 transform hover:scale-105 transition-transform duration-300">
            <Shield className="text-white" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">
            Espace Administrateur
          </h1>
          <p className="text-blue-200 text-sm">
            Connectez-vous pour accéder au panneau d'administration
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl p-5 border border-blue-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-3 flex items-start gap-2 animate-shake">
                <AlertCircle
                  className="text-red-500 flex-shrink-0 mt-0.5"
                  size={18}
                />
                <p className="text-xs text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-700">
                Adresse email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail
                    className={`transition-colors duration-200 ${
                      focusedField === "email"
                        ? "text-blue-500"
                        : "text-gray-400"
                    }`}
                    size={16}
                  />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="admin@example.com"
                  required
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border-2 border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200 text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-700">
                Mot de passe
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock
                    className={`transition-colors duration-200 ${
                      focusedField === "password"
                        ? "text-blue-500"
                        : "text-gray-400"
                    }`}
                    size={16}
                  />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-10 py-2.5 text-sm bg-gray-50 border-2 border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200 text-gray-900 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-500 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2.5 rounded-lg text-sm font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:from-blue-700 hover:to-blue-600 focus:ring-4 focus:ring-blue-500/50 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Connexion en cours...</span>
                </>
              ) : (
                <>
                  <Shield size={16} />
                  <span>Se connecter</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-5 text-center space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-gray-500 font-medium">
                  Ou
                </span>
              </div>
            </div>

            {/* ✅ CORRECTION : Utiliser <Link> au lieu de <a> */}
            <Link
              to="/user"
              className="inline-flex items-center justify-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-semibold hover:underline decoration-2 underline-offset-4 transition-all duration-200"
            >
              <span>Connexion utilisateur</span>
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Info */}
        <div className="mt-4 text-center">
          <p className="text-xs text-blue-200 font-medium bg-blue-900/30 backdrop-blur-sm rounded-lg py-2 px-3 border border-blue-800/30">
             Accès réservé aux administrateurs système uniquement!
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}