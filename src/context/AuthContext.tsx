import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const savedSession = localStorage.getItem('admin_session');
    if (savedSession === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const login = (password: string) => {
    // En un entorno real, esto se validaría contra un backend.
    // Para este MVP, usamos una contraseña hardcoded simple.
    if (password === 'admin123') {
      setIsAdmin(true);
      localStorage.setItem('admin_session', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('admin_session');
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
