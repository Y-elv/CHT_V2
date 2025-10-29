// utils/validators.ts
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const re = /^\+?[1-9]\d{1,14}$/;
  return re.test(phone);
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 50;
};

export const validateAge = (age: number): boolean => {
  return age >= 13 && age <= 25;
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};
