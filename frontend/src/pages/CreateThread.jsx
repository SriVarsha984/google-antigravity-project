import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { PlusCircle, AlertCircle, FileText, AlignLeft } from 'lucide-react';
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

const CreateThread = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', content: '', domain: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, content } = formData;
    if (!title.trim() || !content.trim()) {
      setError('Please provide both a title and some content.');
      return;
    }
    if (title.trim().length < 5) {
      setError('Title is a bit too short (min. 5 chars).');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/threads', { 
        title: title.trim(), 
        content: content.trim(),
        domain: formData.domain 
      });
      navigate(`/topic/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/[0.05] pb-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-[10px] font-black uppercase tracking-[0.2em] text-primary-400">
            <PlusCircle size={12} className="text-primary-400" />
            Compose Discussion
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight leading-[1.1]">
            What's on your <span className="gradient-text">mind?</span>
          </h1>
          <p className="text-gray-500 font-medium max-w-lg">
            Share your thoughts, ask questions, or start a global conversation with the community.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-white/[0.03] p-3 rounded-2xl border border-white/10 backdrop-blur-xl">
           <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-purple flex items-center justify-center text-white font-bold shadow-glow">
             {user?.username?.[0].toUpperCase()}
           </div>
           <div className="hidden sm:block">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Posting as</p>
              <p className="text-sm font-bold text-white tracking-tight">@{user?.username}</p>
           </div>
        </div>
      </div>

      {/* Composition Area */}
      <div className="relative group">
        {/* Decorative background glow */}
        <div className="absolute -inset-4 bg-gradient-to-br from-primary-600/5 to-accent-purple/5 rounded-[2.5rem] blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000 -z-10" />

        <div className="glass-card overflow-hidden border-white/[0.08] group-focus-within:border-primary-500/30 transition-colors duration-500 shadow-2xl">
          {error && (
            <div className="p-6 bg-rose-500/10 border-b border-rose-500/20 animate-slide-down">
              <div className="flex items-center gap-3 text-rose-400 font-bold text-sm">
                 <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center">
                    <AlertCircle size={16} />
                 </div>
                 {error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="divide-y divide-white/[0.05]">
            {/* Domain Selection */}
            <div className="p-6 sm:p-10 bg-white/[0.01]">
               <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">
                  <PlusCircle size={12} className="text-primary-500" />
                  Select Primary Domain
               </div>
               <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto no-scrollbar pr-2">
                  {INTERESTS.map(domain => (
                    <button
                      key={domain}
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, domain }))}
                      className={`px-4 py-1.5 rounded-xl text-[10px] font-bold transition-all duration-300 border ${
                        formData.domain === domain 
                          ? 'bg-primary-500 border-primary-500 text-white shadow-glow' 
                          : 'bg-white/[0.03] border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-300'
                      }`}
                    >
                      {domain}
                    </button>
                  ))}
               </div>
            </div>

            {/* Title Input */}
            <div className="p-6 sm:p-10">
              <input
                type="text"
                name="title"
                autoFocus
                className="w-full bg-transparent border-none outline-none text-2xl sm:text-3xl font-display font-bold text-white placeholder-white/10 focus:ring-0 transition-all p-0"
                placeholder="Enter a descriptive title..."
                value={formData.title}
                onChange={handleChange}
                maxLength={120}
              />
              <div className="mt-4 flex items-center justify-between">
                 <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                    <FileText size={12} />
                    Refined Title
                 </div>
                 <span className={`text-[10px] font-mono font-bold ${formData.title.length > 110 ? 'text-amber-500' : 'text-gray-600'}`}>
                   {formData.title.length}/120
                 </span>
              </div>
            </div>

            {/* Content Textarea */}
            <div className="p-6 sm:p-10 relative">
              <textarea
                name="content"
                className="w-full bg-transparent border-none outline-none text-lg text-gray-300 placeholder-white/5 focus:ring-0 min-h-[300px] resize-none leading-relaxed p-0 custom-scrollbar"
                placeholder="The floor is yours. Use this space to dive deep into your topic..."
                value={formData.content}
                onChange={handleChange}
                maxLength={5000}
              />
              <div className="mt-6 flex items-center justify-between">
                 <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                    <AlignLeft size={12} />
                    Rich Description
                 </div>
                 <span className={`text-[10px] font-mono font-bold ${formData.content.length > 4800 ? 'text-amber-500' : 'text-gray-600'}`}>
                   {formData.content.length}/5000
                 </span>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="px-6 py-8 sm:px-10 bg-white/[0.02] flex flex-col sm:flex-row items-center gap-6 justify-between">
               <div className="flex items-center gap-6">
                  {/* Visual Quality Cues */}
                  <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-tight">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                     Auto-saving enabled
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                     <div className="w-1.5 h-1.5 rounded-full bg-gray-700" />
                     Markdown supported
                  </div>
               </div>

               <div className="flex items-center gap-4 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="flex-1 sm:flex-none px-8 py-4 rounded-2xl text-sm font-bold text-gray-500 hover:text-white hover:bg-white/5 transition-all"
                  >
                    Discard Draft
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !formData.title.trim() || !formData.content.trim()}
                    className="flex-1 sm:flex-none btn-primary px-10 py-4 shadow-glow-lg group"
                  >
                    {loading ? (
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Publishing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>Publish Piece</span>
                        <PlusCircle size={18} className="transition-transform group-hover:scale-110" />
                      </div>
                    )}
                  </button>
               </div>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
};

export default CreateThread;
