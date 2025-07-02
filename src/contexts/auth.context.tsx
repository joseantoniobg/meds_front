"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";

interface User {
  id: string;
  name: string;
  login: string;
  readOnly: boolean;
  token: string;
  colorPallete: "orange" | "teal" | "gray" | "blue" | "green" | "red" | "yellow" | "purple" | "pink" | "cyan" | undefined;
  setColorPallete: (color: string) => void;
  colorPalletes: string[];
  theme: "light" | "dark" | undefined;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  theme: "light" | "dark" | undefined;
  colorPallete: string;
  setColorPallete: (color: string) => void;
  colorPalletes: string[];
  toggleTheme: () => void;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<"light" | "dark" | undefined>("dark");
  const [colorPallete, setColorPallete] = useState<string>("teal");

  const colorPalletes = ["orange", "teal", "gray", "blue", "green", "red", "yellow", "purple", "pink", "cyan"];

  useEffect(() => {
    const persisted = localStorage.getItem("user");
    if (persisted) setUser(JSON.parse(persisted));
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, theme, toggleTheme, colorPallete, setColorPallete, colorPalletes }}>
      {children}
    </AuthContext.Provider>
  );
};