import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import Swal from "sweetalert2";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  AtSign,
  Eye,
  EyeOff,
  Briefcase,
  ShoppingCart,
  Package,
} from "lucide-react";

interface RegisterData {
  name: string;
  username: string;
  email: string;
  password: string;
  role: "manager" | "caissier" | "magasinier";
}

export default function RegisterUser() {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterData>({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "manager",
  });

  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Vérifier que les mots de passe correspondent
    if (form.password !== confirmPassword) {
      await Swal.fire({
        icon: "error",
        title: "Erreur de validation",
        text: "Les mots de passe ne correspondent pas",
        confirmButtonColor: "#3b82f6",
        customClass: {
          popup: "rounded-xl shadow-2xl",
          title: "text-xl font-bold",
          confirmButton: "px-6 py-2.5 rounded-lg font-medium",
        },
      });
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", form);

      await Swal.fire({
        icon: "success",
        title: "Inscription réussie",
        html: `
    <p>Votre compte a été créé avec succès.</p>
    <p style="margin-top:8px; font-weight:600;">
      Veuillez attendre la validation de votre compte par un administrateur avant de pouvoir vous connecter!
    </p>
  `,
        confirmButtonColor: "#3b82f6",
        confirmButtonText: "Compris",
      });

      // ✅ Redirection après fermeture automatique
      navigate("/user");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage =
        error.response?.data?.message ||
        "Une erreur est survenue lors de l'inscription";

      await Swal.fire({
        icon: "error",
        title: "Échec de l'inscription",
        text: errorMessage,
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  const roleIcons = {
    manager: Briefcase,
    caissier: ShoppingCart,
    magasinier: Package,
  };

  const roleDescriptions = {
    manager: "Gestion complète",
    caissier: "Gestion ventes",
    magasinier: "Gestion stocks",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 to-purple-950 flex items-center justify-center p-3 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="w-full max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center mb-2.5">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-2 shadow-xl shadow-blue-500/50">
            <UserPlus className="text-white" size={22} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">
            Créer un compte
          </h1>
          <p className="text-blue-200 text-xs">
            Rejoignez-nous et commencez votre expérience
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-white/95 backdrop-blur-lg rounded-lg shadow-2xl p-5 border border-blue-100">
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Three Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Name Field */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700">
                  Nom complet
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                    <User
                      className={`transition-colors duration-200 ${
                        focusedField === "name"
                          ? "text-blue-500"
                          : "text-gray-400"
                      }`}
                      size={15}
                    />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Jean Dupont"
                    required
                    className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border-2 border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all duration-200 text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Username Field */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700">
                  Nom d'utilisateur
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                    <AtSign
                      className={`transition-colors duration-200 ${
                        focusedField === "username"
                          ? "text-blue-500"
                          : "text-gray-400"
                      }`}
                      size={15}
                    />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("username")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="jean.dupont"
                    required
                    className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border-2 border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all duration-200 text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700">
                  Adresse email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                    <Mail
                      className={`transition-colors duration-200 ${
                        focusedField === "email"
                          ? "text-blue-500"
                          : "text-gray-400"
                      }`}
                      size={15}
                    />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="jean@exemple.com"
                    required
                    className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border-2 border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all duration-200 text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Password Fields in Two Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Password Field */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700">
                  Mot de passe
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                    <Lock
                      className={`transition-colors duration-200 ${
                        focusedField === "password"
                          ? "text-blue-500"
                          : "text-gray-400"
                      }`}
                      size={15}
                    />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-8 pr-9 py-2 text-sm bg-gray-50 border-2 border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all duration-200 text-gray-900 placeholder-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-blue-500 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700">
                  Confirmer le mot de passe
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                    <Lock
                      className={`transition-colors duration-200 ${
                        focusedField === "confirmPassword"
                          ? "text-blue-500"
                          : "text-gray-400"
                      }`}
                      size={15}
                    />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={() => setFocusedField("confirmPassword")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-8 pr-9 py-2 text-sm bg-gray-50 border-2 border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all duration-200 text-gray-900 placeholder-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-blue-500 transition-colors duration-200"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={15} />
                    ) : (
                      <Eye size={15} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700">
                Rôle dans l'organisation
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  Object.keys(roleDescriptions) as Array<
                    keyof typeof roleDescriptions
                  >
                ).map((roleKey) => {
                  const Icon = roleIcons[roleKey];
                  return (
                    <label
                      key={roleKey}
                      className={`relative flex flex-col items-center p-2.5 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        form.role === roleKey
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={roleKey}
                        checked={form.role === roleKey}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <Icon
                        className={`mb-1 ${
                          form.role === roleKey
                            ? "text-blue-600"
                            : "text-gray-400"
                        }`}
                        size={18}
                      />
                      <span
                        className={`text-xs font-semibold capitalize ${
                          form.role === roleKey
                            ? "text-blue-700"
                            : "text-gray-700"
                        }`}
                      >
                        {roleKey}
                      </span>
                      <span
                        className={`text-[10px] text-center mt-0.5 leading-tight ${
                          form.role === roleKey
                            ? "text-blue-600"
                            : "text-gray-500"
                        }`}
                      >
                        {roleDescriptions[roleKey]}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-lg font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-500/50 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center justify-center gap-2 transform hover:scale-[1.01] active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span className="text-sm">Création en cours...</span>
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  <span className="text-sm">Créer mon compte</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-4 text-center">
            <div className="relative mb-2.5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2.5 bg-white text-gray-500 font-medium">
                  Déjà inscrit ?
                </span>
              </div>
            </div>

            <Link
              to="/user"
              className="inline-flex items-center justify-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-semibold hover:underline decoration-2 underline-offset-2 transition-all duration-200"
            >
              <span>Se connecter à mon compte</span>
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
        <div className="mt-2.5 text-center">
          <p className="text-xs text-blue-200 font-medium bg-blue-900/30 backdrop-blur-sm rounded-lg py-1.5 px-3 border border-blue-800/30">
            Vos données sont sécurisées et protégées
          </p>
        </div>
      </div>
    </div>
  );
}
