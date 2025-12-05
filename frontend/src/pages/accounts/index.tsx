// src/pages/accounts/index.tsx
"use client";

import { FormEvent, useEffect, useState } from "react";
import FinanceLayout from "../../components/layout/FinanceLayout";
import { api } from "../../services/api";
import { AccountBill } from "../../types";

export default function AccountsPage() {
  const [items, setItems] = useState<AccountBill[]>([]);
  const [name, setName] = useState("");
  const [plannedValue, setPlannedValue] = useState("");
  const [paidValue, setPaidValue] = useState("");
  const [paidDate, setPaidDate] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadBills = async () => {
    const { data } = await api.get<AccountBill[]>("/accounts/");
    setItems(data);
  };

  useEffect(() => {
    loadBills();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await api.post("/accounts/", {
      name,
      planned_value: Number(plannedValue),
      paid_value: paidValue ? Number(paidValue) : null,
      paid_date: paidDate || null,
      is_paid: isPaid,
    });

    setName("");
    setPlannedValue("");
    setPaidValue("");
    setPaidDate("");
    setIsPaid(false);
    await loadBills();
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/accounts/${id}`);
    await loadBills();
  };

  return (
    <FinanceLayout>
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Contas</h1>
            <p className="text-sm text-slate-500">
              Organize suas contas fixas, boletos e compromissos do mês.
            </p>
          </div>
        </header>

        {/* Formulário */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-slate-200 px-4 py-4 grid grid-cols-1 md:grid-cols-5 gap-3 items-end"
        >
          <div className="md:col-span-2">
            <label className="block text-xs text-slate-500 mb-1">Nome da conta</label>
            <input
              type="text"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Valor planejado</label>
            <input
              type="number"
              step="0.01"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              value={plannedValue}
              onChange={(e) => setPlannedValue(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Valor pago (opcional)</label>
            <input
              type="number"
              step="0.01"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              value={paidValue}
              onChange={(e) => setPaidValue(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Data pagamento</label>
            <input
              type="date"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              value={paidDate}
              onChange={(e) => setPaidDate(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="isPaid"
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300"
              checked={isPaid}
              onChange={(e) => setIsPaid(e.target.checked)}
            />
            <label htmlFor="isPaid" className="text-xs text-slate-600">
              Conta paga
            </label>
          </div>
          <div className="md:col-span-5 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium py-2.5 px-4 transition disabled:opacity-60"
            >
              {loading ? "Salvando..." : "Adicionar conta"}
            </button>
          </div>
        </form>

        {/* Tabela */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">
                  Conta
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">
                  Planejado
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">
                  Pago
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">
                  Data pagto
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">
                  Status
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-slate-500">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((bill) => (
                <tr key={bill.id} className="border-b border-slate-100">
                  <td className="px-4 py-3">{bill.name}</td>
                  <td className="px-4 py-3">
                    R$ {bill.planned_value.toFixed(2).replace(".", ",")}
                  </td>
                  <td className="px-4 py-3">
                    {bill.paid_value != null
                      ? `R$ ${bill.paid_value.toFixed(2).replace(".", ",")}`
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    {bill.paid_date
                      ? new Date(bill.paid_date).toLocaleDateString("pt-BR")
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium " +
                        (bill.is_paid
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700")
                      }
                    >
                      {bill.is_paid ? "Paga" : "Em aberto"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(bill.id)}
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
                    Nenhuma conta cadastrada ainda.
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
