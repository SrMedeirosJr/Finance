"use client";

import { useEffect, useState, FormEvent } from "react";
import FinanceLayout from "../../components/layout/FinanceLayout";
import { api } from "../../services/api";

type Expense = {
  id: string;
  category: string;
  payment_method: string;
  value: number;
  date: string;
  essential: boolean;
};

type ExpenseForm = {
  category: string;
  payment_method: string;
  value: string;
  date: string;
  essential: boolean;
  installments: string;
};

const formatCurrency = (value: number) => {
  if (typeof value !== "number" || isNaN(value)) return "R$ 0,00";
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
};

export default function ExpensesPage() {
  const [items, setItems] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<ExpenseForm>({
    category: "",
    payment_method: "",
    value: "",
    date: "",
    essential: false,
    installments: "",
  });

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const { data } = await api.get<Expense[]>("/expenses");
      setItems(data);
    } catch (error) {
      console.error("Erro ao carregar despesas", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const openModal = () => {
    setForm({
      category: "",
      payment_method: "",
      value: "",
      date: "",
      essential: false,
      installments: "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const valorNumber = Number(
        form.value.replace(/\./g, "").replace(",", ".")
      );

      await api.post("/expenses", {
        category: form.category,
        payment_method: form.payment_method,
        value: valorNumber,
        date: form.date,
        essential: form.essential,
        installments: form.installments || null,
      });

      setIsModalOpen(false);
      await loadExpenses();
    } catch (error) {
      console.error("Erro ao salvar despesa", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja realmente excluir esta despesa?")) return;

    try {
      await api.delete(`/expenses/${id}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (error) {
      console.error("Erro ao excluir despesa", error);
    }
  };

  return (
    <FinanceLayout>
      <div className="space-y-6">
        {/* Header + botão */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Despesas</h1>
            <p className="text-sm text-slate-500">
              Controle seus gastos por categoria e forma de pagamento.
            </p>
          </div>
          <button
            onClick={openModal}
            className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-700"
          >
            Nova despesa
          </button>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs text-slate-500">
                <th className="text-left px-4 py-3 font-medium">Categoria</th>
                <th className="text-left px-4 py-3 font-medium">
                  Forma de pagamento
                </th>
                <th className="text-left px-4 py-3 font-medium">Valor</th>
                <th className="text-left px-4 py-3 font-medium">Data</th>
                <th className="text-left px-4 py-3 font-medium">Essencial</th>
                <th className="text-left px-4 py-3 font-medium">Parcelas</th>
                <th className="text-right px-4 py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-xs text-slate-400"
                  >
                    Carregando...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-xs text-slate-400"
                  >
                    Nenhuma despesa cadastrada ainda.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-slate-100 hover:bg-slate-50/60"
                  >
                    <td className="px-4 py-3 text-slate-800">
                      {item.category}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {item.payment_method}
                    </td>
                    <td className="px-4 py-3 text-red-600">
                      {formatCurrency(item.value)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {new Date(item.date).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {item.essential ? "Sim" : "Não"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {/* installments não vem no schema de saída, se quiser exibir precisaremos ajustar o schema */}
                      {/* Por enquanto deixo vazio ou um hífen */}
                      -
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

      {/* Modal Nova despesa */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Nova despesa
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Categoria
                  </label>
                  <input
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    value={form.category}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, category: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Forma de pagamento
                  </label>
                  <select
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white"
                    value={form.payment_method}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        payment_method: e.target.value,
                      }))
                    }
                    required
                  >
                    <option value="">Selecione</option>
                    <option value="Crédito">Crédito</option>
                    <option value="Débito">Débito</option>
                    <option value="Pix">Pix</option>
                    <option value="Boleto">Boleto</option>
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Parcelas (opcional)
                  </label>
                  <input
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    value={form.installments}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, installments: e.target.value }))
                    }
                    placeholder="Ex: 1/10"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="essential"
                  type="checkbox"
                  checked={form.essential}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, essential: e.target.checked }))
                  }
                  className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <label
                  htmlFor="essential"
                  className="text-xs text-slate-600 select-none"
                >
                  Essa despesa é essencial?
                </label>
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
                  {saving ? "Salvando..." : "Salvar despesa"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </FinanceLayout>
  );
}
