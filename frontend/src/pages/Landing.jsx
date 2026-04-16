import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Users, Sparkles, MessageCircle, Shield } from 'lucide-react';

const Landing = () => {
  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center -mt-16 overflow-hidden">
      {/* Dynamic Background Image */}
      <div 
        className="absolute inset-0 z-0 opacity-40 scale-105"
        style={{
          backgroundImage: 'url("/hero-bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(80px)',
        }}
      />
      
      {/* Animated Gradient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/20 rounded-full blur-[120px] animate-pulse-slow delay-700" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 text-center">
        {/* Floating Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-primary-400 text-xs font-bold mb-8 animate-fade-in backdrop-blur-md shadow-glow">
          <Sparkles size={14} className="animate-pulse" />
          <span className="uppercase tracking-widest text-[10px]">The Future of Community</span>
        </div>

        <h1 className="text-5xl md:text-8xl font-display font-extrabold text-white tracking-tight leading-[0.9] mb-8 animate-slide-up">
          Own Your <br />
          <span className="gradient-text">Conversation.</span>
        </h1>

        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12 animate-slide-up delay-100 italic opacity-80">
          "The most powerful community platform for creators, developers, and thinkers. Beautifully simple, incredibly powerful."
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 animate-slide-up delay-200">
          <Link to="/register" className="btn-primary px-10 py-4 text-base font-bold group">
            Get Started <Sparkles size={18} className="transition-transform group-hover:scale-125 group-hover:rotate-12" />
          </Link>
          <Link to="/login" className="btn-secondary px-10 py-4 text-base font-bold bg-white/[0.05] border-white/10 hover:bg-white/10">
            Sign In
          </Link>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 animate-slide-up delay-300">
          {[
            {
              title: 'Premium UX',
              desc: 'Every pixel crafted for clarity and engagement. A truly distraction-free discussion experience.',
              icon: MessageSquare,
              color: 'from-primary-600 to-indigo-600',
              border: 'group-hover:border-primary-500/50'
            },
            {
              title: 'Pro Moderation',
              desc: 'Advanced tools to keep your community safe and thriving. Flag, suspend, and curate with ease.',
              icon: Shield,
              color: 'from-amber-600 to-orange-600',
              border: 'group-hover:border-amber-500/50'
            },
            {
              title: 'Activity Feed',
              desc: 'Stay in the loop with real-time updates and discussions. Never miss a meaningful contribution.',
              icon: MessageCircle,
              color: 'from-accent-cyan to-teal-600',
              border: 'group-hover:border-accent-cyan/50'
            }
          ].map((feat, i) => (
            <div key={i} className={`glass-card p-8 text-left group hover:-translate-y-2 transition-all duration-300 ${feat.border}`}>
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feat.color} flex items-center justify-center p-3 mb-6 shadow-glow`}>
                <feat.icon className="text-white w-full h-full" />
              </div>
              <h3 className="text-xl font-bold text-white font-display mb-3">{feat.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 text-gray-600 text-sm font-medium">
        Trusted by community leaders worldwide.
      </div>
    </div>
  );
};

export default Landing;
