import React, { useState } from 'react';
import ThreadCard from '../components/ThreadCard';
import { PlusCircle, Search } from 'lucide-react';

const mockThreads = [
  { id: '1', title: 'Welcome to the new Discussion Forum!', author: 'Admin User', createdAt: '2 hours ago', repliesCount: 5 },
  { id: '2', title: 'React 19 features discussion', author: 'FrontendDev', createdAt: '4 hours ago', repliesCount: 12 },
  { id: '3', title: 'Best practices for MERN stack authentication?', author: 'CodeNewbie', createdAt: '1 day ago', repliesCount: 8 }
];

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredThreads = mockThreads.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Discussion Board</h1>
          <p>Join the conversation and share your knowledge.</p>
        </div>
        <button className="btn btn-primary">
          <PlusCircle size={18} /> New Topic
        </button>
      </div>

      <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Search size={20} color="var(--text-muted)" />
        <input 
          type="text" 
          placeholder="Search topics..." 
          style={{ border: 'none', background: 'transparent', color: 'var(--text-primary)', outline: 'none', width: '100%', fontSize: '1rem' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredThreads.length > 0 ? (
          filteredThreads.map(thread => (
            <ThreadCard key={thread.id} thread={thread} />
          ))
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>No topics found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
