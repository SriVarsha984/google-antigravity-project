import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, MessageSquare, User, Calendar, Filter, ChevronRight, Hash } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const INTERESTS = [
  "Culture", "Technology", "Business", "Politics", "Finance",
  "Food and drink", "Sports", "Art and Illustration", "World politics",
  "Health politics", "News", "Fashion & beauty", "Music", 
  "Faith & spirituality", "Climate & environment", "Science", 
  "Literature", "Fiction", "Health and wellness", "Design", 
  "Travel", "Parenting", "Philosophy", "Cosmics", "International", 
  "Crypto", "History", "Humor", "Education", "Film & TV"
];

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ threads: [], loading: false });
  const isDomainSearch = useRef(false);

  const handleSearch = async (passedQuery, isDomain = false) => {
    const searchTerm = passedQuery || query;
    if (!searchTerm.trim()) return;

    setResults(prev => ({ ...prev, loading: true }));
    try {
      // If it's a domain button click, we fetch by domain.
      // If it's a text search, we fetch all and allow the backend to return matches.
      const { data } = await api.get('/threads', {
        params: isDomain ? { domain: searchTerm } : { search: searchTerm }
      });
      
      setResults({ threads: data, loading: false });
    } catch (err) {
      console.error('Search failed:', err);
      setResults(prev => ({ ...prev, loading: false }));
    }
  };

  const handleCategoryClick = (category) => {
    isDomainSearch.current = true;
    setQuery(category);
    handleSearch(category, true);
  };

  useEffect(() => {
    // Initial Load
    handleSearch('Technology', true);
  }, []);

  useEffect(() => {
    if (isDomainSearch.current) {
      isDomainSearch.current = false;
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      if (query) {
        handleSearch(query, false);
      } else {
        handleSearch('Technology', true);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 animate-fade-in">
      {/* Search Header Section */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-glow">
           <Hash size={12} /> Explore Domains
        </div>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-white mb-8 tracking-tight">
          Knowledge <span className="gradient-text">Repository.</span>
        </h1>
        
        <div className="relative w-full max-w-2xl group">
          <div className="absolute inset-0 bg-primary-500/5 blur-2xl rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <Search size={24} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-primary-500 transition-all duration-300" />
          <input
            type="text"
            placeholder="Search resources, authors, or domains..."
            className="input-field pl-16 py-5 text-lg shadow-xl"
            value={query}
            onChange={(e) => {
              isDomainSearch.current = false;
              setQuery(e.target.value);
            }}
          />
        </div>
      </div>

      {/* Domain Selection Matrix */}
      <div className="mb-20">
        <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-8 text-center">Categorical Matrix</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {INTERESTS.map((int) => (
            <button
              key={int}
              onClick={() => handleCategoryClick(int)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all duration-300 border ${
                query === int
                  ? 'bg-primary-600 text-white border-primary-500 shadow-glow'
                  : 'bg-white/[0.02] text-gray-500 border-white/[0.05] hover:border-white/20 hover:text-gray-300 hover:scale-105'
              }`}
            >
              {int}
            </button>
          ))}
        </div>
      </div>

      {/* Results Symphony */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2 mb-4">
           <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary-500 shadow-glow" />
              {query ? `Resource Library: ${query}` : "Discovery Hub"}
           </h2>
           <span className="text-[10px] font-mono text-gray-600 font-bold">{results.threads.length} items found</span>
        </div>

        {results.loading ? (
          <div className="py-32 flex flex-col items-center gap-6 animate-fade-in">
             <Loader2 size={32} className="animate-spin text-primary-500" />
             <p className="text-gray-600 text-xs font-black uppercase tracking-widest">Querying knowledge base...</p>
          </div>
        ) : results.threads.length > 0 ? (
          results.threads.map((res, idx) => (
            <Link
              key={res._id}
              to={`/topic/${res._id}`}
              className="group glass-card p-6 sm:p-8 flex items-start gap-6 hover:border-primary-500/30 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-500 animate-fade-in"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="w-14 h-14 rounded-2xl bg-dark-800 border border-white/[0.08] flex items-center justify-center shrink-0 shadow-lg group-hover:border-primary-500/40 transition-colors overflow-hidden">
                {res.author?.profilePic ? (
                  <img src={res.author.profilePic} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-600/20 to-accent-purple/20 flex items-center justify-center text-primary-400 font-black text-xl">
                    {res.author?.username?.[0] || '?'}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                   <div className="flex items-center gap-1.5 text-[10px] font-black text-primary-500 uppercase tracking-widest">
                      <User size={12} />
                      @{res.author?.username}
                   </div>
                   <div className="w-1.5 h-1.5 rounded-full bg-white/[0.05]" />
                   <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                      <Calendar size={12} />
                      {new Date(res.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                   </div>
                </div>
                <h3 className="text-xl font-black text-white group-hover:text-primary-400 transition-colors truncate tracking-tight mb-2">
                  {res.title}
                </h3>
                <div className="flex items-center gap-5">
                   <span className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                     <MessageSquare size={14} className="text-accent-purple" /> {res.repliesCount || 0} Responses
                   </span>
                   {res.domain && (
                      <span className="px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-[9px] font-black uppercase tracking-[0.2em]">
                        #{res.domain}
                      </span>
                   )}
                </div>
              </div>
              <div className="hidden sm:flex self-center opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500 text-primary-500">
                 <ChevronRight size={24} strokeWidth={3} />
              </div>
            </Link>
          ))
        ) : (
          <div className="py-24 text-center border border-dashed border-white/10 rounded-[2rem] bg-transparent">
             <p className="text-gray-500 text-sm font-medium italic">No matching resources found. Please refine your query.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
