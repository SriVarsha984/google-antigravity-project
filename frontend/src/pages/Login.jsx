import React, { useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { LogIn, Eye, EyeOff, AlertCircle, MessageSquare, Loader2 } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setIsLoading(true);
    try {
      await loginUser({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center py-10 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10 px-4">
        {/* Header */}
        <div className="text-center mb-10 animate-slide-down">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-purple flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
              <MessageSquare size={22} className="text-white" />
            </div>
            <span className="font-display font-extrabold text-2xl text-white tracking-tight">ForumPanel</span>
          </Link>
          <h1 className="font-display font-extrabold text-3xl text-white mb-2">Welcome Back</h1>
          <p className="text-gray-500 font-medium">Please enter your details to sign in</p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-8 sm:p-10 shadow-2xl animate-fade-in border-white/[0.08]">
          {error && (
            <div className="alert-error mb-6 py-4 px-5 bg-rose-500/10 border-rose-500/20 text-rose-400 font-medium flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center shrink-0">
                 <AlertCircle size={16} />
              </div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                className="input-field bg-white/[0.03] border-white/10 focus:bg-white/[0.06] focus:border-primary-500/50 py-4"
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  required
                  className="input-field bg-white/[0.03] border-white/10 focus:bg-white/[0.06] focus:border-primary-500/50 py-4 pr-12"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-4 text-base font-bold shadow-glow-lg group mt-2"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Sign In</span>
                  <LogIn size={18} className="transition-transform group-hover:translate-x-1" />
                </div>
              )}
            </button>

            <div className="relative flex items-center gap-4 my-8">
              <div className="h-px flex-1 bg-white/[0.06]"></div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">Or continue with</span>
              <div className="h-px flex-1 bg-white/[0.06]"></div>
            </div>

            <button
              type="button"
              className="flex items-center justify-center gap-3 w-full py-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-sm font-bold text-white transition-all duration-300"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Gmail
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-sm text-gray-500 font-medium">
          New here?{' '}
          <Link to="/register" className="text-primary-400 font-bold hover:text-primary-300 transition-colors border-b border-primary-500/20 hover:border-primary-500 pb-0.5">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
