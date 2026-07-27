import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { customFetch } from "@workspace/api-client-react";

interface AuthContextValue {
  authenticated: boolean | null;
  loading: boolean;
  error: string | null;
  login: (password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const check = useCallback(async () => {
    try {
      const res = await customFetch<{ authenticated: boolean }>("/api/auth/me", {
        credentials: "include",
      });
      setAuthenticated(res.authenticated);
    } catch (err) {
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  const login = useCallback(async (password: string) => {
    setError(null);
    try {
      await customFetch<{ ok: boolean }>("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "include",
      });
      setAuthenticated(true);
    } catch (err: any) {
      const msg = err?.data?.error || err?.message || "Login failed";
      setError(msg);
      setAuthenticated(false);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await customFetch<{ ok: boolean }>("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setAuthenticated(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ authenticated, loading, error, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
