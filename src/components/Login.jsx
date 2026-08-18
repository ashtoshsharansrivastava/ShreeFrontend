import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ setUser }) {
  const [workerId, setWorkerId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (workerId.trim() && password.trim()) {
      // Set the logged-in user state
      setUser({ name: workerId }); 
      
      // ADMIN ROUTING LOGIC: 
      // If the ID contains "admin" (case-insensitive), go to Admin Dashboard
      if (workerId.toLowerCase().includes('admin')) {
        navigate('/admin');
      } else {
        // Otherwise, go to the Worker Verification Camera
        navigate('/attendance');
      }
    } else {
      alert("Please enter both Worker ID and Password");
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-900 flex items-center justify-center p-4 overflow-hidden select-none">
      
      {/* Background Watermark - Strictly bounded so it can never overflow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06]">
        <img 
          src="/shreelogo.png" 
          alt="Shree Cement Watermark" 
          className="w-72 sm:w-96 max-w-full h-auto object-contain"
        />
      </div>

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-slate-100">
        
        {/* Header Logo & Title */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="h-16 w-full flex items-center justify-center mb-3">
            <img 
              src="/shreelogo.png" 
              alt="Shree Cement Logo" 
              className="h-full max-h-16 w-auto object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Worker Portal</h1>
          <p className="text-xs font-semibold uppercase text-slate-400 tracking-widest mt-1">Shree Cement Attendance System</p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Worker ID / Admin ID</label>
            <input 
              type="text" 
              value={workerId}
              onChange={(e) => setWorkerId(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all text-sm font-medium"
              placeholder="username@shreecement.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all text-sm font-medium"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-red-600/30 transition-all text-sm tracking-wide mt-2"
          >
            SIGN IN
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-100 pt-4">
          <p className="text-[11px] text-slate-400 font-medium">Authorized Access Only • Shree Cement Ltd.</p>
        </div>
      </div>
    </div>
  );
}