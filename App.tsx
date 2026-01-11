
import React, { useState, useEffect } from 'react';
import { FinancialState, Transaction, Goal, Liability } from './types';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import GoalSection from './components/GoalSection';
import LiabilitySection from './components/LiabilitySection';
import AddDataModal from './components/AddDataModal';
import StrategySection from './components/StrategySection';
import AIAnalystHero from './components/AIAnalystHero';
import { 
  LayoutDashboard, 
  History, 
  Target, 
  Wallet, 
  Plus, 
  BookOpen,
  Lightbulb,
  Heart
} from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'goals' | 'debts' | 'strategy'>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [state, setState] = useState<FinancialState>(() => {
    const saved = localStorage.getItem('amar_hisab_data_v5');
    if (saved) return JSON.parse(saved);
    
    // User requested specific debts: Toma (120k), Mama (70k), Kisti (100k)
    const initialSpecialDebts: Liability[] = [
      { id: 'sd-toma', title: 'তমা', totalAmount: 120000, paidAmount: 0, type: 'special' },
      { id: 'sd-mama', title: 'মামা', totalAmount: 70000, paidAmount: 0, type: 'special' },
      { id: 'sd-kisti', title: 'কিস্তি', totalAmount: 100000, paidAmount: 0, type: 'special' }
    ];

    return {
      bankBalance: 0,
      monthlyInstallment: 10000,
      monthlyFatherSupport: 5000,
      transactions: [],
      goals: [],
      liabilities: initialSpecialDebts
    };
  });

  useEffect(() => {
    localStorage.setItem('amar_hisab_data_v5', JSON.stringify(state));
  }, [state]);

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newT = { ...t, id: Date.now().toString() };
    setState(prev => ({
      ...prev,
      transactions: [newT, ...prev.transactions],
      bankBalance: t.type === 'income' ? prev.bankBalance + t.amount : prev.bankBalance - t.amount
    }));
  };

  const recordDebtPayment = (liabilityId: string, amount: number) => {
    setState(prev => {
      const updatedLiabilities = prev.liabilities.map(l => {
        if (l.id === liabilityId) {
          return { ...l, paidAmount: l.paidAmount + amount };
        }
        return l;
      });

      const targetDebt = prev.liabilities.find(l => l.id === liabilityId);
      const note = targetDebt ? `${targetDebt.title} পরিশোধ` : 'ঋণ শোধ';

      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'expense',
        amount: amount,
        category: 'ঋণ শোধ',
        date: new Date().toISOString().split('T')[0],
        note: note
      };

      return {
        ...prev,
        liabilities: updatedLiabilities,
        transactions: [newTransaction, ...prev.transactions],
        bankBalance: prev.bankBalance - amount
      };
    });
  };

  const addGoal = (g: Omit<Goal, 'id'>) => {
    const newG = { ...g, id: Date.now().toString() };
    setState(prev => ({ ...prev, goals: [...prev.goals, newG] }));
  };

  const addLiability = (l: Omit<Liability, 'id'>) => {
    const newL = { ...l, id: Date.now().toString() };
    setState(prev => ({ ...prev, liabilities: [...prev.liabilities, newL] }));
  };

  const updateBankBalance = (amount: number) => {
    setState(prev => ({ ...prev, bankBalance: amount }));
  };

  const updateSettings = (installment: number, fatherSupport: number) => {
    setState(prev => ({ 
      ...prev, 
      monthlyInstallment: installment,
      monthlyFatherSupport: fatherSupport
    }));
  };

  const deleteItem = (type: 'transaction' | 'goal' | 'liability', id: string) => {
    setState(prev => {
      switch(type) {
        case 'transaction':
          const t = prev.transactions.find(x => x.id === id);
          const newBalance = t ? (t.type === 'income' ? prev.bankBalance - t.amount : prev.bankBalance + t.amount) : prev.bankBalance;
          return { ...prev, transactions: prev.transactions.filter(x => x.id !== id), bankBalance: newBalance };
        case 'goal':
          return { ...prev, goals: prev.goals.filter(x => x.id !== id) };
        case 'liability':
          return { ...prev, liabilities: prev.liabilities.filter(x => x.id !== id) };
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-['Hind_Siliguri']">
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 py-4 md:px-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg md:text-xl font-black text-white tracking-tight">রাব্বি হোসেনের হিসাব বই</h1>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold transition shadow-lg shadow-indigo-600/30 active:scale-95"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">নতুন এন্ট্রি</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto pt-24 pb-32 px-4 md:px-8">
        <div className="mb-8">
           <AIAnalystHero state={state} />
        </div>

        {activeTab === 'dashboard' && (
          <Dashboard state={state} onUpdateBalance={updateBankBalance} />
        )}
        {activeTab === 'history' && (
          <TransactionList transactions={state.transactions} onDelete={(id) => deleteItem('transaction', id)} />
        )}
        {activeTab === 'goals' && (
          <GoalSection goals={state.goals} onDelete={(id) => deleteItem('goal', id)} />
        )}
        {activeTab === 'debts' && (
          <LiabilitySection liabilities={state.liabilities} onDelete={(id) => deleteItem('liability', id)} />
        )}
        {activeTab === 'strategy' && (
          <StrategySection state={state} />
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-2xl border-t border-slate-800">
        <div className="max-w-4xl mx-auto flex justify-around items-center px-2 py-3">
          <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-1 p-2 transition-all ${activeTab === 'dashboard' ? 'text-indigo-400 scale-110' : 'text-slate-500'}`}><LayoutDashboard size={24} /><span className="text-[10px] font-bold">ড্যাশবোর্ড</span></button>
          <button onClick={() => setActiveTab('history')} className={`flex flex-col items-center gap-1 p-2 transition-all ${activeTab === 'history' ? 'text-indigo-400 scale-110' : 'text-slate-500'}`}><History size={24} /><span className="text-[10px] font-bold">লেনদেন</span></button>
          <button onClick={() => setActiveTab('goals')} className={`flex flex-col items-center gap-1 p-2 transition-all ${activeTab === 'goals' ? 'text-indigo-400 scale-110' : 'text-slate-500'}`}><Target size={24} /><span className="text-[10px] font-bold">লক্ষ্যমাত্রা</span></button>
          <button onClick={() => setActiveTab('debts')} className={`flex flex-col items-center gap-1 p-2 transition-all ${activeTab === 'debts' ? 'text-indigo-400 scale-110' : 'text-slate-500'}`}><Wallet size={24} /><span className="text-[10px] font-bold">দায়-দেনা</span></button>
          <button onClick={() => setActiveTab('strategy')} className={`flex flex-col items-center gap-1 p-2 transition-all ${activeTab === 'strategy' ? 'text-indigo-400 scale-110' : 'text-slate-500'}`}><Lightbulb size={24} /><span className="text-[10px] font-bold">পরিকল্পনা</span></button>
        </div>
      </footer>

      {isModalOpen && (
        <AddDataModal 
          onClose={() => setIsModalOpen(false)}
          onAddTransaction={addTransaction}
          onRecordDebtPayment={recordDebtPayment}
          onAddGoal={addGoal}
          onAddLiability={addLiability}
          liabilities={state.liabilities}
          currentInstallment={state.monthlyInstallment}
          currentFatherSupport={state.monthlyFatherSupport}
          onUpdateSettings={updateSettings}
        />
      )}
    </div>
  );
};

export default App;
