import React, { useState, useEffect } from 'react';
import {
  Shield, Trash2, Ban, CheckCircle, AlertTriangle, Users,
  MessageSquare, Flag, BarChart2, RefreshCw, Loader2,
  TrendingUp, UserCheck, Search, ChevronDown
} from 'lucide-react';
import api from '../services/api';

/* ─── Stat Card (Premium) ────────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, color, loading }) => (
  <div className="glass-card p-6 flex items-center gap-5 group hover:border-white/20 transition-all duration-300 relative overflow-hidden">
    <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-[0.03] group-hover:opacity-[0.07] transition-opacity`} />
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg relative z-10 ${color}`}>
      <Icon size={24} className="text-white drop-shadow-md" />
    </div>
    <div className="relative z-10">
      {loading ? (
        <div className="skeleton h-8 w-16 rounded mb-1" />
      ) : (
        <p className="text-3xl font-display font-extrabold text-white tracking-tight">{value}</p>
      )}
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</p>
    </div>
  </div>
);

/* ─── Admin Panel (Premium) ───────────────────────────────────────── */
const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('threads');
  const [threads, setThreads] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState({ threads: true, users: true, stats: true });
  const [searchUser, setSearchUser] = useState('');
  const [actionLoading, setActionLoading] = useState('');

  const setLoad = (key, val) => setLoading((p) => ({ ...p, [key]: val }));

  const fetchAll = async () => {
    setLoad('stats', true);
    setLoad('threads', true);
    setLoad('users', true);
    try {
      const [stRes, thRes, usRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/threads'),
        api.get('/admin/users'),
      ]);
      setStats(stRes.data);
      setThreads(thRes.data);
      setUsers(usRes.data);
    } catch (e) {
      console.error('Admin fetch error', e);
    } finally {
      setLoad('stats', false);
      setLoad('threads', false);
      setLoad('users', false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleFlagThread = async (id) => {
    setActionLoading(id);
    try {
      const { data } = await api.put(`/admin/threads/${id}/flag`);
      setThreads((prev) => prev.map((t) => t._id === id ? { ...t, status: data.thread.status } : t));
    } catch (e) { console.error(e); }
    finally { setActionLoading(''); }
  };

  const handleDeleteThread = async (id) => {
    if (!window.confirm('Delete this thread? This action is permanent.')) return;
    setActionLoading(id);
    try {
      await api.delete(`/admin/threads/${id}`);
      setThreads((prev) => prev.map((t) => t._id === id ? { ...t, status: 'Deleted' } : t));
    } catch (e) { console.error(e); }
    finally { setActionLoading(''); }
  };

  const handleUserStatus = async (id, newStatus) => {
    setActionLoading(id);
    try {
      await api.put(`/admin/users/${id}/status`, { status: newStatus });
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, status: newStatus } : u));
      if (stats) {
        setStats({
          ...stats,
          suspendedUsers: newStatus === 'Suspended' ? stats.suspendedUsers + 1 : Math.max(0, stats.suspendedUsers - 1)
        });
      }
    } catch (e) { console.error(e); }
    finally { setActionLoading(''); }
  };

  const timeAgo = (dateStr) => {
    const days = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
    if (days === 0) return 'today';
    if (days === 1) return 'yesterday';
    return `${days}d ago`;
  };

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUser.toLowerCase())
  );

  const visibleThreads = threads.filter((t) => t.status !== 'Deleted');

  const TABS = [
    { id: 'threads', label: 'Discussions', icon: MessageSquare },
    { id: 'users', label: 'Membership', icon: Users },
  ];

  return (
    <div className="animate-fade-in max-w-6xl mx-auto space-y-10 py-6 px-4">
      {/* Premium Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2 border-b border-white/[0.05]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-[1.25rem] bg-gradient-to-br from-primary-600 to-accent-purple flex items-center justify-center shadow-glow-lg border border-white/10">
            <Shield size={28} className="text-white" />
          </div>
          <div>
            <h1 className="font-display font-black text-3xl text-white tracking-tight">Moderation Hub</h1>
            <p className="text-gray-500 text-sm font-medium flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live System Control Center
            </p>
          </div>
        </div>
        <button label="Refresh Data" onClick={fetchAll} className="btn-secondary px-5 py-3 font-bold group">
          <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" /> Refresh Dashboard
        </button>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={Users} label="Total Users" value={stats?.totalUsers ?? 0} color="from-primary-600 to-indigo-600" loading={loading.stats} />
        <StatCard icon={MessageSquare} label="Threads" value={stats?.totalThreads ?? 0} color="from-accent-cyan to-primary-500" loading={loading.stats} />
        <StatCard icon={TrendingUp} label="Replies" value={stats?.totalComments ?? 0} color="from-emerald-500 to-teal-600" loading={loading.stats} />
        <StatCard icon={Flag} label="Flagged" value={stats?.flaggedThreads ?? 0} color="from-amber-500 to-orange-600" loading={loading.stats} />
        <StatCard icon={Ban} label="Suspended" value={stats?.suspendedUsers ?? 0} color="from-rose-600 to-red-700" loading={loading.stats} />
      </div>

      {/* Navigation & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center p-1 bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl rounded-2xl w-fit">
          {TABS.map(({ id, label, icon: TabIcon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-3 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === id
                  ? 'bg-primary-600 text-white shadow-glow'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.04]'
                }`}
            >
              <TabIcon size={16} /> {label}
            </button>
          ))}
        </div>

        {activeTab === 'users' && (
          <div className="relative group min-w-[300px]">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
            <input
              type="text"
              placeholder="Filter members..."
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-11 pr-4 py-3 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/40 transition-all font-medium"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* ── Content View ── */}
      <div className="animate-slide-up">
        {activeTab === 'threads' ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2 px-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-none">Global Discussion Flux</h3>
            </div>
            {loading.threads ? (
              <div className="grid gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="glass-card p-6 flex items-center justify-between border-white/[0.05]">
                    <div className="flex-1 space-y-3">
                      <div className="skeleton w-2/3 h-4 rounded" />
                      <div className="skeleton w-1/3 h-3 rounded" />
                    </div>
                    <div className="skeleton w-32 h-10 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : visibleThreads.length === 0 ? (
              <div className="glass-card p-20 text-center border-dashed border-white/10">
                <MessageSquare size={48} className="text-white/10 mx-auto mb-4" />
                <p className="text-gray-400 font-bold text-lg">Clean Slate.</p>
                <p className="text-gray-600 text-sm">No threads currently require moderation.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {visibleThreads.map((thread) => (
                  <div key={thread._id} className="glass-card p-6 flex flex-col sm:flex-row sm:items-center gap-6 border-white/[0.05] hover:border-white/20 transition-all group">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-bold text-gray-100 text-lg group-hover:text-primary-300 transition-colors truncate">{thread.title}</p>
                        {thread.status === 'Flagged' && (
                          <span className="badge-warning animate-pulse">
                            <AlertTriangle size={10} /> Escalated
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs font-bold font-mono tracking-tight uppercase">
                        <span className="text-primary-500/80">@{thread.author?.username || 'System'}</span>
                        <span className="text-gray-600">ID: {thread._id.slice(-6)}</span>
                        <span className="text-gray-600">{timeAgo(thread.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => handleFlagThread(thread._id)}
                        disabled={actionLoading === thread._id}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${thread.status === 'Flagged'
                            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30 hover:bg-amber-500/20'
                            : 'bg-white/[0.03] text-gray-400 border border-white/[0.08] hover:bg-white/[0.08] hover:text-white'
                          }`}
                      >
                        {actionLoading === thread._id ? <Loader2 size={14} className="animate-spin" /> : <Flag size={14} />}
                        {thread.status === 'Flagged' ? 'Unflag Topic' : 'Flag Topic'}
                      </button>
                      <button
                        onClick={() => handleDeleteThread(thread._id)}
                        disabled={actionLoading === thread._id}
                        className="bg-rose-500/10 text-rose-500 border border-rose-500/20 px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-rose-500 hover:text-white transition-all flex items-center gap-2"
                      >
                        <Trash2 size={14} /> Purge
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="glass-card border-none bg-dark-800/20 backdrop-blur-3xl rounded-[2rem] overflow-hidden border border-white/[0.05] shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/[0.05] bg-white/[0.02]">
                    {['Member', 'Credentials', 'Identity', 'System Status', 'Engagement', 'Controls'].map((h) => (
                      <th key={h} className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {loading.users ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-20 text-center">
                        <Loader2 size={32} className="text-primary-500 animate-spin mx-auto" />
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-20 text-center text-gray-500 font-bold">No members match your criteria.</td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600/40 to-accent-purple/40 border border-white/10 flex items-center justify-center text-white font-black shadow-lg">
                              {user.username[0].toUpperCase()}
                            </div>
                            <span className="font-bold text-gray-100 group-hover:text-primary-300 transition-colors uppercase tracking-tight text-sm">{user.username}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-mono text-gray-500">{user.email}</td>
                        <td className="px-6 py-4">
                          {user.role === 'admin' ? (
                            <span className="badge-warning font-black text-[9px] px-2 py-1"><Shield size={10} /> Root Auth</span>
                          ) : (
                            <span className="badge-info font-black text-[9px] px-2 py-1"><UserCheck size={10} /> Verified</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {user.status === 'Active' ? (
                            <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold uppercase tracking-tight">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                              Nominal
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-tight">
                              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
                              Restricted
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-[10px] font-black text-gray-600 uppercase tracking-widest">{timeAgo(user.createdAt)}</td>
                        <td className="px-6 py-4">
                          {user.role !== 'admin' ? (
                            <button
                              onClick={() => handleUserStatus(user._id, user.status === 'Active' ? 'Suspended' : 'Active')}
                              disabled={actionLoading === user._id}
                              className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all duration-300 ${user.status === 'Active'
                                  ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white'
                                  : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white'
                                }`}
                            >
                              {actionLoading === user._id ? 'Processing...' : user.status === 'Active' ? 'Revoke Access' : 'Grant Access'}
                            </button>
                          ) : (
                            <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Protected User</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
