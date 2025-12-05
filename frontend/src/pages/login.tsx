// src/pages/login.tsx
"use client";

import React, { FormEvent, useState } from "react";
import { Mail, Eye, EyeOff, Lock } from "lucide-react";
import { useAuthContext } from "../context/AuthContext";

const LoginPage: React.FC = () => {
  const { login } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setErrors("");
    setLoading(true);

    try {
      await login(email, password); // AuthContext cuida de token + redirect
    } catch (err) {
      console.error("[LOGIN] Erro:", err);
      setErrors("E-mail e/ou senha incorreto(s).");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-sky-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        {/* Cabeçalho / logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="h-12 w-12 rounded-full bg-sky-500 flex items-center justify-center mb-3">
            <span className="text-white font-semibold text-xl">Q</span>
          </div>
          <h1 className="text-xl font-semibold text-slate-900">
            Finance Pessoal
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Faça login para acessar seu painel financeiro.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* E-mail */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              E-mail
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`block w-full pl-10 pr-3 py-2 text-sm rounded-md border ${
                  errors ? "border-red-400" : "border-slate-300"
                } bg-white text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500`}
                placeholder="seuemail@exemplo.com"
              />
            </div>
          </div>

          {/* Senha */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`block w-full pl-10 pr-10 py-2 text-sm rounded-md border ${
                  errors ? "border-red-400" : "border-slate-300"
                } bg-white text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500`}
                placeholder="Digite sua senha"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-500"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors && (
              <p className="mt-1 text-xs text-red-500">{errors}</p>
            )}
          </div>

          {/* Botão */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-md bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium py-2.5 shadow-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          {/* Rodapé opcional */}
          <p className="mt-3 text-[11px] text-center text-slate-400">
            Em breve: reset de senha e outras opções de acesso.
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
