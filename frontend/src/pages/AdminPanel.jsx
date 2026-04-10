import React, { useState } from 'react';
import { Shield, Trash2, Ban, Edit, AlertTriangle } from 'lucide-react';

const mockUsers = [
  { id: 'u1', username: 'FrontendDev', email: 'dev@example.com', status: 'Active' },
  { id: 'u2', username: 'CodeNewbie', email: 'newbie@example.com', status: 'Active' },
  { id: 'u3', username: 'SpamBot99', email: 'spam@bot.com', status: 'Suspended' }
];

const mockPosts = [
  { id: 'p1', title: 'Buy Cheap Watches Here!!!', author: 'SpamBot99', status: 'Flagged' },
  { id: 'p2', title: 'How to use React Context effectively?', author: 'FrontendDev', status: 'Clean' }
];

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('posts');

  return (
    <div className="page-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <Shield size={32} color="var(--primary-color)" />
        <div>
          <h1>Moderation Panel</h1>
          <p>Manage users, content, and platform settings.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>
        <button 
          className={`btn ${activeTab === 'posts' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('posts')}
        >
          Manage Posts
        </button>
        <button 
          className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('users')}
        >
          Manage Users
        </button>
      </div>

      {activeTab === 'posts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3>Reported & Recent Posts</h3>
          {mockPosts.map(post => (
            <div key={post.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {post.title} 
                  {post.status === 'Flagged' && <AlertTriangle size={16} color="var(--warning)" />}
                </h4>
                <p style={{ fontSize: '0.85rem' }}>By: {post.author}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem' }}><Edit size={16} /></button>
                <button className="btn btn-danger" style={{ padding: '0.4rem 0.8rem' }}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'users' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3>User Directory</h3>
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: 'rgba(255,255,255,0.05)' }}>
                <tr>
                  <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>Username</th>
                  <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>Email</th>
                  <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>Status</th>
                  <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockUsers.map(user => (
                  <tr key={user.id}>
                    <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>{user.username}</td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>{user.email}</td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                      <span style={{ 
                        padding: '0.2rem 0.5rem', 
                        borderRadius: '0.25rem', 
                        fontSize: '0.8rem',
                        background: user.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: user.status === 'Active' ? 'var(--success)' : 'var(--danger)'
                      }}>
                        {user.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                      <button className="btn btn-danger" title="Ban User" style={{ padding: '0.3rem 0.6rem' }}>
                        <Ban size={14} /> Ban
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPanel;
