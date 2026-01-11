
import React from 'react';
import { Transaction } from '../types';
import { 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Trash2, 
  Calendar,
  Tag,
  Search
} from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete }) => {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="খুঁজুন..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500 text-slate-200"
          />
        </div>
        <div className="flex gap-2">
          <select className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-500">
            <option>সব লেনদেন</option>
            <option>আয়</option>
            <option>ব্যয়</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase">
            <tr>
              <th className="px-6 py-4 font-medium">বিবরণ/ক্যাটাগরি</th>
              <th className="px-6 py-4 font-medium">তারিখ</th>
              <th className="px-6 py-4 font-medium">ধরণ</th>
              <th className="px-6 py-4 font-medium text-right">পরিমাণ</th>
              <th className="px-6 py-4 font-medium text-center">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {transactions.map(t => (
              <tr key={t.id} className="hover:bg-slate-800/30 transition group">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-white font-medium">{t.note || 'বিনা শিরোনাম'}</span>
                    <span className="text-slate-500 text-xs flex items-center gap-1">
                      <Tag size={12} /> {t.category}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-slate-400 text-sm flex items-center gap-1">
                    <Calendar size={14} /> {new Date(t.date).toLocaleDateString('bn-BD')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${t.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                    {t.type === 'income' ? 'আয়' : 'ব্যয়'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className={`text-sm font-bold ${t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {t.type === 'income' ? '+' : '-'} ৳ {t.amount.toLocaleString('bn-BD')}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => onDelete(t.id)}
                    className="p-2 text-slate-600 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-20 text-slate-500 italic">
                  এখনো কোন লেনদেন যুক্ত করা হয়নি
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;
