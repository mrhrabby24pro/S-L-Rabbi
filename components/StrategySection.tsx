
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { FinancialState } from '../types';
import { 
  Lightbulb, 
  ChevronRight, 
  ArrowUpCircle, 
  CheckCircle2, 
  Loader2, 
  Compass, 
  ShieldCheck, 
  Zap,
  TrendingUp
} from 'lucide-react';

interface StrategySectionProps {
  state: FinancialState;
}

const StrategySection: React.FC<StrategySectionProps> = ({ state }) => {
  const [strategy, setStrategy] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateStrategy = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        আর্থিক ডাটা:
        ব্যালেন্স: ৳${state.bankBalance}
        ঋণ: ${state.liabilities.map(l => `${l.title} (৳${l.amount})`).join(', ')}
        লক্ষ্যমাত্রা: ${state.goals.map(g => `${g.title} (টার্গেট ৳${g.targetAmount}, জমা ৳${g.currentAmount})`).join(', ')}

        এই ডাটার উপর ভিত্তি করে:
        ১. ঋণ পরিশোধের একটি নির্দিষ্ট পদ্ধতি (যেমন: Debt Snowball বা Avalanche) সাজান।
        ২. লক্ষ্যগুলো দ্রুত পূরণ করার জন্য ৩টি প্র্যাকটিক্যাল আইডিয়া দিন।
        ৩. বর্তমানে কোন খাতে খরচ কমানো উচিত তার ১টি পরামর্শ দিন।
        
        উত্তরটি বাংলায় সুন্দরভাবে পয়েন্ট আকারে ২-৩ প্যারাগ্রাফে লিখুন।
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setStrategy(response.text || 'কোন পরামর্শ তৈরি করা যায়নি।');
    } catch (error) {
      console.error(error);
      setStrategy('পরিকল্পনা জেনারেট করতে সমস্যা হচ্ছে।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateStrategy();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* AI Strategy Hero */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
          <Compass size={120} className="text-indigo-400" />
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
          <div className="md:w-1/3 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-bold uppercase tracking-widest border border-indigo-500/20">
              <Zap size={14} /> AI Action Plan
            </div>
            <h3 className="text-3xl font-bold text-white leading-tight">ঋণমুক্ত হওয়ার ও লক্ষ্য পূরণের গাইড</h3>
            <p className="text-slate-400 text-sm leading-relaxed">আপনার আর্থিক অবস্থার গভীর বিশ্লেষণের পর এই পরিকল্পনাটি তৈরি করা হয়েছে।</p>
            <button 
              onClick={generateStrategy}
              disabled={loading}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <TrendingUp size={18} />}
              নতুন পরিকল্পনা তৈরি করুন
            </button>
          </div>

          <div className="md:w-2/3 bg-slate-950/50 rounded-2xl p-6 border border-slate-800/50 min-h-[200px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full py-10 space-y-4">
                <Loader2 className="animate-spin text-indigo-500 w-10 h-10" />
                <p className="text-slate-500 italic">আপনার ডাটা বিশ্লেষণ করা হচ্ছে...</p>
              </div>
            ) : (
              <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap font-medium">
                {strategy}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Core Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/30 transition group">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 mb-4 group-hover:scale-110 transition">
            <CheckCircle2 size={24} />
          </div>
          <h4 className="text-white font-bold mb-2">৫টেপ মেথড</h4>
          <p className="text-slate-500 text-sm">সবার আগে সব ঋণ তালিকাভুক্ত করুন এবং ছোট থেকে শুরু করুন।</p>
        </div>
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/30 transition group">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500 mb-4 group-hover:scale-110 transition">
            <ShieldCheck size={24} />
          </div>
          <h4 className="text-white font-bold mb-2">জরুরি তহবিল</h4>
          <p className="text-slate-500 text-sm">কমপক্ষে ৩ মাসের খরচ সঞ্চয় করুন যাতে ভবিষ্যতে ঋণ নিতে না হয়।</p>
        </div>
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/30 transition group">
          <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 mb-4 group-hover:scale-110 transition">
            <ArrowUpCircle size={24} />
          </div>
          <h4 className="text-white font-bold mb-2">অটোমেটেড সেভিংস</h4>
          <p className="text-slate-500 text-sm">আয় হওয়ার সাথে সাথে একটি নির্দিষ্ট অংশ সঞ্চয় অ্যাকাউন্টে পাঠিয়ে দিন।</p>
        </div>
      </div>

      {/* Strategy Methods Info */}
      <div className="bg-indigo-600/5 border border-indigo-500/20 rounded-3xl p-8">
        <h4 className="text-white font-bold mb-6 flex items-center gap-2">
          <Lightbulb className="text-amber-400" /> জনপ্রিয় ঋণ পরিশোধের পদ্ধতি
        </h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-3">
            <h5 className="text-indigo-400 font-bold flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] text-indigo-400">01</span>
              ডেবট স্নোবল (Debt Snowball)
            </h5>
            <p className="text-slate-400 text-sm leading-relaxed">
              সবার আগে সবচেয়ে ছোট ঋণটি পরিশোধ করুন। এতে আপনার মনে আত্মবিশ্বাস জন্মাবে এবং পরবর্তী ঋণের জন্য গতি বাড়বে। এটি মানসিক শান্তির জন্য সেরা।
            </p>
          </div>
          <div className="space-y-3">
            <h5 className="text-indigo-400 font-bold flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] text-indigo-400">02</span>
              ডেবট অ্যাভালাঞ্চ (Debt Avalanche)
            </h5>
            <p className="text-slate-400 text-sm leading-relaxed">
              সবার আগে সর্বোচ্চ সুদের হারের ঋণটি পরিশোধ করুন। গাণিতিকভাবে এটি আপনাকে সবচেয়ে বেশি অর্থ সাশ্রয় করতে সাহায্য করবে।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategySection;
