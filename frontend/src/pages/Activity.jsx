import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, MessageSquare, User, Clock, ChevronRight, MessageCircle, Activity as ActivityIcon } from 'lucide-react';
import QuickWisdom from '../components/QuickWisdom';
import api from '../services/api';

const Activity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const { data } = await api.get('/activity');
        setActivities(data);
      } catch (error) {
        console.error('Failed to fetch activity:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, []);

  const timeAgo = (dateStr) => {
    const seconds = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return Math.floor(hours / 24) + 'd ago';
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 animate-fade-in group">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16 border-b border-white/[0.05] pb-10">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-primary-600 to-accent-purple flex items-center justify-center shadow-glow-lg border border-white/10 group-hover:scale-105 transition-transform duration-500">
            <Bell size={32} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-[9px] font-black uppercase tracking-[0.2em] mb-3 w-fit">
               <ActivityIcon size={10} /> Live Intelligence
            </div>
            <h1 className="font-display font-black text-4xl text-white tracking-tight leading-tight flex items-center gap-4">
              Network Pulsar
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_#10b981] animate-pulse" />
            </h1>
            <p className="text-gray-500 font-medium text-sm mt-1">Synchronized real-time knowledge streams.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left column: Activity Timeline */}
        <div className="lg:col-span-8 relative">
           {/* Timeline Track */}
           <div className="absolute left-[27px] top-4 bottom-4 w-px bg-gradient-to-b from-primary-500/30 via-white/[0.05] to-transparent hidden sm:block" />

           <div className="space-y-10">
             {loading ? (
               Array.from({ length: 6 }).map((_, i) => (
                 <div key={i} className="relative sm:pl-16 flex items-start gap-4 animate-pulse">
                   <div className="absolute left-0 top-1 hidden sm:block">
                     <div className="w-14 h-14 rounded-2xl bg-white/[0.02]" />
                   </div>
                   <div className="flex-1 glass-card p-6 h-32" />
                 </div>
               ))
             ) : activities.length > 0 ? (
               activities.map((act, idx) => (
                 <Link
                   key={`${act.type}-${act.id}-${idx}`}
                   to={act.type === 'thread' ? `/topic/${act.id}` : `/topic/${act.threadId}`}
                   className="group relative sm:pl-16 flex items-start gap-4 transition-all duration-500 block"
                 >
                   {/* Avatar / Icon Bubble */}
                   <div className="absolute left-0 top-0 hidden sm:block">
                     <div className="w-14 h-14 rounded-2xl bg-dark-800 border border-white/[0.08] group-hover:border-primary-500/40 flex items-center justify-center text-white font-black text-lg shadow-xl relative z-10 transition-all group-hover:scale-110 overflow-hidden">
                       {act.user?.profilePic ? (
                         <img src={act.user.profilePic} alt="" className="w-full h-full object-cover" />
                       ) : (
                         <div className="w-full h-full bg-gradient-to-br from-primary-600/20 to-accent-purple/20 flex items-center justify-center text-primary-400">
                           {act.user?.username?.[0] || '?'}
                         </div>
                       )}
                     </div>
                   </div>

                   <div className="flex-1 glass-card p-7 bg-white/[0.01] hover:bg-white/[0.03] border-white/[0.05] hover:border-primary-500/30 hover:shadow-card-hover transition-all duration-500 relative">
                     <div className="flex items-center justify-between gap-4 mb-4">
                       <div className="flex items-center gap-3">
                         <span className="text-[11px] font-black text-white p-1.5 rounded-lg bg-primary-600/20 border border-primary-500/30 shadow-glow uppercase truncate max-w-[120px]">@{act.user?.username || 'Guest'}</span>
                         <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                           {act.type === 'thread' ? 'initiated a stream' : 'contributed insight'}
                         </span>
                       </div>
                       <div className="flex items-center gap-1.5 text-[9px] font-black text-gray-600 uppercase tracking-widest whitespace-nowrap">
                         <Clock size={10} />
                         {timeAgo(act.timestamp)}
                       </div>
                     </div>

                     <h3 className="text-xl font-black text-white group-hover:text-primary-400 transition-colors mb-4 tracking-tight leading-tight">
                       {act.type === 'thread' ? act.title : act.threadTitle}
                     </h3>

                     {act.type === 'comment' && (
                       <div className="relative pl-5 border-l-2 border-primary-500/20 py-1 mb-5">
                         <p className="text-sm text-gray-400 italic font-medium leading-relaxed line-clamp-2">
                           "{act.content}"
                         </p>
                       </div>
                     )}

                     <div className="flex items-center gap-4 pt-5 border-t border-white/[0.03]">
                       <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[9px] font-black text-gray-500 uppercase tracking-widest">
                         {act.type === 'thread' ? <MessageSquare size={10} /> : <MessageCircle size={10} />}
                         {act.type === 'thread' ? 'Channel' : 'Insight'}
                       </div>
                       <div className="ml-auto flex items-center gap-2 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] group-hover:text-primary-500 transition-all">
                         Deep Dive <ChevronRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
                       </div>
                     </div>
                   </div>
                 </Link>
               ))
             ) : (
               <div className="glass-card p-32 text-center border-dashed border-white/10 shrink-0 mx-auto max-w-lg bg-transparent">
                 <div className="w-20 h-20 rounded-[2.5rem] bg-white/[0.02] flex items-center justify-center mx-auto mb-8">
                   <Bell size={32} className="text-gray-800" />
                 </div>
                 <h3 className="text-xl font-black text-white mb-2 tracking-tight">Zero Turbulence</h3>
                 <p className="text-gray-600 text-sm font-medium">The pulsar is waiting for community signal.</p>
                 <Link to="/create" className="btn-primary mt-10 px-10 py-4 shadow-glow">Simulate Signal</Link>
               </div>
             )}
           </div>
        </div>

        {/* Right column: Wisdom sidebar */}
        <aside className="lg:col-span-4 space-y-10">
           <QuickWisdom />
           
           <div className="glass-card p-8 bg-white/[0.01] border-white/[0.05]">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-6">Activity metrics</h4>
              <div className="space-y-6">
                 <div>
                    <p className="text-[10px] font-bold text-gray-600 uppercase mb-2">Network Health</p>
                    <div className="w-full h-1 bg-white/[0.05] rounded-full overflow-hidden">
                       <div className="w-[85%] h-full bg-gradient-to-r from-emerald-500 to-primary-500" />
                    </div>
                 </div>
                 <div>
                    <p className="text-[10px] font-bold text-gray-600 uppercase mb-2">Signal Purity</p>
                    <div className="w-full h-1 bg-white/[0.05] rounded-full overflow-hidden">
                       <div className="w-[92%] h-full bg-gradient-to-r from-primary-500 to-accent-purple" />
                    </div>
                 </div>
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
};

export default Activity;
