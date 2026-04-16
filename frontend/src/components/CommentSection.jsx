import React, { useState, useContext } from 'react';
import { MessageSquare, User, Send, AlertCircle, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import api from '../services/api';

const CommentSection = ({ comments: initialComments, threadId }) => {
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const timeAgo = (dateStr) => {
    const diff = (Date.now() - new Date(dateStr)) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post(`/threads/${threadId}/comments`, {
        content: newComment.trim(),
      });
      setComments((prev) => [
        ...prev,
        {
          id: data._id,
          author: user.username,
          content: data.content,
          createdAt: data.createdAt || new Date().toISOString(),
        },
      ]);
      setNewComment('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sync your reply.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-10 animate-fade-in mb-20">
      {/* Discussion Header */}
      <div className="flex items-center justify-between border-b border-white/[0.05] pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400">
             <MessageSquare size={20} />
          </div>
          <div>
             <h2 className="text-xl font-black text-white tracking-tight">Community Insights</h2>
             <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{comments.length} participants</p>
          </div>
        </div>
      </div>

      {/* Reply Input Area */}
      {user ? (
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary-600/20 to-accent-purple/20 rounded-3xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
          <div className="relative glass-card bg-dark-800/40 p-6 border-white/[0.08] group-focus-within:border-primary-500/30 transition-all">
            <div className="flex gap-4">
              <div className="hidden sm:flex shrink-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-purple flex items-center justify-center text-white font-black shadow-glow">
                  {user.username?.[0].toUpperCase()}
                </div>
              </div>
              <form onSubmit={handleSubmit} className="flex-1 space-y-4">
                {error && (
                  <div className="flex items-center gap-2 text-rose-400 text-xs font-bold mb-2 animate-slide-down">
                    <AlertCircle size={14} /> {error}
                  </div>
                )}
                <textarea
                  className="w-full bg-transparent border-none outline-none text-gray-200 placeholder-white/10 text-base leading-relaxed resize-none min-h-[100px] p-0 focus:ring-0"
                  placeholder="Contribute to the conversation..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  maxLength={2000}
                />
                <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">
                  <span className="text-[10px] font-mono font-bold text-gray-600 uppercase tracking-widest">
                    {newComment.length} / 2000
                  </span>
                  <button
                    type="submit"
                    disabled={loading || !newComment.trim()}
                    className="btn-primary px-8 py-3 shadow-glow group"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <div className="flex items-center gap-2">
                         <span>Post Insight</span>
                         <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card p-10 text-center bg-white/[0.02] border-dashed border-white/10">
          <p className="text-gray-400 font-bold mb-6 italic">Sign in to contribute your unique perspectives.</p>
          <Link to="/login" className="btn-primary px-10 py-4 shadow-glow-lg">
            <LogIn size={18} /> Authenticate Now
          </Link>
        </div>
      )}

      {/* Timeline of Replies */}
      <div className="space-y-6 relative">
        {/* Visual vertical line */}
        <div className="absolute left-[21px] top-2 bottom-2 w-px bg-gradient-to-b from-white/[0.08] via-white/[0.02] to-transparent hidden sm:block" />

        {comments.length === 0 ? (
          <div className="py-20 text-center">
            <div className="inline-flex w-16 h-16 rounded-full bg-white/[0.02] items-center justify-center mb-4">
              <MessageSquare size={24} className="text-gray-700" />
            </div>
            <p className="text-gray-600 font-bold text-sm tracking-tight">The discussion is just beginning...</p>
          </div>
        ) : (
          comments.map((comment, idx) => (
            <div
              key={comment.id || idx}
              className="relative pl-0 sm:pl-14 group animate-fade-in"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="absolute left-0 top-0 hidden sm:flex">
                <div className="w-11 h-11 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-gray-400 font-black group-hover:border-primary-500/30 transition-colors shadow-lg z-10">
                  {comment.author?.[0]?.toUpperCase() || '?'}
                </div>
              </div>

              <div className="glass-card p-6 bg-white/[0.01] hover:bg-white/[0.03] border-white/[0.05] hover:border-white/[0.1] transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white tracking-tight uppercase">@{comment.author}</span>
                    <span className="w-1 h-1 rounded-full bg-white/10" />
                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{timeAgo(comment.createdAt)}</span>
                  </div>
                  <button className="text-gray-600 hover:text-white transition-colors">
                    <MessageSquare size={14} />
                  </button>
                </div>
                <div className="text-gray-300 leading-relaxed font-normal text-base sm:text-lg tracking-tight">
                  {comment.content}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default CommentSection;
