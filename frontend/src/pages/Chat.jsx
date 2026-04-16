import React, { useState, useEffect, useRef, useContext } from 'react';
import { MessageCircle, Send, Loader2, User } from 'lucide-react';
import { AuthContext } from '../context/AuthContext.jsx';
import api from '../services/api';

const Chat = () => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  const fetchMessages = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const { data } = await api.get('/chat');
      setMessages(data);
    } catch (err) {
      console.error('Failed to load chat:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(() => fetchMessages(true), 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMsg.trim() || sending) return;

    setSending(true);
    try {
      const { data } = await api.post('/chat', { content: newMsg });
      setMessages(prev => [...prev, data]);
      setNewMsg('');
    } catch (err) {
      console.error('Send failed:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[82vh] flex flex-col py-6 animate-fade-in relative">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-primary-600/10 blur-[120px] -z-10" />

      {/* Modern Header */}
      <div className="flex items-center justify-between mb-6 px-6 py-5 bg-white/[0.03] rounded-[2rem] border border-white/[0.08] backdrop-blur-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/5 to-transparent pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-purple flex items-center justify-center shadow-glow border border-white/10">
            <MessageCircle size={24} className="text-white" />
          </div>
          <div>
            <h1 className="font-display font-black text-xl text-white tracking-tight">Signal Flow</h1>
            <p className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.2em] flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               Live Synchronizing
            </p>
          </div>
        </div>
        <div className="flex -space-x-3 relative z-10">
           {[...Array(3)].map((_, i) => (
             <div key={i} className="w-8 h-8 rounded-full bg-dark-800 border-2 border-dark-900 flex items-center justify-center text-[8px] font-black text-gray-500 uppercase">
                {String.fromCharCode(65 + i)}
             </div>
           ))}
           <div className="w-8 h-8 rounded-full bg-primary-600 border-2 border-dark-900 flex items-center justify-center text-[10px] font-black text-white">
              +
           </div>
        </div>
      </div>

      {/* Messaging Canvas */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-8 mb-6 px-4 custom-scrollbar"
      >
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center gap-6 opacity-40">
            <div className="w-16 h-16 rounded-[2rem] bg-white/[0.05] flex items-center justify-center animate-spin">
               <Loader2 size={32} className="text-primary-500" />
            </div>
            <p className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Decoding Streams</p>
          </div>
        ) : messages.length > 0 ? (
          messages.map((msg, idx) => {
            const isMe = msg.sender?._id === user?._id;
            return (
              <div key={msg._id || idx} className={`flex items-end gap-4 ${isMe ? 'flex-row-reverse' : 'flex-row'} animate-fade-in group`}>
                <div className="shrink-0 mb-1 relative">
                  <div className="w-10 h-10 rounded-2xl bg-dark-700 border border-white/[0.08] group-hover:border-primary-500/30 transition-all flex items-center justify-center overflow-hidden shadow-lg">
                    {msg.sender?.profilePic ? (
                      <img src={msg.sender.profilePic} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-600/20 to-accent-purple/20 flex items-center justify-center text-[12px] font-black text-primary-400 uppercase">
                        {msg.sender?.username?.[0] || '?'}
                      </div>
                    )}
                  </div>
                  {!isMe && <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-dark-900" />}
                </div>
                
                <div className={`max-w-[70%] space-y-2 ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                  {!isMe && <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">@{msg.sender?.username}</p>}
                  <div className={`px-6 py-4 rounded-[1.75rem] text-sm font-medium leading-relaxed tracking-tight ${
                    isMe 
                      ? 'bg-gradient-to-br from-primary-600 to-indigo-700 text-white rounded-br-none shadow-glow-lg' 
                      : 'bg-white/[0.04] text-gray-200 border border-white/[0.06] rounded-bl-none backdrop-blur-xl'
                  }`}>
                    {msg.content}
                  </div>
                  <p className={`text-[9px] font-black text-gray-600 uppercase tracking-widest px-2 opacity-0 group-hover:opacity-100 transition-opacity`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-12">
            <div className="w-20 h-20 rounded-[2.5rem] bg-white/[0.02] flex items-center justify-center mb-8">
               <MessageCircle size={32} className="text-gray-800" />
            </div>
            <h3 className="text-xl font-black text-white mb-2 tracking-tight">Channel Idle</h3>
            <p className="text-gray-600 font-medium text-sm">Initiate the first pulse in this community channel.</p>
          </div>
        )}
      </div>

      {/* High-End Input Terminal */}
      <div className="px-2">
        <form onSubmit={handleSend} className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary-600/20 to-accent-purple/20 rounded-[2rem] blur opacity-0 group-focus-within:opacity-100 transition-all duration-500" />
          <div className="relative">
            <input
              type="text"
              className="w-full bg-dark-800/80 border-2 border-white/[0.08] rounded-[2rem] py-6 pr-20 pl-8 text-white placeholder-gray-600 focus:border-primary-500/40 focus:bg-dark-800 transition-all outline-none font-medium text-base shadow-2xl backdrop-blur-3xl"
              placeholder={user ? "Synthesize a message..." : "Authentication required to transmit"}
              value={newMsg}
              disabled={!user || sending}
              onChange={(e) => setNewMsg(e.target.value)}
            />
            <button
              type="submit"
              disabled={!user || !newMsg.trim() || sending}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-indigo-600 text-white flex items-center justify-center hover:shadow-glow transition-all shadow-lg disabled:opacity-20 disabled:grayscale group/btn"
            >
              {sending ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Send size={20} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              )}
            </button>
          </div>
        </form>
        {!user && (
          <p className="text-center mt-6 text-[10px] uppercase font-black tracking-[0.3em] text-gray-700 animate-pulse">
            System Locked · Persistent Identity Required
          </p>
        )}
      </div>
    </div>
  );
};

export default Chat;
