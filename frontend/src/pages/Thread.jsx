import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import CommentSection from '../components/CommentSection';
import { User, Clock, ArrowLeft, MessageCircle, Flag, Loader2, AlertCircle } from 'lucide-react';
import api from '../services/api';

const Thread = () => {
  const { id } = useParams();
  const [thread, setThread] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const timeAgo = (dateStr) => {
    const diff = (Date.now() - new Date(dateStr)) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  useEffect(() => {
    const fetchThreadData = async () => {
      try {
        const { data } = await api.get(`/threads/${id}`);
        setThread(data.thread);
        setComments(data.comments);
      } catch (err) {
        setError(err.response?.data?.message || 'Piece not found or has been withdrawn.');
      } finally {
        setLoading(false);
      }
    };
    fetchThreadData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6 animate-fade-in">
        <div className="w-16 h-16 rounded-[2rem] bg-gradient-to-br from-primary-600 to-accent-purple flex items-center justify-center shadow-glow-lg">
          <Loader2 className="w-6 h-6 text-white animate-spin" />
        </div>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Loading Discussion</p>
      </div>
    );
  }

  if (error || !thread) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-4 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-[2.5rem] bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-8">
          <AlertCircle className="w-10 h-10 text-rose-400" />
        </div>
        <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Access Denied</h2>
        <p className="text-gray-500 font-medium mb-10 max-w-sm">{error || 'This discussion is no longer available.'}</p>
        <Link to="/" className="btn-secondary px-8 py-4 font-bold">
          <ArrowLeft size={18} /> Return to Home
        </Link>
      </div>
    );
  }

  const formattedComments = comments.map((c) => ({
    id: c._id,
    author: c.author?.username || 'Unknown',
    content: c.content,
    createdAt: c.createdAt,
  }));

  return (
    <div className="max-w-4xl mx-auto py-6 animate-slide-up">
      {/* Navigation Line */}
      <div className="flex items-center gap-4 mb-10 group">
        <Link
          to="/"
          className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.08] transition-all"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="h-px flex-1 bg-white/[0.05]"></div>
        <div className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">Viewing Discussion</div>
        <div className="h-px flex-1 bg-white/[0.05]"></div>
      </div>

      {/* Hero Article Section */}
      <article className="mb-10">
        {thread.status === 'Flagged' && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest mb-8 animate-pulse">
            <Flag size={12} /> Under Moderation Review
          </div>
        )}

        <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tighter leading-[1.05] mb-10">
          {thread.title}
        </h1>

        {/* Author & Stats bar */}
        <div className="flex flex-wrap items-center justify-between gap-6 pb-10 mb-10 border-b border-white/[0.05]">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-purple flex items-center justify-center text-white font-black text-lg shadow-glow-lg border border-white/10">
               {thread.author?.username?.[0]?.toUpperCase() || '?'}
             </div>
             <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1.5">Published by</p>
                <p className="text-base font-black text-primary-400 tracking-tight">@{thread.author?.username || 'System'}</p>
             </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end">
               <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Time Elapsed</p>
               <div className="flex items-center gap-2 text-sm font-bold text-gray-300">
                  <Clock size={14} className="text-primary-500" />
                  {timeAgo(thread.createdAt)}
               </div>
            </div>
            <div className="flex flex-col items-end">
               <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Engagements</p>
               <div className="flex items-center gap-2 text-sm font-bold text-gray-300">
                  <MessageCircle size={14} className="text-accent-purple" />
                  {thread.repliesCount ?? formattedComments.length} Replies
               </div>
            </div>
          </div>
        </div>

        {/* Core Content */}
        <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap text-lg sm:text-xl font-medium tracking-tight">
          {thread.content}
        </div>
      </article>

      {/* Discussion Footer Divider */}
      <div className="flex items-center gap-6 my-16">
         <div className="h-px flex-1 bg-white/[0.05]"></div>
         <div className="w-2.5 h-2.5 rounded-full border-2 border-primary-500/30"></div>
         <div className="h-px flex-1 bg-white/[0.05]"></div>
      </div>

      {/* Comment Section Integration */}
      <div className="mt-10">
        <CommentSection comments={formattedComments} threadId={thread._id} />
      </div>
    </div>
  );
};

export default Thread;
