import React, { useState } from 'react';
import { User, MessageSquare } from 'lucide-react';
import api from '../services/api';
import '../index.css';

const CommentSection = ({ comments, threadId }) => {
  const [newComment, setNewComment] = useState('');
  const [localComments, setLocalComments] = useState(comments);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !threadId) return;
    
    setLoading(true);
    try {
      const { data } = await api.post(`/threads/${threadId}/comments`, {
        content: newComment
      });
      // Mock full name display for instant feedback, would ideally fetch or utilize context
      setLocalComments([...localComments, {
        id: data._id,
        author: 'You', 
        content: data.content,
        createdAt: 'Just now'
      }]);
      setNewComment('');
    } catch (err) {
      console.error('Failed to post comment', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        <MessageSquare size={20} /> Comments
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        {localComments && localComments.length > 0 ? (
          localComments.map(comment => (
            <div key={comment.id} className="card" style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <User size={14} /> <span style={{ fontWeight: 500, color: 'var(--primary-color)' }}>{comment.author}</span> • {comment.createdAt}
              </div>
              <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{comment.content}</p>
            </div>
          ))
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>No comments yet. Be the first to share your thoughts!</p>
        )}
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        <h4 style={{ marginBottom: '1rem' }}>Leave a Reply</h4>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <textarea 
              className="input-field" 
              rows="4" 
              placeholder="Write your comment here..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommentSection;
