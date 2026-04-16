import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, User, Clock, ChevronRight, Flag } from 'lucide-react';

const ThreadCard = ({ thread }) => {
  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr);
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <Link
      to={`/topic/${thread._id || thread.id}`}
      className="group flex items-start sm:items-center gap-5 p-5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.03] hover:border-primary-500/30 rounded-2xl transition-all duration-300 backdrop-blur-sm shadow-sm hover:shadow-glow hover:-translate-y-0.5 w-full"
    >
      {/* Avatar with Glow */}
      <div className="shrink-0 relative">
        <div className="absolute inset-0 bg-primary-500/20 blur-md rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-accent-purple border border-white/10 flex items-center justify-center text-white font-bold font-display text-lg shadow-lg">
          {(typeof thread.author === 'object' ? thread.author?.username?.[0] : thread.author?.[0])?.toUpperCase() || '?'}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className="text-gray-100 font-bold text-lg group-hover:text-primary-300 transition-colors duration-200 leading-tight line-clamp-2 font-display">
            {thread.title}
          </h3>
          {thread.status === 'Flagged' && (
            <span className="shrink-0 badge-warning scale-90">
              <Flag size={10} /> Flagged
            </span>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-gray-400 font-medium">
            <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
            @{typeof thread.author === 'object' ? thread.author?.username : thread.author}
          </span>
          <span className="flex items-center gap-1.5 text-gray-500">
            <Clock size={12} className="opacity-70" />
            {timeAgo(thread.createdAt)}
          </span>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/[0.05] text-gray-400 border border-white/[0.05]">
            <MessageCircle size={12} className="text-accent-cyan" />
            <span className="font-bold text-gray-300">{thread.repliesCount ?? 0}</span>
          </span>
        </div>
      </div>

      {/* Action Indicator */}
      <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/[0.03] group-hover:bg-primary-500/20 transition-colors">
        <ChevronRight
          size={18}
          className="text-gray-600 group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all duration-300"
        />
      </div>
    </Link>
  );
};

export default ThreadCard;
