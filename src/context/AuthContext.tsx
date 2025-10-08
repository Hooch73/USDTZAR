import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Check for a token in sessionStorage to persist login across page reloads
    return sessionStorage.getItem('isAuthenticated') === 'true';
  });

  // Hardcoded credentials for simplicity - DO NOT USE IN PRODUCTION
  const MOCK_USER = 'tothemoon';
  const MOCK_PASS = '2tDso*h9_k7fXi.oyfFMLVr3kiRTGak4-*67';

  const login = (user: string, pass: string): boolean => {
    if (user === MOCK_USER && pass === MOCK_PASS) {
      setIsAuthenticated(true);
      sessionStorage.setItem('isAuthenticated', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('isAuthenticated');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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
