import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { authAPI, setAuthToken } from "@/services/api";

export type UserRole = "admin" | "docente" | "estudiante";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Mapea el nombre del rol de la API al rol tipo de la aplicación
 */
const mapRolToUserRole = (rol: string): UserRole => {
  const rolMap: Record<string, UserRole> = {
    "ADMINISTRADOR": "admin",
    "DOCENTE": "docente",
    "ESTUDIANTE": "estudiante",
  };
  return rolMap[rol.toUpperCase()] || "estudiante";
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("mentory_user");
    const token = localStorage.getItem("mentory_token");
    if (stored && token) {
      setAuthToken(token);
      return JSON.parse(stored);
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(email, password);
      
      const mappedUser: User = {
        id: String(response.userId),
        email: response.email,
        name: `${response.nombres || ""} ${response.apellidos || ""}`.trim(),
        role: mapRolToUserRole(response.rol),
      };

      setUser(mappedUser);
      setAuthToken(response.token);
      localStorage.setItem("mentory_user", JSON.stringify(mappedUser));
      localStorage.setItem("mentory_token", response.token);
      
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error en la autenticación";
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem("mentory_user");
    localStorage.removeItem("mentory_token");
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
