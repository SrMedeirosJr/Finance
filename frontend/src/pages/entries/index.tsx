"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/router";
import FinanceLayout from "../../components/layout/FinanceLayout";
import { api } from "../../services/api";

type Entry = {
  id: string;
  name: string;
  value: number;
  date: string;
};

type EntryForm = {
  name: string;
  value: string;
  date: string;
};

const formatCurrency = (value: number) => {
  if (typeof value !== "number" || isNaN(value)) return "R$ 0,00";
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
};

export default function EntriesPage() {
  const router = useRouter();
  const [items, setItems] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<EntryForm>({
    name: "",
    value: "",
    date: "",
  });
  const [saving, setSaving] = useState(false);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const { data } = await api.get<Entry[]>("/entries");
      setItems(data);
    } catch (error) {
      console.error("Erro ao carregar entradas", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const handleOpenModal = () => {
    setForm({ name: "", value: "", date: "" });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const valorNumber = Number(
        form.value.replace(/\./g, "").replace(",", ".")
      );

      await api.post("/entries", {
        name: form.name,
        value: valorNumber,
        date: form.date, // yyyy-mm-dd
      });

      setIsModalOpen(false);
      await loadEntries();
    } catch (error) {
      console.error("Erro ao salvar entrada", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja realmente excluir esta entrada?")) return;

    try {
      await api.delete(`/entries/${id}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (error) {
      console.error("Erro ao excluir entrada", error);
    }
  };

  return (
    <FinanceLayout>
      <div className="space-y-6">
        {/* header + botão nova entrada */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Entradas</h1>
            <p className="text-sm text-slate-500">
              Cadastre e acompanhe suas entradas de dinheiro.
            </p>
          </div>
          <button
            onClick={handleOpenModal}
            className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-700"
          >
            Nova entrada
          </button>
        </div>

        {/* tabela */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs text-slate-500">
                <th className="text-left px-4 py-3 font-medium">Descrição</th>
                <th className="text-left px-4 py-3 font-medium">Valor</th>
                <th className="text-left px-4 py-3 font-medium">Data</th>
                <th className="text-right px-4 py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-xs text-slate-400"
                  >
                    Carregando...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-xs text-slate-400"
                  >
                    Nenhuma entrada cadastrada ainda.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-slate-100 hover:bg-slate-50/60"
                  >
                    <td className="px-4 py-3 text-slate-800">{item.name}</td>
                    <td className="px-4 py-3 text-emerald-600">
                      {formatCurrency(item.value)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL NOVA ENTRADA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Nova entrada
              </h2>
              <button
                type="button"
                onClick={() => !saving && setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                Fechar
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Descrição
                </label>
                <input
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Valor
                </label>
                <input
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  value={form.value}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, value: e.target.value }))
                  }
                  placeholder="0,00"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Data
                </label>
                <input
                  type="date"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  value={form.date}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, date: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => !saving && setIsModalOpen(false)}
                  className="px-3 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm rounded-lg bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-60"
                  disabled={saving}
                >
                  {saving ? "Salvando..." : "Salvar entrada"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </FinanceLayout>
  );
}
