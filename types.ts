
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string;
  note: string;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  type: 'short-term' | 'long-term';
}

export interface Liability {
  id: string;
  title: string;
  totalAmount: number;
  paidAmount: number;
  type: 'loan' | 'debt' | 'special';
}

export interface FinancialState {
  bankBalance: number;
  monthlyInstallment: number;
  monthlyFatherSupport: number;
  transactions: Transaction[];
  goals: Goal[];
  liabilities: Liability[];
}
