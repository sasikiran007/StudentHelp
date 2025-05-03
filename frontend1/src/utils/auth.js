// src/utils/auth.js

export const login = (username) => {
    localStorage.setItem('user', username);
  };
  
  export const logout = () => {
    localStorage.removeItem('user');
  };
  
  export const getCurrentUser = () => {
    return localStorage.getItem('user');
  };
  
  export const isAuthenticated = () => {
    return getCurrentUser() !== null;
  };
  