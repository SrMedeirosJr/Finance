"use client";

import { useEffect, useState, FormEvent } from "react";
import FinanceLayout from "../../components/layout/FinanceLayout";
import { api } from "../../services/api";

type AccountBill = {
  id: string;
  name: string;
  planned_value: number;
  paid_value: number | null;
  paid_date: string | null;
  is_paid: boolean;
};

type AccountForm = {
  name: string;
  planned_value: string;
  paid_value: string;
  paid_date: string;
  is_paid: boolean;
};

const formatCurrency = (value: number | null) => {
  if (value === null || typeof value !== "number" || isNaN(value))
    return "R$ 0,00";
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
};

export default function AccountsPage() {
  const [items, setItems] = useState<AccountBill[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<AccountForm>({
    name: "",
    planned_value: "",
    paid_value: "",
    paid_date: "",
    is_paid: false,
  });

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get<AccountBill[]>("/accounts");
      setItems(data);
    } catch (error) {
      console.error("Erro ao carregar contas", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const openModal = () => {
    setForm({
      name: "",
      planned_value: "",
      paid_value: "",
      paid_date: "",
      is_paid: false,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const planned = Number(
        form.planned_value.replace(/\./g, "").replace(",", ".")
      );
      const paid = form.paid_value
        ? Number(form.paid_value.replace(/\./g, "").replace(",", "."))
        : null;

      await api.post("/accounts", {
        name: form.name,
        planned_value: planned,
        paid_value: paid,
        paid_date: form.paid_date || null,
        is_paid: form.is_paid,
      });

      setIsModalOpen(false);
      await loadAccounts();
    } catch (error) {
      console.error("Erro ao salvar conta", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja realmente excluir esta conta?")) return;

    try {
      await api.delete(`/accounts/${id}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (error) {
      console.error("Erro ao excluir conta", error);
    }
  };

  return (
    <FinanceLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Contas</h1>
            <p className="text-sm text-slate-500">
              Veja o que está planejado e o que já foi pago.
            </p>
          </div>
          <button
            onClick={openModal}
            className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-700"
          >
            Nova conta
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs text-slate-500">
                <th className="text-left px-4 py-3 font-medium">Descrição</th>
                <th className="text-left px-4 py-3 font-medium">
                  Valor planejado
                </th>
                <th className="text-left px-4 py-3 font-medium">Valor pago</th>
                <th className="text-left px-4 py-3 font-medium">
                  Data pagamento
                </th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-right px-4 py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-xs text-slate-400"
                  >
                    Carregando...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-xs text-slate-400"
                  >
                    Nenhuma conta cadastrada ainda.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-slate-100 hover:bg-slate-50/60"
                  >
                    <td className="px-4 py-3 text-slate-800">{item.name}</td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatCurrency(item.planned_value)}
                    </td>
                    <td className="px-4 py-3 text-emerald-600">
                      {item.paid_value !== null
                        ? formatCurrency(item.paid_value)
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {item.paid_date
                        ? new Date(item.paid_date).toLocaleDateString("pt-BR")
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {item.is_paid ? "Paga" : "Em aberto"}
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

      {/* Modal Nova conta */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Nova conta
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Valor planejado
                  </label>
                  <input
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    value={form.planned_value}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        planned_value: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Valor pago (opcional)
                  </label>
                  <input
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    value={form.paid_value}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, paid_value: e.target.value }))
                    }
                    placeholder="0,00"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Data pagamento (opcional)
                  </label>
                  <input
                    type="date"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    value={form.paid_date}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, paid_date: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="is_paid"
                  type="checkbox"
                  checked={form.is_paid}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, is_paid: e.target.checked }))
                  }
                  className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <label
                  htmlFor="is_paid"
                  className="text-xs text-slate-600 select-none"
                >
                  Conta já está paga?
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
                  {saving ? "Salvando..." : "Salvar conta"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </FinanceLayout>
  );
}
