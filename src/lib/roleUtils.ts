export type CanonicalRole = 'resident' | 'system_admin' | 'officer' | 'unknown';

// Backend and historical aliases that should map to the officer experience.
const OFFICER_ALIASES = new Set(['officer', 'organization', 'organization_admin']);

export const normalizeRole = (roleName?: string | null): CanonicalRole => {
  if (!roleName) return 'unknown';
  if (roleName === 'system_admin') return 'system_admin';
  if (roleName === 'resident') return 'resident';
  if (OFFICER_ALIASES.has(roleName)) return 'officer';
  return 'unknown';
};

export const isOfficerRole = (roleName?: string | null): boolean => normalizeRole(roleName) === 'officer';

export const hasAllowedRole = (roleName: string | null | undefined, allowedRoles?: string[]): boolean => {
  if (!allowedRoles || allowedRoles.length === 0) return true;
  const current = normalizeRole(roleName);
  const normalizedAllowed = allowedRoles.map((role) => normalizeRole(role));
  return normalizedAllowed.includes(current);
};
