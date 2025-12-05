// src/pages/main.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import FinanceLayout from "../components/layout/FinanceLayout";
import { api } from "../services/api";
import { DashboardSummary } from "../types";
import { CardAtalho } from "../components/common/CardAtalho";
import { Wallet, TrendingUp, CreditCard, PiggyBank } from "lucide-react";

const formatCurrency = (value: number | null | undefined) => {
  if (typeof value !== "number" || isNaN(value)) {
    return "R$ 0,00";
  }
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
};

export default function MainPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1; // 0-based

        const { data } = await api.get<DashboardSummary>(
          `/dashboard/${year}/${month}`
        );
        console.log("DASHBOARD DATA:", data);
        setData(data);
      } catch (error) {
        console.error("Erro ao carregar dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <FinanceLayout>
      <div className="space-y-6">
        <header>
          <h1 className="text-xl font-semibold text-slate-900">
            Visão geral do mês
          </h1>
          <p className="text-sm text-slate-500">
            Acompanhe rapidamente como está sua vida financeira.
          </p>
        </header>

        {/* Cards principais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs text-slate-500 mb-1">Limite para gastar</p>
            <p className="text-lg font-semibold text-slate-900">
              {loading || !data ? "..." : formatCurrency(data.limit_spend)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs text-slate-500 mb-1">Entradas do mês</p>
            <p className="text-lg font-semibold text-emerald-600">
              {loading || !data ? "..." : formatCurrency(data.total_entries)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs text-slate-500 mb-1">Gastos do mês</p>
            <p className="text-lg font-semibold text-red-600">
              {loading || !data ? "..." : formatCurrency(data.total_expenses)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs text-slate-500 mb-1">Ainda pode gastar</p>
            <p className="text-lg font-semibold text-sky-600">
              {loading || !data
                ? "..."
                : formatCurrency(data.remaining_to_spend)}
            </p>
          </div>
        </div>

        {/* Atalhos */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <CardAtalho
            icon={<Wallet size={20} />}
            title="Entradas"
            description="Cadastre e acompanhe o que entrou de dinheiro."
            onClick={() => router.push("/entries")}
          />
          <CardAtalho
            icon={<CreditCard size={20} />}
            title="Despesas"
            description="Controle seus gastos por categoria e forma de pagamento."
            onClick={() => router.push("/expenses")}
          />
          <CardAtalho
            icon={<TrendingUp size={20} />}
            title="Contas fixas"
            description="Veja o que está planejado e o que já foi pago."
            onClick={() => router.push("/accounts")}
          />
          <CardAtalho
            icon={<PiggyBank size={20} />}
            title="Reservas"
            description="Monitore suas reservas e objetivos de poupança."
            onClick={() => router.push("/savings")}
          />
        </div>
      </div>
    </FinanceLayout>
  );
}
