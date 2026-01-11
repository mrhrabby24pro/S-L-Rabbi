
import React, { useState } from 'react';
import { Transaction, Goal, Liability, TransactionType } from '../types';
import { X, Plus, Wallet, Target, CreditCard, CalendarClock, Heart, Landmark, CheckCircle2, User, Users } from 'lucide-react';

interface AddDataModalProps {
  onClose: () => void;
  onAddTransaction: (t: Omit<Transaction, 'id'>) => void;
  onRecordDebtPayment: (liabilityId: string, amount: number) => void;
  onAddGoal: (g: Omit<Goal, 'id'>) => void;
  onAddLiability: (l: Omit<Liability, 'id'>) => void;
  liabilities: Liability[];
  currentInstallment: number;
  currentFatherSupport: number;
  onUpdateSettings: (installment: number, fatherSupport: number) => void;
}

const AddDataModal: React.FC<AddDataModalProps> = ({ 
  onClose, 
  onAddTransaction, 
  onRecordDebtPayment,
  onAddGoal, 
  onAddLiability,
  liabilities,
  currentInstallment,
  currentFatherSupport,
  onUpdateSettings
}) => {
  const [formType, setFormType] = useState<'transaction' | 'repayment' | 'father' | 'settings'>('transaction');
  
  // Transaction Form State
  const [tData, setTData] = useState({ amount: '', type: 'expense' as TransactionType, category: 'সাধারণ', note: '', date: new Date().toISOString().split('T')[0] });
  
  // Repayment State
  const [repaymentData, setRepaymentData] = useState({ liabilityId: '', amount: '' });
  
  // Settings State
  const [settings, setSettings] = useState({ installment: currentInstallment.toString(), fatherSupport: currentFatherSupport.toString() });

  const handleQuickDebtSelect = (id: string) => {
    setRepaymentData({ ...repaymentData, liabilityId: id });
    setFormType('repayment');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formType === 'transaction') {
      onAddTransaction({ ...tData, amount: Number(tData.amount) });
    } else if (formType === 'settings') {
      onUpdateSettings(Number(settings.installment), Number(settings.fatherSupport));
    } else if (formType === 'father') {
      onAddTransaction({
        amount: Number(tData.amount),
        type: 'expense',
        category: 'পিতার জন্য',
        note: 'আব্বুর ব্যাংক একাউন্টে পাঠানো টাকা',
        date: tData.date
      });
    } else if (formType === 'repayment') {
      if (!repaymentData.liabilityId) return;
      onRecordDebtPayment(repaymentData.liabilityId, Number(repaymentData.amount));
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/20">
          <h3 className="text-xl font-bold text-white">হিসাব যোগ করুন</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition text-slate-400"><X size={20} /></button>
        </div>

        {/* Quick Access Debt Buttons (Requested "Separate Fields") */}
        <div className="p-4 bg-slate-950/40 border-b border-slate-800/50">
          <p className="text-[10px] text-slate-500 font-bold uppercase mb-3 text-center tracking-widest">দ্রুত পরিশোধ (তমা, মামা, কিস্তি)</p>
          <div className="flex gap-2">
             <button onClick={() => handleQuickDebtSelect('sd-toma')} className="flex-1 py-3 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-2xl flex flex-col items-center gap-1 transition group">
                <User size={18} className="text-indigo-400 group-hover:scale-110 transition" />
                <span className="text-[10px] font-black text-indigo-300">তমা</span>
             </button>
             <button onClick={() => handleQuickDebtSelect('sd-mama')} className="flex-1 py-3 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-2xl flex flex-col items-center gap-1 transition group">
                <Users size={18} className="text-indigo-400 group-hover:scale-110 transition" />
                <span className="text-[10px] font-black text-indigo-300">মামা</span>
             </button>
             <button onClick={() => handleQuickDebtSelect('sd-kisti')} className="flex-1 py-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-2xl flex flex-col items-center gap-1 transition group">
                <CalendarClock size={18} className="text-amber-400 group-hover:scale-110 transition" />
                <span className="text-[10px] font-black text-amber-300">কিস্তি</span>
             </button>
          </div>
        </div>

        <div className="p-4 bg-slate-950/50 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <button onClick={() => setFormType('transaction')} className={`px-5 py-2.5 text-xs font-bold rounded-2xl border transition ${formType === 'transaction' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>সাধারণ লেনদেন</button>
          <button onClick={() => setFormType('repayment')} className={`px-5 py-2.5 text-xs font-bold rounded-2xl border transition ${formType === 'repayment' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>ঋণ পরিশোধ</button>
          <button onClick={() => setFormType('father')} className={`px-5 py-2.5 text-xs font-bold rounded-2xl border transition ${formType === 'father' ? 'bg-rose-600 border-rose-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>আব্বুকে পাঠানো</button>
          <button onClick={() => setFormType('settings')} className={`px-5 py-2.5 text-xs font-bold rounded-2xl border transition ${formType === 'settings' ? 'bg-amber-600 border-amber-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>সেটিংস</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {formType === 'transaction' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase ml-1">ধরণ</label>
                  <select value={tData.type} onChange={e => setTData({...tData, type: e.target.value as any})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:border-indigo-500 transition outline-none"><option value="expense">ব্যয় (-)</option><option value="income">আয় (+)</option></select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase ml-1">পরিমাণ</label>
                  <input required type="number" value={tData.amount} onChange={e => setTData({...tData, amount: e.target.value})} placeholder="0.00" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold uppercase ml-1">লেনদেনের বিস্তারিত</label>
                <input type="text" value={tData.note} onChange={e => setTData({...tData, note: e.target.value})} placeholder="যেমন: বাজার খরচ" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold uppercase ml-1">তারিখ</label>
                <input type="date" value={tData.date} onChange={e => setTData({...tData, date: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none" />
              </div>
            </div>
          )}

          {formType === 'repayment' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-600/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner"><CheckCircle2 size={32} /></div>
                <h4 className="text-white font-black text-lg">ঋণ বা কিস্তি পরিশোধ</h4>
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">ব্যালেন্স থেকে সমন্বয় হবে</p>
              </div>
              <div className="space-y-4">
                <select 
                  required
                  value={repaymentData.liabilityId} 
                  onChange={e => setRepaymentData({...repaymentData, liabilityId: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-4 text-slate-200 font-bold focus:border-indigo-500 outline-none"
                >
                  <option value="" disabled>কার টাকা পরিশোধ করছেন?</option>
                  {liabilities.map(l => (
                    <option key={l.id} value={l.id}>{l.title} (৳ {(l.totalAmount || l.amount) - (l.paidAmount || 0)} বাকি)</option>
                  ))}
                </select>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-500">৳</span>
                  <input 
                    required type="number" 
                    value={repaymentData.amount} 
                    onChange={e => setRepaymentData({...repaymentData, amount: e.target.value})} 
                    placeholder="0" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-6 py-5 text-3xl font-black text-white focus:border-indigo-500 outline-none shadow-inner" 
                  />
                </div>
              </div>
            </div>
          )}

          {formType === 'father' && (
            <div className="space-y-6">
               <div className="text-center">
                 <div className="w-16 h-16 bg-rose-600/20 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner"><Heart size={32} /></div>
                 <h4 className="text-white font-black text-lg">আব্বুর ব্যাংক একাউন্টে পাঠানো</h4>
                 <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">পিতার জন্য বরাদ্দকৃত খরচ</p>
               </div>
               <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-500">৳</span>
                  <input required type="number" value={tData.amount} onChange={e => setTData({...tData, amount: e.target.value})} placeholder="0" className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-6 py-5 text-3xl font-black text-white text-center focus:border-rose-500 outline-none shadow-inner" />
               </div>
            </div>
          )}

          {formType === 'settings' && (
            <div className="space-y-5">
               <div className="space-y-1">
                 <label className="text-[10px] text-slate-500 font-bold uppercase ml-1">মাসিক কিস্তির লক্ষ্যমাত্রা</label>
                 <input required type="number" value={settings.installment} onChange={e => setSettings({...settings, installment: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500" />
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] text-slate-500 font-bold uppercase ml-1">আব্বুর জন্য মাসিক লক্ষ্য</label>
                 <input required type="number" value={settings.fatherSupport} onChange={e => setSettings({...settings, fatherSupport: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500" />
               </div>
            </div>
          )}

          <button type="submit" className={`w-full ${formType === 'father' ? 'bg-rose-600 hover:bg-rose-700' : formType === 'settings' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white font-black py-5 rounded-3xl shadow-xl transition-all active:scale-95 text-lg`}>সংরক্ষণ করুন</button>
        </form>
      </div>
    </div>
  );
};

export default AddDataModal;
