export const isRequired = (value: unknown): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
};

export const isEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const minLength = (value: string, length: number): boolean => {
  return value.length >= length;
};

export const isPositiveNumber = (value: number): boolean => {
  return typeof value === 'number' && value >= 0;
};

export const isPositiveInt = (value: number): boolean => {
  return Number.isInteger(value) && value > 0;
};
