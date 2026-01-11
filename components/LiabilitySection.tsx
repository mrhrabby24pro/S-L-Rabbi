
import React from 'react';
import { Liability } from '../types';
import { ShieldAlert, Trash2, ArrowRightLeft, Landmark } from 'lucide-react';

interface LiabilitySectionProps {
  liabilities: Liability[];
  onDelete: (id: string) => void;
}

const LiabilitySection: React.FC<LiabilitySectionProps> = ({ liabilities, onDelete }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {liabilities.map(l => (
          <div key={l.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${l.type === 'loan' ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'}`}>
                {l.type === 'loan' ? <Landmark size={24} /> : <ShieldAlert size={24} />}
              </div>
              <div>
                <h4 className="text-white font-bold">{l.title}</h4>
                <p className="text-slate-500 text-xs uppercase tracking-tight">{l.type === 'loan' ? 'ব্যাংক ঋণ' : 'ব্যক্তিগত দায়'}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <span className="text-xl font-bold text-white block">৳ {l.amount.toLocaleString('bn-BD')}</span>
                <span className="text-slate-500 text-xs italic">পরিশোধের জন্য অপেক্ষমাণ</span>
              </div>
              <button 
                onClick={() => onDelete(l.id)}
                className="p-2 text-slate-700 hover:text-rose-500 transition opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {liabilities.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500 border-2 border-dashed border-slate-800 rounded-3xl">
          <ArrowRightLeft size={48} className="mb-4 opacity-20" />
          <p>আপনার কোন ঋণ বা দায়বদ্ধতা নেই। অভিনন্দন!</p>
        </div>
      )}
    </div>
  );
};

export default LiabilitySection;
