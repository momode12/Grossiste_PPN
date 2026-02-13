
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const links = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/users", label: "Utilisateurs" },
    { to: "/admin/categories", label: "Catégories" },
    { to: "/admin/articles", label: "Articles" },
    { to: "/admin/stock", label: "Stock" },
    { to: "/admin/ventes", label: "Ventes" },
    { to: "/admin/caisse", label: "Caisse" },
    { to: "/admin/rapports", label: "Rapports" },
    { to: "/admin/settings", label: "Paramètres" },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white h-screen p-4 fixed">
      <nav className="flex flex-col gap-2">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `px-4 py-2 rounded hover:bg-gray-700 ${isActive ? "bg-gray-700" : ""}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
