import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import CommentSection from '../components/CommentSection';
import { User, Clock, ArrowLeft } from 'lucide-react';
import api from '../services/api';

const Thread = () => {
  const { id } = useParams();
  const [thread, setThread] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchThreadData = async () => {
      try {
        const { data } = await api.get(`/threads/${id}`);
        setThread(data.thread);
        setComments(data.comments);
      } catch (err) {
        setError('Thread not found or deleted.');
      } finally {
        setLoading(false);
      }
    };
    fetchThreadData();
  }, [id]);

  if (loading) return <div className="page-container" style={{ textAlign: 'center' }}>Loading...</div>;
  if (error || !thread) return <div className="page-container" style={{ textAlign: 'center', color: 'var(--danger)' }}>{error}</div>;

  const formattedComments = comments.map(c => ({
    id: c._id,
    author: c.author?.username || 'Unknown User',
    content: c.content,
    createdAt: new Date(c.createdAt).toLocaleDateString()
  }));

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
              <User size={16} /> {thread.author?.username || 'Unknown User'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={16} /> {new Date(thread.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-primary)', fontSize: '1.05rem', lineHeight: 1.8 }}>
            {thread.content}
          </div>
        </div>
      </div>
      
      <CommentSection 
        comments={formattedComments} 
        threadId={thread._id} 
      />
    </div>
  );
};

export default Thread;
