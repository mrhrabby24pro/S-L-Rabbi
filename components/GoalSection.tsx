
import React from 'react';
import { Goal } from '../types';
import { Target, Trash2, Calendar } from 'lucide-react';

interface GoalSectionProps {
  goals: Goal[];
  onDelete: (id: string) => void;
}

// Sub-component for individual goal cards to fix TS key prop error
const GoalCard: React.FC<{ goal: Goal; onDelete: (id: string) => void }> = ({ goal, onDelete }) => {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col gap-4 group hover:border-indigo-500/50 transition shadow-lg">
      <div className="flex justify-between items-start">
        <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
          <Target size={24} />
        </div>
        <button 
          onClick={() => onDelete(goal.id)}
          className="text-slate-600 hover:text-rose-500 transition opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={20} />
        </button>
      </div>
      <div>
        <h4 className="text-lg font-bold text-white mb-1">{goal.title}</h4>
        <p className="text-slate-500 text-xs flex items-center gap-1">
          <Calendar size={12} /> মেয়াদ: {new Date(goal.deadline).toLocaleDateString('bn-BD')}
        </p>
      </div>
      <div className="mt-2 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">অগ্রগতি</span>
          <span className="text-white font-bold">{progress.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-700"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs pt-1">
          <span className="text-slate-500">জমা: ৳ {goal.currentAmount.toLocaleString('bn-BD')}</span>
          <span className="text-slate-300">লক্ষ্য: ৳ {goal.targetAmount.toLocaleString('bn-BD')}</span>
        </div>
      </div>
    </div>
  );
};

const GoalSection: React.FC<GoalSectionProps> = ({ goals, onDelete }) => {
  const shortTerm = goals.filter(g => g.type === 'short-term');
  const longTerm = goals.filter(g => g.type === 'long-term');

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-1 flex-1 bg-slate-800"></div>
          <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs">স্বল্পমেয়াদী লক্ষ্যমাত্রা</h3>
          <div className="h-1 flex-1 bg-slate-800"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shortTerm.map(g => <GoalCard key={g.id} goal={g} onDelete={onDelete} />)}
          {shortTerm.length === 0 && (
            <div className="col-span-full text-center py-10 text-slate-600 border-2 border-dashed border-slate-800 rounded-2xl">
              কোন স্বল্পমেয়াদী লক্ষ্যমাত্রা নেই
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-1 flex-1 bg-slate-800"></div>
          <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs">২/৩ বছরের দীর্ঘমেয়াদী লক্ষ্যমাত্রা</h3>
          <div className="h-1 flex-1 bg-slate-800"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {longTerm.map(g => <GoalCard key={g.id} goal={g} onDelete={onDelete} />)}
          {longTerm.length === 0 && (
            <div className="col-span-full text-center py-10 text-slate-600 border-2 border-dashed border-slate-800 rounded-2xl">
              কোন দীর্ঘমেয়াদী লক্ষ্যমাত্রা নেই
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default GoalSection;
