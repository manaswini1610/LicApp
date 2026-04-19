import {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react";
import axios from "axios";
import { AuthState } from "./state.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const auth = AuthState();

  const isAuthenticated = Boolean(
    auth.token ??
      (typeof window !== "undefined" && localStorage.getItem("token")),
  );

  const login = useCallback(
    async (username, password) => {
      const result = await auth.login(username, password);
      if (axios.isAxiosError(result)) {
        const msg =
          result.response?.data?.message ??
          result.message ??
          "Login failed";
        return { ok: false, message: String(msg) };
      }
      const token =
        result?.token ??
        result?.accessToken ??
        (typeof result === "string" ? result : null);
      if (token) {
        localStorage.setItem("token", token);
      }
      return { ok: true };
    },
    [auth],
  );

  const logout = useCallback(() => {
    auth.logout();
  }, [auth]);

  const register = useCallback(async (values) => {
    const result = await auth.register(values);
    if (axios.isAxiosError(result)) {
      const msg =
        result.response?.data?.message ??
        result.message ??
        "Registration failed";
      return { ok: false, message: String(msg) };
    }
    return { ok: true };
  }, [auth]);

  const value = useMemo(
    () => ({
      user: auth.user,
      token: auth.token,
      isAuthenticated,
      login,
      logout,
      register,
    }),
    [auth, isAuthenticated, login, logout, register],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
