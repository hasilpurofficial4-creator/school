// ============================================================
// Auth Context
// Study Hub Lahore - In-memory auth state (NO localStorage)
// ============================================================

import React, { createContext, useContext, useState, useCallback } from "react";
import type { UserRole, StudentClass, LoginResponse } from "../types";
import { setToken } from "../utils/api";

interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  class?: StudentClass;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (email: string, password: string, role: UserRole): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, role }),
        });

        const data = await res.json();

        if (!data.success || !data.data) {
          setError(data.error || "Login failed");
          return false;
        }

        const loginData = data.data as LoginResponse;

        // Store token in module scope (NOT localStorage)
        setToken(loginData.token);
        setUser(loginData.user);
        return true;
      } catch (err: any) {
        setError(err.message || "Network error");
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
