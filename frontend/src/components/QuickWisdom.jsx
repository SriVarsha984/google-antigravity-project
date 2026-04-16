import React, { useState, useEffect } from 'react';
import { Lightbulb, Sparkles, Zap, BrainCircuit, RefreshCw } from 'lucide-react';

const WISDOM_SNIPPETS = [
  { title: 'Clarity is Key', desc: 'Use a title that summarizes your core question or thesis effectively. Avoid vague teasers.', icon: Lightbulb, color: 'text-amber-400' },
  { title: 'Provide Context', desc: 'Add links, snippets, or background info to help others understand your perspective.', icon: BrainCircuit, color: 'text-primary-400' },
  { title: 'Engage Others', desc: 'End with a question or a call to action to spark deeper community discussion.', icon: Sparkles, color: 'text-accent-purple' },
  { title: 'Format matters', desc: 'Use bullet points and clear paragraphs to make your complex ideas digestible.', icon: Zap, color: 'text-emerald-400' },
  { title: 'Respect the Loop', desc: 'Acknowledge other perspectives even when you disagree. Civil discourse is a super-power.', icon: RefreshCw, color: 'text-rose-400' }
];

const QuickWisdom = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % WISDOM_SNIPPETS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const current = WISDOM_SNIPPETS[index];

  return (
    <div className="glass-card p-6 border-primary-500/10 bg-white/[0.01] relative overflow-hidden group">
      {/* Background glow */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 bg-primary-600/5 blur-[60px] rounded-full transition-opacity duration-1000 group-hover:opacity-100 opacity-50`} />
      
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-xl bg-white/[0.03] border border-white/5 ${current.color} shadow-sm group-hover:scale-110 transition-transform`}>
           <current.icon size={18} />
        </div>
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Quick Wisdom</h4>
      </div>
      
      <div className="animate-fade-in-up key={index}">
        <h3 className="text-white font-black text-sm mb-2 tracking-tight">{current.title}</h3>
        <p className="text-xs text-gray-500 leading-relaxed font-medium">
          {current.desc}
        </p>
      </div>

      <div className="mt-6 flex gap-1">
        {WISDOM_SNIPPETS.map((_, i) => (
          <div 
            key={i} 
            className={`h-0.5 rounded-full transition-all duration-500 ${i === index ? 'w-4 bg-primary-500' : 'w-1 bg-white/10'}`} 
          />
        ))}
      </div>
    </div>
  );
};

export default QuickWisdom;
