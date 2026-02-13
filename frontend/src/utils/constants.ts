import type { UserRole } from '@/types/user';
import type { VenteType } from '@/types/vente';
import type { CaisseType } from '@/types/caisse';

export const USER_ROLES: UserRole[] = [
  'admin',
  'manager',
  'caissier',
  'magasinier',
];

export const VENTE_TYPES: VenteType[] = [
  'comptant',
  'credit',
];

export const CAISSE_TYPES: CaisseType[] = [
  'recette',
  'depense',
];

export const PAGINATION_DEFAULT = {
  page: 1,
  limit: 10,
};

export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm';
