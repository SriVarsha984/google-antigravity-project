import React, { useState, useEffect } from 'react';
import ThreadCard from '../components/ThreadCard';
import { PlusCircle, Search } from 'lucide-react';
import api from '../services/api';

const Home = () => {
  const [threads, setThreads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const { data } = await api.get('/threads');
        setThreads(data);
      } catch (error) {
        console.error('Failed to load threads', error);
      } finally {
        setLoading(false);
      }
    };
    fetchThreads();
  }, []);

  const filteredThreads = threads.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Registration Successful! Discussion Board</h1>
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
        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading threads...</p>
        ) : filteredThreads.length > 0 ? (
          filteredThreads.map(thread => (
            <ThreadCard 
              key={thread._id} 
              thread={{
                id: thread._id,
                title: thread.title,
                author: thread.author?.username || 'Unknown',
                createdAt: new Date(thread.createdAt).toLocaleDateString(),
                repliesCount: thread.repliesCount
              }} 
            />
          ))
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>No topics found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
