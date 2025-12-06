// src/types/index.ts
export type Entry = {
  id: string;
  name: string;
  value: number;
  date: string; // ISO
};

export type AccountBill = {
  id: string;
  name: string;
  planned_value: number;
  paid_value: number | null;
  paid_date: string | null;
  is_paid: boolean;
};

export type Expense = {
  id: string;
  category: string;
  payment_method: string;
  value: number;
  date: string;
  essential: boolean;
};

export type Saving = {
  id: string;
  name: string;
  saving_type: string;
  value: number;
  date: string;
};

export type DashboardSummary = {
  limit_spend: number;
  total_entries: number;
  total_expenses: number;
  remaining_to_spend: number;
  expenses_by_payment: { payment_method: string; value: number }[];
  expenses_by_category: { category: string; value: number }[];
  bills: {
    total_planned: number;
    total_paid: number;
  };
  savings_month: number;
};

export type CategorySummary = {
  category: string;
  total: number;
};

