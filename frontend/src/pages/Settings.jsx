import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { 
  User, Image, AlignLeft, Save, Loader2, Mail, 
  BarChart2, Settings as SettingsIcon, Monitor, Bell, CreditCard, Lock,
  LogOut, AlertTriangle, Phone, Globe, Hash, Heart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const INTERESTS = [
  "Culture", "Technology", "Business", "Politics", "Finance",
  "Food and drink", "Sports", "Art and Illustration", "World politics",
  "Health politics", "News", "Fashion & beauty", "Music", 
  "Faith & spirituality", "Climate & environment", "Science", 
  "Literature", "Fiction", "Health and wellness", "Design", 
  "Travel", "Parenting", "Philosophy", "Cosmics", "International", 
  "Crypto", "History", "Humor", "Education", "Film & TV"
];

const Settings = () => {
  const { user, updateProfile, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { theme: activeTheme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Extended form state incorporating new fields
  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    phone: '',
    bio: user?.bio || '',
    profilePic: user?.profilePic || '',
    websiteUrl: '',
    
    // Display
    videoAutoPlay: user?.videoAutoPlay !== undefined ? user.videoAutoPlay : true,
    theme: user?.theme || 'Dark',
    defaultTab: user?.defaultTab || 'Home',
    
    // Notifications
    pushNotifications: user?.pushNotifications !== undefined ? user.pushNotifications : true,
    interests: user?.interests || []
  });
  
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        websiteUrl: user.websiteUrl || '',
        bio: user.bio || '',
        profilePic: user.profilePic || '',
        theme: user.theme || 'Dark',
        defaultTab: user.defaultTab || 'Home'
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    if (status.success) setStatus(p => ({ ...p, success: false }));
  };

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
    if (status.success) setStatus(p => ({ ...p, success: false }));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });
    try {
      // Passes full object to backend (backend ignores unofficial fields naturally, avoiding crash)
      await updateProfile(formData);
      setStatus({ loading: false, success: true, error: '' });
    } catch (err) {
      setStatus({ loading: false, success: false, error: err.response?.data?.message || 'Update failed' });
    }
  };

  const TABS = [
    { id: 'profile', label: 'Edit Profile', icon: User },
    { id: 'account', label: 'Account', icon: SettingsIcon },
    { id: 'display', label: 'Display', icon: Monitor },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'interests', label: 'Interests', icon: Heart },
  ];

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 animate-fade-in flex flex-col md:flex-row gap-10">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
        <h2 className="font-display font-black text-xl text-white tracking-tight mb-2 px-4">Settings</h2>
        <nav className="flex flex-col gap-1 flex-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary-600/10 text-primary-400 border border-primary-500/20 shadow-glow' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.03] border border-transparent'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-primary-400' : 'text-gray-500'} />
                {tab.label}
              </button>
            );
          })}
        </nav>
        
        {/* Sign Out Button */}
        <div className="mt-8 pt-6 border-t border-white/[0.05]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold text-sm text-rose-500 hover:bg-rose-500/10 hover:shadow-glow-lg transition-all duration-300"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        
        {/* ======================= EDIT PROFILE ======================= */}
        {activeTab === 'profile' && (
          <div className="glass-card p-8 sm:p-10 shadow-2xl border-white/[0.08] animate-fade-in">
            <h3 className="font-display font-black text-2xl text-white mb-8 border-b border-white/[0.05] pb-4">Edit Profile</h3>
            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="flex items-start gap-8">
                <div className="w-24 h-24 rounded-full bg-dark-800 border-4 border-white/5 shadow-2xl overflow-hidden shrink-0">
                   {formData.profilePic ? (
                     <img src={formData.profilePic} className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white font-black text-3xl">
                       {formData.username?.[0]?.toUpperCase() || '?'}
                     </div>
                   )}
                </div>
                <div className="flex-1 space-y-3">
                  <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                    <Image size={14} className="text-primary-500" /> Image URL
                  </label>
                  <input
                    type="text"
                    name="profilePic"
                    className="input-field bg-white/[0.02] border-white/10 focus:bg-white/[0.05] py-3"
                    placeholder="Provide image address"
                    value={formData.profilePic}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]"><User size={14} /> Full Name</label>
                  <input type="text" name="name" className="input-field bg-white/[0.02] py-3" placeholder="John Doe" value={formData.name} onChange={handleChange} />
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]"><Hash size={14} /> Username</label>
                  <input type="text" name="username" className="input-field bg-white/[0.02] py-3" placeholder="johndoe123" value={formData.username} onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]"><Globe size={14} /> Website URL</label>
                <input type="url" name="websiteUrl" className="input-field bg-white/[0.02] py-3" placeholder="https://example.com" value={formData.websiteUrl} onChange={handleChange} />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]"><AlignLeft size={14} /> Bio</label>
                <textarea
                  name="bio"
                  rows={4}
                  className="input-field bg-white/[0.02] py-3 resize-none"
                  placeholder="Share a bit about yourself..."
                  value={formData.bio}
                  onChange={handleChange}
                />
              </div>

              {/* Universal Save Bar */}
              <div className="pt-6 border-t border-white/[0.05] flex justify-end gap-6 items-center">
                 {status.success && <span className="text-emerald-500 text-sm font-bold animate-slide-up">Profile Sync Completed!</span>}
                 <button type="submit" className="btn-primary py-3 px-8 text-sm">{status.loading ? <Loader2 size={16} className="animate-spin" /> : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        )}

        {/* ======================= ACCOUNT ======================= */}
        {activeTab === 'account' && (
          <div className="glass-card p-8 sm:p-10 shadow-2xl border-white/[0.08] animate-fade-in flex flex-col h-full">
            <h3 className="font-display font-black text-2xl text-white mb-8 border-b border-white/[0.05] pb-4">Account Configuration</h3>
            <form onSubmit={handleSubmit} className="space-y-8 flex-1">
              
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]"><Mail size={14} /> Email Address</label>
                <input type="email" name="email" required className="input-field bg-white/[0.02] py-3" value={formData.email} onChange={handleChange} />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]"><Phone size={14} /> Phone Number</label>
                <input type="tel" name="phone" className="input-field bg-white/[0.02] py-3" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={handleChange} />
              </div>

              <div className="pt-6 flex justify-end gap-6 items-center">
                 {status.success && <span className="text-emerald-500 text-sm font-bold animate-slide-up">Account Sync Completed!</span>}
                 {status.error && <span className="text-rose-500 text-sm font-bold animate-slide-up">{status.error}</span>}
                 <button type="submit" className="btn-primary py-3 px-8 text-sm">{status.loading ? <Loader2 size={16} className="animate-spin" /> : 'Save Changes'}</button>
              </div>
            </form>

            <div className="mt-12 pt-8 border-t border-rose-500/20">
               <h4 className="font-bold text-rose-500 mb-2 flex items-center gap-2"><AlertTriangle size={18} /> Danger Zone</h4>
               <p className="text-gray-400 text-sm mb-6">Permanently delete your account and all associated metrics, articles, and data.</p>
               <button className="btn-danger py-3 px-6 text-sm">Delete Account</button>
            </div>
          </div>
        )}

        {/* ======================= DISPLAY ======================= */}
        {activeTab === 'display' && (
          <div className="glass-card p-8 sm:p-10 shadow-2xl border-white/[0.08] animate-fade-in">
            <h3 className="font-display font-black text-2xl text-white mb-8 border-b border-white/[0.05] pb-4">Display Preferences</h3>
            
            <div className="space-y-12">
              <div className="space-y-4 shadow-sm bg-white/[0.01] p-5 rounded-2xl border border-white/5">
                <h4 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.1em]">Media Autoplay</h4>
                <label className="flex items-center gap-4 cursor-pointer group">
                  <div className="relative inline-flex items-center">
                    <input type="checkbox" name="videoAutoPlay" checked={formData.videoAutoPlay} onChange={handleChange} className="peer sr-only" />
                    <div className="w-5 h-5 bg-dark-800 border-2 border-gray-600 rounded-md peer-checked:bg-primary-500 peer-checked:border-primary-500 transition-colors flex items-center justify-center">
                       {formData.videoAutoPlay && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                  </div>
                  <span className="font-medium text-gray-200 group-hover:text-white transition-colors">Video: Auto-play Media</span>
                </label>
              </div>

              <div className="space-y-4">
                <h4 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.1em]">Color Theme</h4>
                <div className="flex gap-8">
                  {['Auto', 'Light', 'Dark'].map((t) => (
                    <label key={t} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative inline-flex items-center">
                        <input 
                          type="radio" 
                          name="theme" 
                          value={t} 
                          checked={formData.theme === t} 
                          onChange={(e) => {
                            handleChange(e);
                            toggleTheme(t);
                          }} 
                          className="peer sr-only" 
                        />
                        {/* Blue circle logic */}
                        <div className={`w-5 h-5 rounded-full border-2 transition-colors flex items-center justify-center ${formData.theme === t ? 'border-primary-500' : 'border-gray-600 group-hover:border-gray-400'}`}>
                           {formData.theme === t && <div className="w-2.5 h-2.5 rounded-full bg-primary-500 shadow-[0_0_8px_#6366f1]" />}
                        </div>
                      </div>
                      <span className="font-medium text-gray-200 group-hover:text-white transition-colors">{t}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.1em]">Default Load Tab</h4>
                <div className="flex gap-8">
                  {['Home', 'Inbox'].map((tab) => (
                    <label key={tab} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative inline-flex items-center">
                        <input type="radio" name="defaultTab" value={tab} checked={formData.defaultTab === tab} onChange={handleChange} className="peer sr-only" />
                        <div className={`w-5 h-5 rounded-full border-2 transition-colors flex items-center justify-center ${formData.defaultTab === tab ? 'border-primary-500' : 'border-gray-600 group-hover:border-gray-400'}`}>
                           {formData.defaultTab === tab && <div className="w-2.5 h-2.5 rounded-full bg-primary-500 shadow-[0_0_8px_#6366f1]" />}
                        </div>
                      </div>
                      <span className="font-medium text-gray-200 group-hover:text-white transition-colors">{tab}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-white/[0.05] flex justify-end gap-6 items-center">
                 <button onClick={handleSubmit} className="btn-primary py-3 px-8 text-sm">Save Display Options</button>
              </div>
            </div>
          </div>
        )}

        {/* ======================= NOTIFICATIONS ======================= */}
        {activeTab === 'notifications' && (
          <div className="glass-card p-8 sm:p-10 shadow-2xl border-white/[0.08] animate-fade-in">
            <h3 className="font-display font-black text-2xl text-white mb-8 border-b border-white/[0.05] pb-4">Notifications</h3>
            
            <div className="space-y-12">
              <div className="flex items-center justify-between p-5 bg-white/[0.01] rounded-2xl border border-white/5">
                <div>
                  <h4 className="font-bold text-white text-lg">Push Notifications</h4>
                  <p className="text-gray-400 text-sm">System notifications for direct interactions.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="pushNotifications" className="sr-only peer" checked={formData.pushNotifications} onChange={handleChange} />
                  <div className="w-11 h-6 bg-dark-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500 shadow-glow"></div>
                </label>
              </div>

              <div className="pt-6 border-t border-white/[0.05] flex justify-end gap-6 items-center">
                 <button onClick={handleSubmit} className="btn-primary py-3 px-8 text-sm">Save Notifications</button>
              </div>
            </div>
          </div>
        )}

        {/* ======================= INTERESTS ======================= */}
        {activeTab === 'interests' && (
          <div className="glass-card p-8 sm:p-10 shadow-2xl border-white/[0.08] animate-fade-in">
            <h3 className="font-display font-black text-2xl text-white mb-8 border-b border-white/[0.05] pb-4">Manage Interests</h3>
            
            <div className="space-y-12">
              <div className="space-y-6">
                <div>
                   <h4 className="text-[12px] font-black text-primary-400 uppercase tracking-[0.1em] mb-1">Select Topics</h4>
                   <p className="text-gray-400 text-sm">Tailor your intelligence feed to topics you care about.</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-2">
                  {INTERESTS.map((interest) => {
                    const isChecked = formData.interests.includes(interest);
                    return (
                      <label key={interest} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative inline-flex items-center shrink-0">
                          <input type="checkbox" className="peer sr-only" checked={isChecked} onChange={() => toggleInterest(interest)} />
                          <div className={`w-4 h-4 rounded-md border text-white flex items-center justify-center transition-all ${isChecked ? 'bg-primary-500 border-primary-500 shadow-glow' : 'bg-transparent border-gray-600 group-hover:border-gray-400'}`}>
                             {isChecked && <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                          </div>
                        </div>
                        <span className={`text-sm tracking-tight transition-colors ${isChecked ? 'text-white font-semibold' : 'text-gray-400 group-hover:text-gray-200'}`}>
                          {interest}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-6 border-t border-white/[0.05] flex justify-end gap-6 items-center">
                 <button onClick={handleSubmit} className="btn-primary py-3 px-8 text-sm">Save Interests</button>
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  );
};

export default Settings;
