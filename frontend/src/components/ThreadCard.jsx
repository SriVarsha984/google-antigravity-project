import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Clock, User } from 'lucide-react';
import '../index.css';

const ThreadCard = ({ thread }) => {
  return (
    <Link to={`/topic/${thread.id}`} className="card thread-card" style={{ display: 'block', textDecoration: 'none' }}>
      <div className="thread-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{thread.title}</h3>
          <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <User size={14} /> {thread.author}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Clock size={14} /> {thread.createdAt}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
          <MessageCircle size={18} />
          <span style={{ fontWeight: 600 }}>{thread.repliesCount}</span>
        </div>
      </div>
    </Link>
  );
};

export default ThreadCard;
