import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard({ user, setUser }) {
  const navigate = useNavigate();
  // Mock data - replace with axios.get('/api/attendance') later
  const [records, setRecords] = useState([
    { id: 1, name: 'Worker A', time: '10:30 AM', date: 'Aug 18, 2026', location: 'Lat: 27.84, Lng: 75.26', status: 'Verified' },
    { id: 2, name: 'Worker B', time: '10:35 AM', date: 'Aug 18, 2026', location: 'Lat: 27.84, Lng: 75.26', status: 'Verified' },
  ]);

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-4">
          <img src="/shreelogo.png" alt="Shree Cement" className="h-8 object-contain" />
          <div className="h-6 w-px bg-slate-300"></div>
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">Nawalgarh Plant - Attendance Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-slate-600">Admin: {user?.name}</span>
          <button 
            onClick={handleLogout}
            className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Workers Logged</h3>
            <p className="text-3xl font-black text-slate-800">24</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Pending Verification</h3>
            <p className="text-3xl font-black text-amber-500">3</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">System Status</h3>
            <p className="text-xl font-bold text-emerald-600 flex items-center gap-2 mt-2">
              <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span> Online
            </p>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h2 className="text-base font-bold text-slate-800">Recent Attendance Logs</h2>
            <button className="text-sm font-semibold text-red-600 hover:text-red-700 transition">
              Download CSV ⬇
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                  <th className="p-4 font-bold">Worker Name</th>
                  <th className="p-4 font-bold">Date & Time</th>
                  <th className="p-4 font-bold">GPS Location</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold">Selfie Proof</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-700">
                {records.map((record) => (
                  <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="p-4 font-semibold text-slate-900">{record.name}</td>
                    <td className="p-4">
                      <div className="font-bold">{record.time}</div>
                      <div className="text-xs text-slate-500">{record.date}</div>
                    </td>
                    <td className="p-4 font-mono text-xs">{record.location}</td>
                    <td className="p-4">
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                        {record.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button className="text-blue-600 hover:text-blue-800 font-semibold text-xs border border-blue-200 px-3 py-1.5 rounded bg-blue-50 transition">
                        View Photo
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}