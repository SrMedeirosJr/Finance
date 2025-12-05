// src/pages/expenses/index.tsx
"use client";

import { FormEvent, useEffect, useState } from "react";
import FinanceLayout from "../../components/layout/FinanceLayout";
import { api } from "../../services/api";
import { Expense } from "../../types";

const paymentOptions = ["Crédito", "Débito", "Pix", "Dinheiro", "Boleto", "Outro"];

export default function ExpensesPage() {
  const [items, setItems] = useState<Expense[]>([]);
  const [category, setCategory] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Crédito");
  const [value, setValue] = useState("");
  const [date, setDate] = useState("");
  const [essential, setEssential] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadExpenses = async () => {
    const { data } = await api.get<Expense[]>("/expenses/");
    setItems(data);
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await api.post("/expenses/", {
      category,
      payment_method: paymentMethod,
      value: Number(value),
      date,
      essential,
    });

    setCategory("");
    setPaymentMethod("Crédito");
    setValue("");
    setDate("");
    setEssential(false);
    await loadExpenses();
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/expenses/${id}`);
    await loadExpenses();
  };

  return (
    <FinanceLayout>
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Despesas</h1>
            <p className="text-sm text-slate-500">
              Registre seus gastos e identifique para onde o dinheiro está indo.
            </p>
          </div>
        </header>

        {/* Formulário */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-slate-200 px-4 py-4 grid grid-cols-1 md:grid-cols-5 gap-3 items-end"
        >
          <div className="md:col-span-2">
            <label className="block text-xs text-slate-500 mb-1">Categoria</label>
            <input
              type="text"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              Forma de pagamento
            </label>
            <select
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              {paymentOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Valor</label>
            <input
              type="number"
              step="0.01"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Data</label>
            <input
              type="date"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="essential"
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300"
              checked={essential}
              onChange={(e) => setEssential(e.target.checked)}
            />
            <label htmlFor="essential" className="text-xs text-slate-600">
              Essencial
            </label>
          </div>
          <div className="md:col-span-5 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium py-2.5 px-4 transition disabled:opacity-60"
            >
              {loading ? "Salvando..." : "Adicionar despesa"}
            </button>
          </div>
        </form>

        {/* Tabela */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">
                  Categoria
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">
                  Forma pagto
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">
                  Valor
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">
                  Data
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">
                  Tipo
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-slate-500">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((exp) => (
                <tr key={exp.id} className="border-b border-slate-100">
                  <td className="px-4 py-3">{exp.category}</td>
                  <td className="px-4 py-3">{exp.payment_method}</td>
                  <td className="px-4 py-3">
                    R$ {exp.value.toFixed(2).replace(".", ",")}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(exp.date).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium " +
                        (exp.essential
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-50 text-slate-600")
                      }
                    >
                      {exp.essential ? "Essencial" : "Não essencial"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(exp.id)}
                      className="text-xs text-red-500 hover:text-red-600"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-xs text-slate-400"
                  >
                    Nenhuma despesa cadastrada ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </FinanceLayout>
  );
}
