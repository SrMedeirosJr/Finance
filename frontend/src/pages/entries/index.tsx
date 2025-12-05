// src/pages/entries/index.tsx
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
    await api.delete(`/entries/${id}/`);
    await loadEntries();
  };

  return (
    <FinanceLayout>
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Entradas</h1>
            <p className="text-sm text-slate-500">
              Cadastre e acompanhe suas entradas de dinheiro.
            </p>
          </div>
        </header>

        {/* Formulário */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-slate-200 px-4 py-4 grid grid-cols-1 md:grid-cols-4 gap-3 items-end"
        >
          <div>
            <label className="block text-xs text-slate-500 mb-1">Descrição</label>
            <input
              type="text"
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
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium py-2.5 px-4 transition disabled:opacity-60"
            >
              {loading ? "Salvando..." : "Adicionar entrada"}
            </button>
          </div>
        </form>

        {/* Tabela */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">
                  Descrição
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">
                  Valor
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">
                  Data
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-slate-500">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3">
                    R$ {item.value.toFixed(2).replace(".", ",")}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(item.date).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(item.id)}
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
