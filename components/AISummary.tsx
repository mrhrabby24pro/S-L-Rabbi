
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { FinancialState } from '../types';
import { BrainCircuit, Loader2, Sparkles } from 'lucide-react';

interface AISummaryProps {
  state: FinancialState;
}

const AISummary: React.FC<AISummaryProps> = ({ state }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateAdvice = async () => {
    setLoading(true);
    try {
      // Fix: Ensure strictly using process.env.API_KEY for initialization as per guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        এখানে একজন ব্যবহারকারীর আর্থিক তথ্য দেওয়া হলো:
        সর্বমোট ব্যালেন্স: ${state.bankBalance}
        সাম্প্রতিক লেনদেন: ${state.transactions.slice(0, 5).map(t => `${t.note}: ${t.amount} (${t.type})`).join(', ')}
        লক্ষ্যমাত্রা: ${state.goals.map(g => `${g.title}: ${g.currentAmount}/${g.targetAmount}`).join(', ')}
        ঋণ: ${state.liabilities.map(l => `${l.title}: ${l.amount}`).join(', ')}

        এই ডাটা বিশ্লেষণ করে বাংলায় ছোট ৩-৪ লাইনের একটি আর্থিক পরামর্শ দিন যাতে তিনি তার লক্ষ্যগুলো সহজে পূরণ করতে পারেন এবং ঋণ কমাতে পারেন। তাকে অনুপ্রাণিত করুন।
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setAdvice(response.text || 'দুঃখিত, কোনো পরামর্শ তৈরি করা যায়নি।');
    } catch (error) {
      console.error(error);
      setAdvice('এআই পরামর্শ পেতে সমস্যা হচ্ছে। দয়া করে আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/30 p-5 rounded-2xl relative overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={18} className="text-amber-400 animate-pulse" />
        <h4 className="text-white font-bold text-sm">এআই ফাইন্যান্সিয়াল গাইড</h4>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="animate-spin text-indigo-400" />
        </div>
      ) : advice ? (
        <p className="text-slate-300 text-xs leading-relaxed mb-4 italic">
          "{advice}"
        </p>
      ) : (
        <p className="text-slate-400 text-xs mb-4">
          আপনার আর্থিক ডাটা বিশ্লেষণ করে স্মার্ট পরামর্শ নিন।
        </p>
      )}

      <button 
        onClick={generateAdvice}
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white text-xs py-2 rounded-xl transition font-medium flex items-center justify-center gap-2"
      >
        <BrainCircuit size={14} />
        {advice ? 'আবার পরামর্শ নিন' : 'পরামর্শ জেনারেট করুন'}
      </button>
    </div>
  );
};

export default AISummary;
