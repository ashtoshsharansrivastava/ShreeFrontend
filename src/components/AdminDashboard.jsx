import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminDashboard({ user, setUser }) {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch real-time data from Render backend
  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get('https://shree-attendance-backend.onrender.com/api/attendance');
      const sortedData = response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setRecords(sortedData);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch records:', err);
      setError('Could not load attendance data. Please check server connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
    const interval = setInterval(fetchAttendanceData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Delete specific attendance record and photo
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this attendance record and its selfie proof?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`https://shree-attendance-backend.onrender.com/api/attendance/${id}`);
      // Optimistically remove record from UI state
      setRecords((prev) => prev.filter((record) => record._id !== id));
    } catch (err) {
      console.error('Failed to delete record:', err);
      alert(err.response?.data?.error || 'Failed to delete record from server.');
    }
  };

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
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Logs Today</h3>
            <p className="text-3xl font-black text-slate-800">
              {loading ? '...' : records.length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">System Status</h3>
            {error ? (
              <p className="text-xl font-bold text-red-600 flex items-center gap-2 mt-2">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span> Offline
              </p>
            ) : (
              <p className="text-xl font-bold text-emerald-600 flex items-center gap-2 mt-2">
                <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span> Online
              </p>
            )}
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h2 className="text-base font-bold text-slate-800">Recent Attendance Logs</h2>
            <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition">
              Download CSV ⬇
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                  <th className="p-4 font-bold">Worker ID</th>
                  <th className="p-4 font-bold">Date & Time</th>
                  <th className="p-4 font-bold">GPS Location</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold">Selfie Proof</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-500 font-semibold animate-pulse">
                      Loading latest records...
                    </td>
                  </tr>
                ) : records.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-500 font-semibold">
                      No attendance records found.
                    </td>
                  </tr>
                ) : (
                  records.map((record) => {
                    const dateObj = new Date(record.timestamp);
                    const timeString = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const dateString = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

                    return (
                      <tr key={record._id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                        <td className="p-4 font-semibold text-slate-900">{record.workerId}</td>
                        <td className="p-4">
                          <div className="font-bold">{timeString}</div>
                          <div className="text-xs text-slate-500">{dateString}</div>
                        </td>
                        <td className="p-4 font-mono text-xs">{record.location}</td>
                        <td className="p-4">
                          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                            Verified
                          </span>
                        </td>
                        <td className="p-4">
                          {record.photo ? (
                            <a 
                              href={record.photo} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-blue-600 hover:text-blue-800 font-semibold text-xs border border-blue-200 px-3 py-1.5 rounded bg-blue-50 transition cursor-pointer inline-block"
                            >
                              View Photo
                            </a>
                          ) : (
                            <span className="text-slate-400 text-xs">No Photo</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDelete(record._id)}
                            className="text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-bold transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}