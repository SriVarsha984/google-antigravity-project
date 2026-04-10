import React, { useState } from 'react';
import { User, MessageSquare } from 'lucide-react';
import '../index.css';

const CommentSection = ({ comments }) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    // Mock submit action
    console.log('Comment submitted:', newComment);
    setNewComment('');
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        <MessageSquare size={20} /> Comments
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        {comments && comments.length > 0 ? (
          comments.map(comment => (
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
          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
            Post Comment
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommentSection;
