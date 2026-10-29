// Pure JavaScript - Authentication & Token Storage Helpers

const TOKEN_KEY = 'investiq_access_token';
const USER_KEY = 'investiq_user';

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export const setStoredUser = (user) => {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const removeStoredUser = () => {
  localStorage.removeItem(USER_KEY);
};

export const clearSession = () => {
  removeToken();
  removeStoredUser();
};

export const isAuthenticated = () => {
  return Boolean(getToken());
};
