import React from 'react';
import { Mail, Clock, ShieldCheck } from 'lucide-react';

const Inbox = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in">
      <div className="glass-card p-12 text-center border-white/[0.08] bg-white/[0.01] shadow-2xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary-600/10 blur-[120px] -z-10 rounded-full" />
        
        <div className="w-20 h-20 rounded-[2.5rem] bg-gradient-to-br from-primary-600 to-accent-purple flex items-center justify-center mx-auto mb-8 shadow-glow-lg">
           <Mail size={40} className="text-white" />
        </div>
        
        <h1 className="font-display font-black text-4xl text-white mb-4 tracking-tight">Your Digital Inbox</h1>
        <p className="text-gray-400 max-w-md mx-auto leading-relaxed mb-10">
          This is your personal workspace for private interactions, notifications, and curated intelligence relevant to your domains.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto text-left">
           <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-3 mb-2 text-primary-400 font-bold text-xs uppercase tracking-widest">
                 <Clock size={14} /> Coming Soon
              </div>
              <p className="text-white font-bold mb-1">Direct Messaging</p>
              <p className="text-[10px] text-gray-500">Secure end-to-end encrypted communication with other knowledge seekers.</p>
           </div>
           <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-3 mb-2 text-accent-purple font-bold text-xs uppercase tracking-widest">
                 <ShieldCheck size={14} /> Protected
              </div>
              <p className="text-white font-bold mb-1">Curation Logic</p>
              <p className="text-[10px] text-gray-500">Intelligent filtering based on your selected domains and active discussions.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Inbox;
