
import React, { useMemo } from 'react';
import { FinancialState } from '../types';
import { 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight,
  CircleDollarSign,
  Target,
  CalendarClock,
  Heart,
  ShieldCheck,
  TrendingUp,
  Wallet
} from 'lucide-react';

interface DashboardProps {
  state: FinancialState;
  onUpdateBalance: (val: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ state, onUpdateBalance }) => {
  const currentMonthTransactions = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    return state.transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });
  }, [state.transactions]);

  const monthlyStats = useMemo(() => {
    return currentMonthTransactions.reduce((acc, t) => {
      if (t.type === 'income') acc.income += t.amount;
      else acc.expense += t.amount;
      return acc;
    }, { income: 0, expense: 0 });
  }, [currentMonthTransactions]);

  const totalRemainingDebt = useMemo(() => {
    return state.liabilities.reduce((sum, l) => sum + (l.totalAmount || l.amount) - (l.paidAmount || 0), 0);
  }, [state.liabilities]);

  const fatherTransfersThisMonth = useMemo(() => {
     return currentMonthTransactions
      .filter(t => t.category.includes('আব্বু') || t.note.includes('আব্বু'))
      .reduce((sum, t) => sum + t.amount, 0);
  }, [currentMonthTransactions]);

  const specialDebts = useMemo(() => {
    return state.liabilities.filter(l => l.type === 'special' || ['তমা', 'মামা', 'কিস্তি'].some(keyword => l.title.includes(keyword)));
  }, [state.liabilities]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Primary Balance Section (Coordinated View) */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-600/30 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:rotate-0 transition-all duration-500">
            <Wallet size={140} />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <p className="text-indigo-100/70 text-sm font-bold uppercase tracking-widest mb-2">সমন্বয়কৃত ব্যাংক ব্যালেন্স</p>
              <h3 className="text-4xl md:text-5xl font-black text-white">৳ {state.bankBalance.toLocaleString('bn-BD')}</h3>
              <p className="mt-3 text-indigo-100/60 text-xs italic">আয়, ব্যয় ও ঋণ শোধের পর আপনার বর্তমান নগদ অবস্থা</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-indigo-100 font-bold uppercase">মাসিক ফ্লো</p>
                  <p className="text-lg font-bold text-white">৳ {(monthlyStats.income - monthlyStats.expense).toLocaleString('bn-BD')}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/10">
             <input type="range" className="w-full h-1.5 bg-indigo-500/50 rounded-lg appearance-none cursor-pointer accent-white" min="0" max="2000000" step="5000" value={Math.min(state.bankBalance, 2000000)} onChange={(e) => onUpdateBalance(Number(e.target.value))} />
          </div>
        </div>
      </div>

      {/* Debt Repayment Progress Trackers */}
      <div className="bg-slate-900/50 border border-slate-800 p-6 md:p-8 rounded-[2rem] space-y-6">
        <div className="flex justify-between items-center">
          <h4 className="text-white font-bold flex items-center gap-3">
            <ShieldCheck className="text-indigo-400" size={24} />
            ঋণ ও কিস্তি আপডেট
          </h4>
          <span className="text-[10px] bg-slate-800 px-3 py-1 rounded-full text-slate-400 font-bold uppercase">সক্রিয় ট্র্যাক</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {specialDebts.map(debt => {
            const total = debt.totalAmount || debt.amount;
            const paid = debt.paidAmount || 0;
            const remaining = total - paid;
            const progress = Math.min((paid / total) * 100, 100);

            return (
              <div key={debt.id} className="bg-slate-950 p-6 rounded-3xl border border-slate-800/50 hover:border-indigo-500/30 transition-all group shadow-lg">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-md font-black text-slate-100">{debt.title}</span>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-indigo-400">{progress.toFixed(0)}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full mb-4 overflow-hidden shadow-inner">
                  <div className="bg-gradient-to-r from-indigo-600 to-indigo-400 h-full transition-all duration-1000 shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: `${progress}%` }} />
                </div>
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">বাকি</span>
                    <span className="text-sm font-black text-rose-500">৳ {remaining.toLocaleString('bn-BD')}</span>
                  </div>
                  <div className="flex justify-between items-center opacity-60">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">পরিশোধিত</span>
                    <span className="text-xs font-bold text-emerald-400">৳ {paid.toLocaleString('bn-BD')}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between group overflow-hidden relative">
          <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:rotate-12 transition-transform"><CalendarClock size={70} /></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500"><CalendarClock size={24} /></div>
            <div>
              <h4 className="text-white font-bold text-sm">মাসিক কিস্তি লক্ষ্য</h4>
              <p className="text-amber-500/70 text-[10px] uppercase font-bold tracking-wider">পরিমাণ: ৳ {state.monthlyInstallment.toLocaleString('bn-BD')}</p>
            </div>
          </div>
          <div className="text-right relative z-10"><span className="text-xl font-black text-white">৳ {state.monthlyInstallment.toLocaleString('bn-BD')}</span></div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between group overflow-hidden relative">
          <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><Heart size={70} /></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-rose-500/10 rounded-xl text-rose-500"><Heart size={24} /></div>
            <div>
              <h4 className="text-white font-bold text-sm">আব্বুর একাউন্টে পাঠানো</h4>
              <p className="text-rose-400 text-[10px] font-bold">এই মাসে: ৳ {fatherTransfersThisMonth.toLocaleString('bn-BD')}</p>
            </div>
          </div>
          <div className="text-right relative z-10"><span className="text-xl font-black text-white">৳ {state.monthlyFatherSupport.toLocaleString('bn-BD')}</span></div>
        </div>
      </div>

      {/* Main Stats (Secondary) */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col gap-2">
          <div className="flex justify-between items-center"><p className="text-slate-400 text-xs font-bold uppercase tracking-wider">মাসিক আয়</p><ArrowUpRight className="text-emerald-500" size={16} /></div>
          <h3 className="text-xl font-bold text-white">৳ {monthlyStats.income.toLocaleString('bn-BD')}</h3>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col gap-2">
          <div className="flex justify-between items-center"><p className="text-slate-400 text-xs font-bold uppercase tracking-wider">মাসিক ব্যয়</p><ArrowDownRight className="text-rose-500" size={16} /></div>
          <h3 className="text-xl font-bold text-white">৳ {monthlyStats.expense.toLocaleString('bn-BD')}</h3>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col gap-2 col-span-2 lg:col-span-1">
          <div className="flex justify-between items-center"><p className="text-slate-400 text-xs font-bold uppercase tracking-wider">মোট বকেয়া ঋণ</p><CircleDollarSign className="text-amber-500" size={16} /></div>
          <h3 className="text-xl font-bold text-white">৳ {totalRemainingDebt.toLocaleString('bn-BD')}</h3>
        </div>
      </div>

      {/* Goals Section Small */}
      <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
        <h4 className="text-white text-lg font-bold flex items-center gap-3 mb-6"><Target className="text-indigo-400" size={22} />আর্থিক লক্ষ্যমাত্রা</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {state.goals.slice(0, 4).map(goal => {
            const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
            return (
              <div key={goal.id} className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60 space-y-2">
                <div className="flex justify-between text-xs"><span className="text-slate-200 font-semibold">{goal.title}</span><span className="text-indigo-400 font-bold">{progress.toFixed(0)}%</span></div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden"><div className="h-full bg-indigo-500" style={{ width: `${progress}%` }} /></div>
              </div>
            );
          })}
          {state.goals.length === 0 && <div className="col-span-full text-center py-4 opacity-30 italic text-sm">কোন লক্ষ্যমাত্রা নেই</div>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
