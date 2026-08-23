import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login({ setUser }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [workerId, setWorkerId] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('worker');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Helper to clear form state when switching modes
  const handleToggleMode = () => {
    setIsSignUp((prev) => !prev);
    setPassword('');
    setFullName('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignUp) {
      if (!fullName.trim() || !workerId.trim() || !password.trim()) {
        alert('Please fill in all registration fields.');
        return;
      }

      setLoading(true);
      try {
        const response = await axios.post('/api/register', {
          workerId: workerId.trim(),
          fullName: fullName.trim(),
          password,
          role,
        });

        alert(response.data.message || `Account created successfully for ${fullName}! You can now sign in.`);
        setIsSignUp(false);
        setPassword('');
      } catch (error) {
        alert(error.response?.data?.error || 'Registration failed. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      if (!workerId.trim() || !password.trim()) {
        alert('Please enter both Worker ID and Password');
        return;
      }

      setLoading(true);
      try {
        const response = await axios.post('/api/login', {
          workerId: workerId.trim(),
          password,
        });

        const userData = response.data.user;

        // Save user state globally
        setUser({
          workerId: userData.workerId,
          name: userData.fullName,
          role: userData.role,
        });

        // Route based on access role
        if (userData.role === 'admin' || userData.workerId.toLowerCase().includes('admin')) {
          navigate('/admin');
        } else {
          navigate('/attendance');
        }
      } catch (error) {
        alert(error.response?.data?.error || 'Login failed. Check your ID and password.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-900 flex items-center justify-center p-4 overflow-hidden select-none">
      {/* Background Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06]">
        <img
          src="/shreelogo.png"
          alt="Shree Cement Watermark"
          className="w-72 sm:w-96 max-w-full h-auto object-contain"
        />
      </div>

      {/* Main Login / Register Card */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-slate-100">
        {/* Header Logo & Dynamic Title */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="h-16 w-full flex items-center justify-center mb-3">
            <img
              src="/shreelogo.png"
              alt="Shree Cement Logo"
              className="h-full max-h-16 w-auto object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            {isSignUp ? 'New Account Registration' : 'Worker Portal'}
          </h1>
          <p className="text-xs font-semibold uppercase text-slate-400 tracking-widest mt-1">
            {isSignUp ? 'Create your attendance profile' : 'Shree Cement Attendance System'}
          </p>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name Input (Visible only in Sign Up mode) */}
          {isSignUp && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all text-sm font-medium"
                placeholder="e.g. Ramesh Kumar"
                required={isSignUp}
                disabled={loading}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Worker ID / Employee Code
            </label>
            <input
              type="text"
              value={workerId}
              onChange={(e) => setWorkerId(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all text-sm font-medium"
              placeholder="e.g. SC-10294"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all text-sm font-medium"
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          {/* Role Dropdown */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Access Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all text-sm font-medium cursor-pointer"
              disabled={loading}
            >
              <option value="worker">Plant Worker / Staff</option>
              <option value="admin">Plant Administrator</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 active:scale-[0.98] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-lg shadow-red-600/30 transition-all text-sm tracking-wide mt-2"
          >
            {loading ? 'PROCESSING...' : isSignUp ? 'REGISTER ACCOUNT' : 'SIGN IN'}
          </button>
        </form>

        {/* Toggle Mode Link */}
        <div className="mt-6 text-center border-t border-slate-100 pt-4 space-y-2">
          <p className="text-xs text-slate-600 font-medium">
            {isSignUp ? 'Already registered?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={handleToggleMode}
              className="text-red-600 font-bold hover:underline focus:outline-none ml-1"
              disabled={loading}
            >
              {isSignUp ? 'Sign In' : 'Register Here'}
            </button>
          </p>

          <p className="text-[11px] text-slate-400 font-medium">
            Authorized Access Only • Shree Cement Ltd.
          </p>
        </div>
      </div>
    </div>
  );
}