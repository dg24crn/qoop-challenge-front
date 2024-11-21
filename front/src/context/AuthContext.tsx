import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isSubscribed: boolean; // Nueva propiedad para manejar el estado de la suscripción
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  toggleSubscription: () => void; // Permitir cambiar el estado de suscripción
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (user: User) => setUser(user);
  const logout = () => setUser(null);

  const toggleSubscription = () => {
    if (user) {
      setUser({ ...user, isSubscribed: !user.isSubscribed });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, toggleSubscription }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
