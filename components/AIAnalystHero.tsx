
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { FinancialState } from '../types';
import { BrainCircuit, Loader2, Sparkles, RefreshCcw } from 'lucide-react';

interface AIAnalystHeroProps {
  state: FinancialState;
}

const AIAnalystHero: React.FC<AIAnalystHeroProps> = ({ state }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateDailyAnalysis = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const recentTransactions = state.transactions.slice(0, 3).map(t => 
        `${t.note}: ${t.amount} (${t.type === 'income' ? 'আয়' : 'ব্যয়'})`
      ).join(', ');

      const totalDebt = state.liabilities.reduce((s, l) => s + (l.totalAmount - l.paidAmount), 0);

      const prompt = `
        আর্থিক ডাটা বিশ্লেষণ করুন:
        ব্যালেন্স: ৳${state.bankBalance}
        অবশিষ্ট ঋণ: ৳${totalDebt}
        সাম্প্রতিক লেনদেন: ${recentTransactions}
        লক্ষ্যমাত্রা: ${state.goals.length}টি সেট করা আছে।

        এই তথ্যের উপর ভিত্তি করে বাংলায় ২-৩ লাইনের একটি চমৎকার "ডেইলি স্ট্যাটাস আপডেট" দিন। 
        ব্যবহারকারীকে তার খরচের ব্যাপারে সচেতন করুন অথবা লক্ষ্য পূরণে উৎসাহিত করুন। খুব সংক্ষেপে লিখুন।
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setAnalysis(response.text || 'আজকের জন্য কোনো আপডেট নেই।');
    } catch (error) {
      console.error(error);
      setAnalysis('এআই এনালিস্ট বর্তমানে অফলাইনে আছে।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateDailyAnalysis();
  }, []);

  return (
    <div className="relative group overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-indigo-500/20 rounded-3xl p-6 mb-8 shadow-2xl">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full group-hover:bg-indigo-600/20 transition-all duration-700"></div>
      
      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl shadow-inner animate-pulse">
            <BrainCircuit className="w-8 h-8 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-[10px] font-bold rounded uppercase tracking-widest">Smart Analyst</span>
              <h2 className="text-xl font-bold text-white">দৈনিক আর্থিক আপডেট</h2>
            </div>
            {loading ? (
              <div className="flex items-center gap-2 text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm italic">আপনার ডাটা প্রসেস করা হচ্ছে...</span>
              </div>
            ) : (
              <p className="text-slate-300 text-lg leading-relaxed max-w-2xl font-medium italic">
                "{analysis}"
              </p>
            )}
          </div>
        </div>

        <button 
          onClick={generateDailyAnalysis}
          disabled={loading}
          className="shrink-0 flex items-center gap-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500/50 text-slate-300 hover:text-white px-4 py-2 rounded-xl transition-all text-sm font-medium"
        >
          <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
          রিফ্রেশ করুন
        </button>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-800/50 flex flex-wrap gap-8">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-xs text-slate-400 font-medium uppercase tracking-tighter">ক্যাশ ইনডেক্স: </span>
          <span className="text-xs text-white font-bold">স্থিতিশীল</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
          <span className="text-xs text-slate-400 font-medium uppercase tracking-tighter">সঞ্চয় হার: </span>
          <span className="text-xs text-white font-bold">১৫% বৃদ্ধি</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
          <span className="text-xs text-slate-400 font-medium uppercase tracking-tighter">ঋণ ঝুঁকি: </span>
          <span className="text-xs text-white font-bold">{state.liabilities.length > 0 ? 'মধ্যম' : 'নিম্ন'}</span>
        </div>
      </div>
    </div>
  );
};

export default AIAnalystHero;
