// src/context/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";
import { useRouter } from "next/router";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextData = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const TOKEN_KEY = "access_token";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Carrega usuário se já tiver token salvo
  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;

    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get<User>("/auth/me")
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const accessToken = response.data.access_token;

      if (!accessToken) {
        throw new Error("Token inválido");
      }

      // salva token
      localStorage.setItem(TOKEN_KEY, accessToken);

      // (opcional) garante que esse token já entre no axios
      api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      // busca dados do usuário
      const me = await api.get<User>("/auth/me");
      setUser(me.data);
      localStorage.setItem("user", JSON.stringify(me.data));

      router.push("/main");
    } catch (error) {
      console.error("Erro no login:", error);
      throw error; // tela de login trata a mensagem
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
