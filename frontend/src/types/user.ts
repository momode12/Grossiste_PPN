export type UserRole = 'admin' | 'manager' | 'caissier' | 'magasinier';
export type UserStatus = 'active' | 'inactive';

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;       // ✅ ajout du statut
  created_at: string;       // TIMESTAMP
}

export interface UserMenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  path: string;
  roles: UserRole[];
}
