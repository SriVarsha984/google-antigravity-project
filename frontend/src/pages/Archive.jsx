import React, { useState, useEffect } from 'react';
import { Archive, Lock, Clock, MessageSquare, ChevronRight, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ArchivePage = () => {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArchived = async () => {
      try {
        const { data } = await api.get('/threads');
        const archived = data.filter(t => t.status === 'Archived');
        setThreads(archived);
      } catch (err) {
        console.error('Failed to load archives:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArchived();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 animate-fade-in mb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-16 border-b border-white/[0.05] pb-12">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center shadow-2xl border border-white/10">
            <Archive size={30} className="text-gray-300" />
          </div>
          <div>
            <h1 className="font-display font-black text-3xl text-white tracking-tight leading-tight">Historical Vault</h1>
            <p className="text-gray-500 font-medium text-sm mt-1 flex items-center gap-2">
              <Lock size={14} className="text-amber-500/50" />
              Preserving community heritage and early discourse.
            </p>
          </div>
        </div>

        <div className="glass-card px-6 py-4 border-amber-500/10 bg-amber-500/5 flex items-start gap-4 max-w-sm rounded-[1.25rem]">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
            <Info size={16} className="text-amber-500" />
          </div>
          <div>
            <p className="text-amber-200/60 text-[10px] uppercase font-black tracking-[0.2em] leading-relaxed">Immutable State</p>
            <p className="text-[11px] text-gray-500 font-medium mt-1 leading-relaxed">Archived cases are read-only artifacts maintained for historical synchronicity.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-card h-40 animate-pulse bg-white/[0.02] border-white/[0.05] rounded-[2rem]" />
          ))
        ) : threads.length > 0 ? (
          threads.map((thread, idx) => (
            <Link
              key={thread._id}
              to={`/topic/${thread._id}`}
              className="group glass-card p-8 rounded-[2rem] flex flex-col justify-between hover:border-gray-500/40 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-500 relative overflow-hidden animate-fade-in"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {/* Subtle visual accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-500/5 to-transparent rounded-bl-[4rem]" />

              <div className="mb-6 relative z-10">
                <div className="flex items-center gap-2 text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-4">
                  <Clock size={12} className="text-gray-700" />
                  {new Date(thread.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <h3 className="text-xl font-black text-white group-hover:text-primary-400 transition-colors line-clamp-2 leading-tight tracking-tight">
                  {thread.title}
                </h3>
              </div>

              <div className="flex items-center justify-between border-t border-white/[0.03] pt-6 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-dark-800 border border-white/[0.08] flex items-center justify-center text-[10px] font-black text-gray-400 group-hover:border-primary-500/30 transition-colors">
                    {thread.author?.username?.[0] || '?'}
                  </div>
                  <span className="text-xs font-black text-gray-500 uppercase tracking-widest group-hover:text-gray-300 transition-colors">@{thread.author?.username}</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-black text-gray-700 group-hover:text-primary-500 transition-all uppercase tracking-widest">
                  <MessageSquare size={14} className="text-gray-800 group-hover:text-primary-600" /> {thread.repliesCount || 0}
                  <ChevronRight size={18} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-32 text-center glass-card border-dashed border-white/10 bg-transparent flex flex-col items-center">
            <div className="w-20 h-20 rounded-[2.5rem] bg-white/[0.02] flex items-center justify-center mb-6">
              <Archive size={40} className="text-gray-800" />
            </div>
            <h3 className="text-xl font-black text-white mb-2 tracking-tight">Vault Empty</h3>
            <p className="text-gray-600 font-medium">No discussions have been committed to the historical record yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchivePage;
