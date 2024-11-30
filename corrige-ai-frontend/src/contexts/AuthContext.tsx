import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthState, LoginCredentials, RegisterData, User } from "../types/auth";
import api from "../services/api";
import API_ROUTES from "../services/apiRoutes";

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser();
    }
  }, []);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await api.get(API_ROUTES.ACCOUNT.CURRENT_USER);
      const user: User = response.data;

      setAuthState({
        user: {
          id: user.id,
          name: user.name,
          surname: user.surname,
          email: user.email,
          role: user.role,
          phone: user.phone,
          cep: user.cep,
        },
        token: localStorage.getItem("token"),
        isAuthenticated: true,
      });
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      const response = await api.post("/account/login", credentials);
      const { user, session } = response.data;

      localStorage.setItem("token", session.access_token);
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${session.access_token}`;

      setAuthState({
        user: {
          id: user.id,
          name: user.name,
          surname: user.surname,
          email: user.email,
          role: user.role,
          phone: user.phone,
          cep: user.cep,
        },
        token: session.access_token,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw new Error(
        "Erro ao fazer login. Por favor, verifique suas credenciais."
      );
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    try {
      setLoading(true);
      const response = await api.post(API_ROUTES.ACCOUNT.REGISTER, data);
      const { user, token } = response.data;

      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setAuthState({
        user: {
          id: user.id,
          name: user.name,
          surname: user.surname,
          email: user.email,
          role: user.role,
          phone: user.phone,
          cep: user.cep,
        },
        token,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
      throw new Error("Erro ao registrar usuário. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, register, logout }}>
      {loading && <div>Carregando...</div>}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
