"use client";

import { Home, Wallet, TrendingUp, CreditCard, PiggyBank, LogOut } from "lucide-react";
import { ReactNode } from "react";
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

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col">
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide">Quali Tech</p>
            <p className="text-sm font-semibold">Finance Pessoal</p>
          </div>
        </div>

        <nav className="flex-1 mt-4 space-y-1">
          {menuItems.map((item) => {
            const active = router.pathname === item.href;
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm rounded-r-full transition 
                  ${active ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800/70"}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 px-5 py-3 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            <p className="font-medium text-slate-200 text-sm">{user?.name}</p>
            <p>{user?.email}</p>
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

      {/* Conteúdo */}
      <main className="flex-1 px-8 py-6">
        {children}
      </main>
    </div>
  );
}
