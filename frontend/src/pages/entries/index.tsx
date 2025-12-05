"use client";

import { useEffect, useState, FormEvent } from "react";
import FinanceLayout from "../../components/layout/FinanceLayout";
import { api } from "../../services/api";

type Entry = {
  id: string;
  name: string;
  value: number;
  date: string;
};

export default function EntriesPage() {
  const [items, setItems] = useState<Entry[]>([]);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  const loadEntries = async () => {
    const { data } = await api.get<Entry[]>("/entries/");
    setItems(data);
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await api.post("/entries/", {
      name,
      value: Number(value),
      date,
    });
    setName("");
    setValue("");
    setDate("");
    await loadEntries();
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/entries/${id}`);
    await loadEntries();
  };

  return (
    <FinanceLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Entradas</h1>
            <p className="text-sm text-slate-500">
              Cadastre e acompanhe todas as receitas.
            </p>
          </div>
        </div>

        {/* Formulário rápido */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-slate-200 px-4 py-4 grid grid-cols-1 md:grid-cols-4 gap-3 items-end"
        >
          <div>
            <label className="block text-xs text-slate-500 mb-1">Descrição</label>
            <input
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
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
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium py-2.5 px-4 transition disabled:opacity-60"
          >
            {loading ? "Salvando..." : "Adicionar"}
          </button>
        </form>

        {/* Tabela simples */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="text-left px-4 py-2">Descrição</th>
                <th className="text-right px-4 py-2">Valor</th>
                <th className="text-center px-4 py-2">Data</th>
                <th className="text-center px-4 py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map((e) => (
                <tr key={e.id} className="border-t border-slate-100">
                  <td className="px-4 py-2">{e.name}</td>
                  <td className="px-4 py-2 text-right">
                    {e.value.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {new Date(e.date).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleDelete(e.id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-xs text-slate-400"
                  >
                    Nenhuma entrada cadastrada ainda.
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
