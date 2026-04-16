import React, { useState, useEffect, useContext } from 'react';
import ThreadCard from '../components/ThreadCard';
import QuickWisdom from '../components/QuickWisdom';
import { PlusCircle, Search, Flame, Clock, TrendingUp, Loader2, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import api from '../services/api';

const FILTERS = [
  { id: 'latest', label: 'Latest Feed', icon: Clock }
];

const SkeletonCard = () => (
  <div className="glass-card p-5 flex items-center gap-4">
    <div className="skeleton w-11 h-11 rounded-xl" />
    <div className="flex-1 space-y-2">
      <div className="skeleton h-4 w-3/4 rounded-lg" />
      <div className="skeleton h-3 w-1/2 rounded-lg" />
    </div>
  </div>
);

const Home = () => {
  const { user } = useContext(AuthContext);
  const [threads, setThreads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('latest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThreads = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/threads');
        setThreads(data);
      } catch (error) {
        console.error('Failed to load threads', error);
      } finally {
        setLoading(false);
      }
    };
    fetchThreads();
  }, []);

  const processedThreads = threads
    .filter((t) => {
      const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
      if (filter === 'flagged') return matchesSearch && t.status === 'Flagged';
      return matchesSearch && t.status !== 'Deleted';
    })
    .sort((a, b) => {
      if (filter === 'trending') return (b.repliesCount ?? 0) - (a.repliesCount ?? 0);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <div className="animate-fade-in max-w-6xl mx-auto py-6">
      {/* Premium Hero Section */}
      <div className="relative rounded-[2rem] overflow-hidden mb-16 p-10 sm:p-16 text-center border border-white/[0.08] shadow-2xl">
        <div className="absolute inset-0 z-0 bg-dark-800/50 backdrop-blur-3xl" />
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-primary-600/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-accent-purple/10 rounded-full blur-[120px]" />
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-[9px] font-black uppercase tracking-[0.2em] mb-8 shadow-glow">
            <Flame size={12} className="animate-pulse" /> Community Velocity
          </div>
          
          <h1 className="font-display font-black text-5xl sm:text-6xl text-white mb-6 tracking-tight leading-[1.05]">
            {user ? <>Welcome back, <span className="gradient-text">{user.username}</span>.</> : <>The Modern <span className="gradient-text">Think Tank.</span></>}
          </h1>
          
          <p className="text-gray-400 text-sm sm:text-lg mb-10 font-medium italic opacity-70 leading-relaxed">
            {user 
              ? "Synthesizing global perspectives into actionable intelligence. Here's what's trending in your network."
              : "A decentralized repository of high-signal discussions and expert curation."
            }
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
             {user ? (
                <Link to="/create" className="btn-primary px-10 py-4 shadow-glow-lg group">
                   <PlusCircle size={20} className="transition-transform group-hover:rotate-90" />
                   Start a Discussion
                </Link>
             ) : (
                <Link to="/register" className="btn-primary px-10 py-4 shadow-glow-lg">Join Knowledge Network</Link>
             )}
          </div>
        </div>
      </div>

      {/* Main Content Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left column: Discussions Feed */}
        <div className="lg:col-span-8 space-y-8">
           <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10">
              <div className="relative group w-full sm:max-w-md">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Filter by keyword..."
                  className="input-field pl-12"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-1.5 p-1 bg-white/[0.03] rounded-xl border border-white/[0.08]">
                {FILTERS.map(({ id, label, icon: FilterIcon }) => (
                  <button
                    key={id}
                    onClick={() => setFilter(id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-tight transition-all duration-300 ${
                      filter === id
                        ? 'bg-primary-600 text-white shadow-glow translate-y-[-1px]'
                        : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.05]'
                    }`}
                  >
                    <FilterIcon size={14} /> {label}
                  </button>
                ))}
              </div>
           </div>

           <div className="space-y-5">
              <div className="flex items-center justify-between px-2 mb-4">
                <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-primary-500 shadow-glow" />
                   Recent Discussions
                </h2>
                <span className="text-[10px] font-mono text-gray-600 font-bold">{processedThreads.length} items</span>
              </div>

              {loading ? (
                Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              ) : processedThreads.length > 0 ? (
                processedThreads.map((thread) => (
                  <ThreadCard key={thread._id} thread={thread} />
                ))
              ) : (
                <div className="p-16 text-center border border-dashed border-white/10 rounded-2xl">
                  <p className="text-gray-600 text-sm font-medium italic">The feed is currently quiet. Check back soon for new perspectives.</p>
                </div>
              )}
           </div>
        </div>

        {/* Right column: Wisdom & Intelligence */}
        <aside className="lg:col-span-4 space-y-10">
           <QuickWisdom />
           
           <div className="glass-card p-8 border-white/[0.05] bg-white/[0.01]">
              <div className="flex items-center gap-3 mb-8">
                 <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                    <TrendingUp size={16} />
                 </div>
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">High Signal</h4>
              </div>
              <div className="space-y-8">
                 {threads.slice(0, 3).map((t, idx) => (
                    <Link key={t._id} to={`/topic/${t._id}`} className="block group">
                       <span className="text-[9px] font-mono font-black text-primary-500/50 mb-2 block uppercase tracking-[0.3em]">0{idx + 1} / Rank</span>
                       <p className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors line-clamp-2 leading-relaxed tracking-tight">{t.title}</p>
                    </Link>
                 ))}
              </div>
           </div>
        </aside>

      </div>
    </div>
  );
};

export default Home;
