import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminDashboard({ user, setUser }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const navigate = useNavigate();

  // Fetch all attendance logs from backend
  const fetchAttendanceRecords = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/attendance');
      setRecords(response.data.records || []);
    } catch (error) {
      console.error('Failed to fetch attendance logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('shree_attendance_user');
    navigate('/login');
  };

  // Filter records based on Worker ID or Location query
  const filteredRecords = records.filter(
    (item) =>
      item.workerId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Export visible attendance logs to CSV (Including Photo URL audit link)
  const handleExportCSV = () => {
    if (filteredRecords.length === 0) {
      alert('No attendance records available to export.');
      return;
    }

    const headers = ['Worker ID,Timestamp,Location,Status,Photo URL\n'];
    const rows = filteredRecords.map((r) => {
      const date = new Date(r.createdAt).toLocaleString().replace(/,/g, '');
      const loc = `"${(r.location || '').replace(/"/g, '""')}"`;
      const photo = `"${r.photo || ''}"`;
      return `${r.workerId},${date},${loc},${r.status || 'Verified'},${photo}\n`;
    });

    const blob = new Blob([...headers, ...rows], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shree_attendance_report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Metrics calculation
  const totalSubmissions = records.length;
  const uniqueWorkers = new Set(records.map((r) => r.workerId)).size;
  const todayCount = records.filter((r) => {
    const recordDate = new Date(r.createdAt).toDateString();
    const today = new Date().toDateString();
    return recordDate === today;
  }).length;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans select-none">
      {/* Top Navbar */}
      <header className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700/60 sticky top-0 z-20 px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src="/shreelogo.png" alt="Shree Cement Logo" className="h-9 w-auto object-contain" />
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-wide leading-none">
              Plant Admin Portal
            </h1>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-semibold tracking-wider uppercase mt-1">
              Shree Cement Attendance System
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-200">{user?.name || 'Administrator'}</p>
            <p className="text-xs text-red-400 font-semibold uppercase">{user?.workerId || 'ADMIN'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-red-600/30 transition-all"
          >
            LOGOUT
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Quick Analytics Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 flex items-center justify-between shadow-lg">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Logs</p>
              <p className="text-3xl font-extrabold text-white mt-1">{totalSubmissions}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400 font-bold text-xl">
              📋
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 flex items-center justify-between shadow-lg">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Today's Verifications</p>
              <p className="text-3xl font-extrabold text-emerald-400 mt-1">{todayCount}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xl">
              ✅
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 flex items-center justify-between shadow-lg">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Personnel</p>
              <p className="text-3xl font-extrabold text-sky-400 mt-1">{uniqueWorkers}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 font-bold text-xl">
              👷🏼‍♂️
            </div>
          </div>
        </div>

        {/* Action & Search Bar */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Worker ID or Location..."
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleExportCSV}
              className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all border border-emerald-500 flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
            >
              <span>📥</span> EXPORT CSV
            </button>
            <button
              onClick={fetchAttendanceRecords}
              className="flex-1 sm:flex-none bg-slate-700 hover:bg-slate-600 active:scale-95 text-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl transition-all border border-slate-600 flex items-center justify-center gap-2"
            >
              <span>🔄</span> REFRESH
            </button>
          </div>
        </div>

        {/* Attendance Records Table */}
        <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-900/60 border-b border-slate-700 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">Worker ID</th>
                  <th className="py-4 px-6">Timestamp</th>
                  <th className="py-4 px-6">GPS / Location</th>
                  <th className="py-4 px-6">Photo Proof</th>
                  <th className="py-4 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50 font-medium text-slate-300">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-slate-400">
                      Loading attendance records from database...
                    </td>
                  </tr>
                ) : filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-slate-400">
                      No attendance logs found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((record) => (
                    <tr key={record._id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="py-4 px-6 font-bold text-white uppercase tracking-wide">
                        {record.workerId}
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-300">
                        <div>{new Date(record.createdAt).toLocaleDateString()}</div>
                        <div className="text-slate-500 font-mono text-[11px]">
                          {new Date(record.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-xs max-w-xs truncate" title={record.location}>
                        📍 {record.location}
                      </td>
                      <td className="py-4 px-6">
                        {record.photo ? (
                          <img
                            src={record.photo}
                            alt="Watermarked Verification"
                            onClick={() => setSelectedPhoto(record.photo)}
                            className="h-12 w-16 object-cover rounded-lg border border-slate-600 hover:border-red-500 hover:scale-105 cursor-pointer transition-all shadow-md"
                          />
                        ) : (
                          <span className="text-xs text-slate-500">No Image</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {record.status || 'Verified'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Enlarged Photo Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 bg-red-600 text-white font-bold h-8 w-8 rounded-full flex items-center justify-center text-sm shadow-lg hover:bg-red-700 transition-colors"
            >
              ✕
            </button>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Attendance Photo Proof Verification
            </p>
            <img
              src={selectedPhoto}
              alt="Enlarged Proof"
              className="w-full max-h-[75vh] object-contain rounded-xl border border-slate-800"
            />
          </div>
        </div>
      )}
    </div>
  );
}