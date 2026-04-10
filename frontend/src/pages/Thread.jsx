import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import CommentSection from '../components/CommentSection';
import { User, Clock, ArrowLeft } from 'lucide-react';

const mockThreadData = {
  id: '1',
  title: 'Welcome to the new Discussion Forum!',
  content: 'We are excited to launch our new discussion forum platform. This space is designed for developers to share knowledge, ask questions, and collaborate on exciting projects. Please be respectful to everyone and adhere to the community guidelines.\n\nHappy coding!',
  author: 'Admin User',
  createdAt: '2 hours ago',
  comments: [
    { id: 'c1', author: 'FrontendDev', content: 'Looks great! Love the design and the smooth animations.', createdAt: '1 hour ago' },
    { id: 'c2', author: 'CodeNewbie', content: 'Thank you for this platform! Im excited to learn from everyone here.', createdAt: '45 mins ago' }
  ]
};

const Thread = () => {
  const { id } = useParams();
  // In a real app, we would fetch the thread based on id
  const thread = mockThreadData;

  return (
    <div className="page-container">
      <div>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
          <ArrowLeft size={16} /> Back to Discussions
        </Link>
        <div className="card">
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{thread.title}</h1>
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={16} /> {thread.author}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={16} /> {thread.createdAt}
            </span>
          </div>
          <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-primary)', fontSize: '1.05rem', lineHeight: 1.8 }}>
            {thread.content}
          </div>
        </div>
      </div>
      
      <CommentSection comments={thread.comments} />
    </div>
  );
};

export default Thread;
