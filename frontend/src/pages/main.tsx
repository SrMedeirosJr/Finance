// src/pages/main.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import FinanceLayout from "../components/layout/FinanceLayout";
import { api } from "../services/api";
import { DashboardSummary, CategorySummary } from "../types";
import { CardAtalho } from "../components/common/CardAtalho";
import { Wallet, TrendingUp, CreditCard, PiggyBank } from "lucide-react";

const formatCurrency = (value: number | null | undefined) => {
  if (typeof value !== "number" || isNaN(value)) {
    return "R$ 0,00";
  }
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
};

const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export default function MainPage() {
  const router = useRouter();
  const today = new Date();

  const [year, setYear] = useState<number>(today.getFullYear());
  const [month, setMonth] = useState<number>(today.getMonth() + 1);

  const [data, setData] = useState<DashboardSummary | null>(null);
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const availableYears = [year - 1, year, year + 1];

  const loadDashboard = async () => {
    setLoading(true);
    setLoadingCategories(true);
    try {
      // Resumo geral
      const dashRes = await api.get<DashboardSummary>(
        `/dashboard/${year}/${month}`
      );
      setData(dashRes.data);

      // Resumo de categorias
      const catRes = await api.get<CategorySummary[]>(
        "/expenses/summary/by-category",
        { params: { year, month } }
      );
      setCategories(catRes.data);
    } catch (error) {
      console.error("Erro ao carregar dashboard", error);
    } finally {
      setLoading(false);
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);

  // maior gasto pra usar como referência de barra
  const maxTotal =
    categories.length > 0
      ? Math.max(...categories.map((c) => c.total))
      : 0;

  return (
    <FinanceLayout>
      <div className="space-y-6">
        {/* Header + filtros */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              Visão geral do mês
            </h1>
            <p className="text-sm text-slate-500">
              Acompanhe rapidamente como está sua vida financeira.
            </p>
          </div>

          <div className="flex gap-3">
            <select
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {MONTHS.map((m, index) => (
                <option key={m} value={index + 1}>
                  {m}
                </option>
              ))}
            </select>

            <select
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {availableYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

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
              {loading || !data
                ? "..."
                : formatCurrency(data.total_entries)}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs text-slate-500 mb-1">Gastos do mês</p>
            <p className="text-lg font-semibold text-red-600">
              {loading || !data
                ? "..."
                : formatCurrency(data.total_expenses)}
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

        {/* Dashboard de categorias */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6">
            <h2 className="text-sm font-semibold text-slate-900">
              Categorias que você mais gastou
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Baseado nas despesas de {MONTHS[month - 1].toLowerCase()} / {year}.
            </p>

            {loadingCategories ? (
              <p className="text-xs text-slate-400">Carregando...</p>
            ) : categories.length === 0 ? (
              <p className="text-xs text-slate-400">
                Nenhuma despesa cadastrada neste período.
              </p>
            ) : (
              <div className="space-y-3">
                {categories.map((cat) => {
                  const percent =
                    maxTotal > 0 ? Math.round((cat.total / maxTotal) * 100) : 0;
                  return (
                    <div key={cat.category} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-700">
                          {cat.category}
                        </span>
                        <span className="text-slate-500">
                          {formatCurrency(cat.total)}{" "}
                          <span className="text-[10px] text-slate-400">
                            ({percent}%)
                          </span>
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-sky-500 transition-all"
                          style={{ width: `${percent || 4}%` }} // barra min. visível
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* espaço pra outros gráficos / insights depois */}
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 p-4 md:p-6">
            <h2 className="text-sm font-semibold text-slate-900">
              Insights futuros
            </h2>
            <p className="text-xs text-slate-500">
              Aqui depois a gente pode colocar outras visões, como evolução de
              saldo, comparação mês a mês, etc.
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
