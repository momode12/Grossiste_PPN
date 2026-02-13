import type { ReactNode } from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import Swal from "sweetalert2";

import { X, Menu, LogOut, Bell, Search, User, ChevronDown } from "lucide-react";

interface LayoutProps {
  title?: string;
  menuItems: { id: string; label: string; icon: any; path: string }[];
  children: ReactNode;
}

export default function Layout({ title, menuItems, children }: LayoutProps) {
  const { user, logout } = useAuthContext();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

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
        cancelButton: "px-6 py-2.5 rounded-lg font-medium"
      }
    });

    if (result.isConfirmed) {
      await Swal.fire({
        title: "Déconnecté!",
        text: "À bientôt!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        customClass: {
          popup: "rounded-xl shadow-2xl"
        }
      });
      logout();
    }
  };

  // Badge de couleur selon le rôle
  const getRoleBadgeColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-purple-500 text-white";
      case "caissier":
        return "bg-green-500 text-white";
      case "gestionnaire":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Icon du rôle (utilise le premier item du menu ou User par défaut)
  const RoleIcon = menuItems[0]?.icon || User;

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-72" : "w-20"} bg-gradient-to-b from-indigo-950 via-indigo-900 to-indigo-950 text-white transition-all duration-300 flex flex-col shadow-2xl relative`}>
        {/* Decorative overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none"></div>
        
        {/* Header avec logo et toggle */}
        <div className="relative z-10 h-20 px-5 flex items-center justify-between border-b border-indigo-800/50">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <RoleIcon size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white capitalize">
                  {user?.role || "Utilisateur"}
                </h2>
                <p className="text-xs text-indigo-300">Espace personnel</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-indigo-800/50 transition-all duration-200"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation - Sans scroll */}
        <nav className="relative z-10 flex-1 px-3 py-4">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-200 group ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                        : "text-indigo-200 hover:bg-indigo-800/40 hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={20}
                        className={
                          isActive
                            ? ""
                            : "group-hover:scale-110 transition-transform"
                        }
                      />
                      {sidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
                      {isActive && sidebarOpen && (
                        <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Header avec info utilisateur */}
        <header className="h-20 bg-white/95 backdrop-blur-sm shadow-sm border-b border-slate-200/80">
          <div className="h-full px-6 flex items-center justify-between">
            {/* Titre de la page */}
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                {title}
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                {new Date().toLocaleDateString("fr-FR", {
                  weekday: "long", day: "numeric", month: "long", year: "numeric"
                })}
              </p>
            </div>

            {/* Actions et info utilisateur */}
            <div className="flex items-center gap-3">
              {/* Barre de recherche */}
              <div className="relative hidden lg:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all w-64 text-sm bg-slate-50"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2.5 rounded-xl hover:bg-slate-100 transition-colors">
                <Bell size={20} className="text-slate-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Menu utilisateur */}
              <div className="relative">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 rounded-xl border border-indigo-200/50 transition-all"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                    <User size={18} className="text-white" />
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="text-sm font-semibold text-slate-700 leading-tight">
                      {user?.email?.split('@')[0] || 'Utilisateur'}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-md capitalize ${getRoleBadgeColor(user?.role || "")}`}>
                        {user?.role || 'Utilisateur'}
                      </span>
                    </div>
                  </div>
                  <ChevronDown size={16} className={`text-slate-400 transition-transform hidden md:block ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown menu utilisateur */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-semibold text-slate-800">{user?.email}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Rôle: <span className={`font-medium px-2 py-0.5 rounded text-white ${getRoleBadgeColor(user?.role || "")}`}>
                          {user?.role}
                        </span>
                      </p>
                    </div>
                    <div className="px-2 py-1">
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors text-left text-red-600"
                      >
                        <LogOut size={16} />
                        <span className="text-sm font-medium">Déconnexion</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Contenu principal */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}