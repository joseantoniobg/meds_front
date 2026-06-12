"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { performRequestSimple } from "@/lib/handleRequest";

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

interface Settings {
  restrictReadOnlyPrint: boolean;
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
  settings: Settings | null;
  refreshSettings: () => Promise<void>;
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
  const [settings, setSettings] = useState<Settings | null>(null);

  const colorPalletes = ["orange", "teal", "gray", "blue", "green", "red", "yellow", "purple", "pink", "cyan"];

  const refreshSettings = async () => {
    const { data, status } = await performRequestSimple("GET", "/api/settings", {
      "Content-Type": "application/json",
    });

    if (status >= 200 && status < 300) setSettings(data);
  };

  useEffect(() => {
    const persisted = localStorage.getItem("user");
    if (persisted) setUser(JSON.parse(persisted));
    refreshSettings();
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
    <AuthContext.Provider value={{ user, login, logout, theme, toggleTheme, colorPallete, setColorPallete, colorPalletes, settings, refreshSettings }}>
      {children}
    </AuthContext.Provider>
  );
};