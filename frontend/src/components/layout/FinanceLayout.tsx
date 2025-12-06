// src/components/layout/FinanceLayout.tsx
"use client";

import {
  Home,
  Wallet,
  TrendingUp,
  CreditCard,
  PiggyBank,
  LogOut,
} from "lucide-react";
import { ReactNode, useState } from "react";
import { useRouter } from "next/router";
import { useAuthContext } from "../../context/AuthContext";

type Props = {
  children: ReactNode;
};

type MenuItem = {
  label: string;
  href: string;
  icon: ReactNode;
};

const menuItems: MenuItem[] = [
  { label: "Início", href: "/main", icon: <Home size={18} /> },
  { label: "Entradas", href: "/entries", icon: <TrendingUp size={18} /> },
  { label: "Despesas", href: "/expenses", icon: <CreditCard size={18} /> },
  { label: "Contas", href: "/accounts", icon: <Wallet size={18} /> },
  { label: "Reservas", href: "/savings", icon: <PiggyBank size={18} /> },
];

export default function FinanceLayout({ children }: Props) {
  const router = useRouter();
  const { user, logout } = useAuthContext();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* SIDEBAR */}
      <aside
        className={`flex flex-col bg-slate-900 text-slate-100 transition-all duration-300 ${
          expanded ? "w-64" : "w-20"
        }`}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        {/* Logo / topo */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-800">
          <div className="h-10 w-10 rounded-2xl bg-sky-500 flex items-center justify-center text-white font-semibold">
            Q
          </div>
          {expanded && (
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.25em] text-slate-400 uppercase">
                Quali Tech
              </span>
              <span className="text-sm font-semibold leading-snug">
                Finance Pessoal
              </span>
            </div>
          )}
        </div>

        {/* Menu principal */}
        <nav className="flex-1 mt-4 space-y-1 px-2">
          {menuItems.map((item) => {
            const isActive = router.pathname === item.href;
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`w-full flex items-center gap-3 rounded-xl px-2 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-slate-800 text-white"
                    : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                }`}
              >
                <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-slate-800/60">
                  {item.icon}
                </span>
                {expanded && (
                  <span className="whitespace-nowrap">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Rodapé / usuário + sair */}
        <div className="mt-auto px-2 pb-4 border-t border-slate-800 pt-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-semibold">
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            {expanded && (
              <div className="flex flex-col">
                <span className="text-xs font-medium truncate max-w-[120px]">
                  {user?.name ?? "Usuário"}
                </span>
                <span className="text-[11px] text-slate-400 truncate max-w-[140px]">
                  {user?.email}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={logout}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-300"
            title="Sair"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* CONTEÚDO */}
      <main className="flex-1 px-8 py-6">{children}</main>
    </div>
  );
}
