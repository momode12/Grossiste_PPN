import { useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import Swal from "sweetalert2";

import {
  LayoutDashboard,
  Users,
  Package,
  FolderOpen,
  TrendingUp,
  ShoppingCart,
  Wallet,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  User,
  ChevronDown,
} from "lucide-react";

export default function AdminDashboard() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Définir le préfixe de route en fonction du rôle
  const baseRoute = user?.role === "admin" ? "/admin" : "/dashboard";

  // Configuration des menus selon les rôles
  const getMenuItems = () => {
    const allMenuItems = [
      {
        id: "dashboard",
        label: "Tableau de bord",
        icon: LayoutDashboard,
        path: `${baseRoute}`,
        roles: ["admin", "manager", "caissier", "magasinier"],
      },
      {
        id: "users",
        label: "Utilisateurs",
        icon: Users,
        path: `${baseRoute}/users`,
        roles: ["admin"],
      },
      {
        id: "categories",
        label: "Catégories",
        icon: FolderOpen,
        path: `${baseRoute}/categories`,
        roles: ["admin"],
      },
      {
        id: "stock",
        label: "Entrées Stock",
        icon: TrendingUp,
        path: `${baseRoute}/stock`,
        roles: ["admin", "manager", "magasinier"],
      },
      {
        id: "articles",
        label: "Articles",
        icon: Package,
        path: `${baseRoute}/articles`,
        roles: ["admin", "manager", "magasinier"],
      },

      {
        id: "ventes",
        label: "Ventes",
        icon: ShoppingCart,
        path: `${baseRoute}/ventes`,
        roles: ["admin", "manager", "caissier"],
      },
      {
        id: "caisse",
        label: "Caisse",
        icon: Wallet,
        path: `${baseRoute}/caisse`,
        roles: ["admin", "manager", "caissier"],
      },
      {
        id: "rapports",
        label: "Rapports",
        icon: BarChart3,
        path: `${baseRoute}/rapports`,
        roles: ["admin", "manager"],
      },
    ];

    // Filtrer les menus en fonction du rôle de l'utilisateur
    return allMenuItems.filter((item) => item.roles.includes(user?.role || ""));
  };

  const menuItems = getMenuItems();

  const activeMenu =
    menuItems.find(
      (item) =>
        location.pathname === item.path ||
        (item.path !== baseRoute && location.pathname.startsWith(item.path))
    )?.id || "dashboard";

  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Déconnexion",
      text: "Voulez-vous vraiment vous déconnecter ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Oui, se déconnecter",
      cancelButtonText: "Annuler",
      reverseButtons: true,
      backdrop: true,
      customClass: {
        popup: "rounded-xl shadow-2xl",
        title: "text-xl font-bold",
        confirmButton: "px-6 py-2.5 rounded-lg font-medium",
        cancelButton: "px-6 py-2.5 rounded-lg font-medium",
      },
    });

    if (result.isConfirmed) {
      logout();
    }
  };

  // Titre du panel selon le rôle
  const getPanelTitle = () => {
    switch (user?.role) {
      case "admin":
        return "Admin Panel";
      case "manager":
        return "Manager Panel";
      case "caissier":
        return "Caisse Panel";
      case "magasinier":
        return "Stock Panel";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gradient-to-b from-indigo-950 via-indigo-900 to-indigo-950 text-white transition-all duration-300 flex flex-col shadow-2xl relative`}
      >
        {/* Overlay décoratif */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none"></div>

        {/* Header Sidebar */}
        <div className="relative z-10 h-20 px-5 flex items-center justify-between border-b border-indigo-800/50">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <LayoutDashboard size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {getPanelTitle()}
                </h2>
                <p className="text-xs text-indigo-300">Gestion & Contrôle</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-indigo-800/50 transition-all duration-200 cursor-pointer"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 flex-1 px-3 py-4">
          <div className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.path)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-200 group cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_10px_20px_-5px_rgba(59,130,246,0.5)] active:scale-[0.98]"
                      : "text-indigo-200 hover:bg-indigo-800/40 hover:text-white active:bg-indigo-800/60"
                  }`}
                >
                  <Icon
                    size={20}
                    className={
                      isActive
                        ? ""
                        : "group-hover:scale-110 transition-transform"
                    }
                  />
                  {sidebarOpen && (
                    <span className="font-medium text-sm">{item.label}</span>
                  )}
                  {isActive && sidebarOpen && (
                    <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Global Header */}
        <header className="h-20 bg-white/95 backdrop-blur-sm shadow-sm border-b border-slate-200/80">
          <div className="h-full px-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-3">
                {menuItems.find((item) => item.id === activeMenu)?.label ||
                  "Dashboard"}
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                {new Date().toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Recherche */}
              <div className="relative hidden lg:block">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all w-64 text-sm bg-slate-50"
                />
              </div>

              {/* Notification */}
              <button className="relative p-2.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
                <Bell size={20} className="text-slate-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profil */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 rounded-xl border border-indigo-200/50 transition-all cursor-pointer"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                    <User size={18} className="text-white" />
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="text-sm font-semibold text-slate-700 leading-tight">
                      {user?.email?.split("@")[0] || "Admin"}
                    </p>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500 text-white rounded uppercase">
                      {user?.role || "Admin"}
                    </span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform ${
                      userMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-semibold text-slate-800">
                        {user?.email}
                      </p>
                      <p className="text-xs text-slate-500">
                        Rôle:{" "}
                        <span className="text-indigo-600 font-medium">
                          {user?.role}
                        </span>
                      </p>
                    </div>
                    <div className="px-2 py-1">
                      {user?.role === "admin" && (
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            navigate(`${baseRoute}/settings`);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 text-left text-sm text-slate-700 cursor-pointer"
                        >
                          <Settings size={16} /> Paramètres
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 text-left text-sm text-red-600 font-medium cursor-pointer"
                      >
                        <LogOut size={16} /> Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Vue dynamique */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
