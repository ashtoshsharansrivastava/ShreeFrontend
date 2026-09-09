import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Worker Directory & Account Management Section (Dark Theme)
function WorkerManagementSection() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    workerId: '',
    fullName: '',
    password: '',
    role: 'worker',
    profileImage: '',
  });

  const fetchWorkers = async () => {
    try {
      const res = await axios.get('https://shree-attendance-backend.onrender.com/api/workers');
      setWorkers(res.data.workers || []);
    } catch (err) {
      console.error('Failed to fetch workers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData((prev) => ({ ...prev, profileImage: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleAddWorker = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://shree-attendance-backend.onrender.com/api/workers', formData);
      setFormData({ workerId: '', fullName: '', password: '', role: 'worker', profileImage: '' });
      fetchWorkers();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add worker');
    }
  };

  const handleDeleteWorker = async (workerId) => {
    if (!window.confirm(`Are you sure you want to delete worker account "${workerId.toUpperCase()}"?`)) return;
    try {
      await axios.delete(`https://shree-attendance-backend.onrender.com/api/workers/${workerId}`);
      fetchWorkers();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete worker');
    }
  };

  const handleRemovePhoto = async (workerId) => {
    if (!window.confirm(`Clear profile photo for "${workerId.toUpperCase()}"?`)) return;
    try {
      await axios.put(`https://shree-attendance-backend.onrender.com/api/workers/${workerId}`, { removePhoto: true });
      fetchWorkers();
    } catch (err) {
      alert('Failed to remove worker photo');
    }
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Add Worker Form */}
      <div className="bg-slate-800/60 border border-slate-700/50 p-6 rounded-2xl shadow-lg">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">Add New Worker Account</h2>
        <form onSubmit={handleAddWorker} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Worker ID</label>
            <input
              type="text"
              placeholder="e.g. EMP102"
              value={formData.workerId}
              onChange={(e) => setFormData({ ...formData, workerId: e.target.value })}
              className="w-full bg-slate-900/80 border border-slate-700 p-2.5 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Full Name</label>
            <input
              type="text"
              placeholder="e.g. Rajesh Kumar"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full bg-slate-900/80 border border-slate-700 p-2.5 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-slate-900/80 border border-slate-700 p-2.5 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Profile Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-xs text-slate-400 file:mr-2 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-700 file:text-slate-200 hover:file:bg-slate-600 cursor-pointer"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-red-600/20"
            >
              + Create Worker
            </button>
          </div>
        </form>
      </div>

      {/* Worker Directory Table */}
      <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700 bg-slate-900/60">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Worker Directory ({workers.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-900/40 border-b border-slate-700 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-6">Photo</th>
                <th className="py-3 px-6">Worker ID</th>
                <th className="py-3 px-6">Full Name</th>
                <th className="py-3 px-6">Role</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50 font-medium text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-400">
                    Loading workers directory...
                  </td>
                </tr>
              ) : workers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-400">
                    No worker accounts configured.
                  </td>
                </tr>
              ) : (
                workers.map((w) => (
                  <tr key={w.workerId} className="hover:bg-slate-700/30 transition-colors">
                    <td className="py-3 px-6">
                      {w.profileImage ? (
                        <img src={w.profileImage} alt={w.fullName} className="w-10 h-10 rounded-full object-cover border border-slate-600" />
                      ) : (
                        <div className="w-10 h-10 bg-slate-700 border border-slate-600 rounded-full flex items-center justify-center text-xs font-bold text-slate-400">
                          N/A
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-6 font-bold text-white uppercase tracking-wide">{w.workerId}</td>
                    <td className="py-3 px-6">{w.fullName}</td>
                    <td className="py-3 px-6 capitalize">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${w.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-slate-500/10 text-slate-300 border border-slate-500/20'}`}>
                        {w.role}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-right space-x-2">
                      {w.profileImage && (
                        <button
                          onClick={() => handleRemovePhoto(w.workerId)}
                          className="text-amber-400 hover:text-white bg-amber-500/10 hover:bg-amber-600 border border-amber-500/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                        >
                          Clear Photo
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteWorker(w.workerId)}
                        className="text-red-400 hover:text-white bg-red-500/10 hover:bg-red-600 border border-red-500/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

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
      const response = await axios.get('https://shree-attendance-backend.onrender.com/api/attendance');
      const data = response.data.records || response.data;
      const sortedData = Array.isArray(data) ? data.sort((a, b) => new Date(b.createdAt || b.timestamp) - new Date(a.createdAt || a.timestamp)) : [];
      setRecords(sortedData);
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

  // Delete Record Handler
  const handleDeleteRecord = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to permanently delete this attendance log?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`https://shree-attendance-backend.onrender.com/api/attendance/${id}`);
      setRecords((prev) => prev.filter((r) => r._id !== id));
    } catch (error) {
      console.error('Failed to delete record:', error);
      alert(error.response?.data?.error || 'Failed to delete record from server.');
    }
  };

  // Filter records based on Worker ID, Location, or Work Zone message
  const filteredRecords = records.filter(
    (item) =>
      item.workerId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Export visible attendance logs to CSV
  const handleExportCSV = () => {
    if (filteredRecords.length === 0) {
      alert('No attendance records available to export.');
      return;
    }

    const headers = ['Worker ID,Work Zone,Timestamp,Location,Status,Photo URL\n'];
    const rows = filteredRecords.map((r) => {
      const dateStr = r.createdAt || r.timestamp;
      const date = dateStr ? new Date(dateStr).toLocaleString().replace(/,/g, '') : 'N/A';
      const zone = `"${(r.message || '').replace(/"/g, '""')}"`;
      const loc = `"${(r.location || '').replace(/"/g, '""')}"`;
      const photo = `"${r.photo || ''}"`;
      return `${r.workerId},${zone},${date},${loc},${r.status || 'Verified'},${photo}\n`;
    });

    const blob = new Blob([...headers, rows], { type: 'text/csv;charset=utf-8;' });
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
    const recordDate = new Date(r.createdAt || r.timestamp).toDateString();
    const today = new Date().toDateString();
    return recordDate === today;
  }).length;

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-sans select-none">
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
            <p className="text-sm font-bold text-slate-200">{user?.fullName || user?.name || 'Administrator'}</p>
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

        {/* Worker Management Section */}
        <WorkerManagementSection />

        {/* Action & Search Bar */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Worker ID, Zone or Location..."
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
                  <th className="py-4 px-6">Work Zone</th>
                  <th className="py-4 px-6">Timestamp</th>
                  <th className="py-4 px-6">GPS / Location</th>
                  <th className="py-4 px-6">Photo Proof</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50 font-medium text-slate-300">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-12 text-slate-400">
                      Loading attendance records from database...
                    </td>
                  </tr>
                ) : filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-12 text-slate-400">
                      No attendance logs found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((record) => {
                    const dateObj = new Date(record.createdAt || record.timestamp);
                    return (
                      <tr key={record._id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="py-4 px-6 font-bold text-white uppercase tracking-wide">
                          {record.workerId}
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-700 text-slate-200 border border-slate-600">
                            {record.message || 'General'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-300">
                          <div>{dateObj.toLocaleDateString()}</div>
                          <div className="text-slate-500 font-mono text-[11px]">
                            {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-xs max-w-xs truncate" title={record.location}>
                          📍 {record.location}
                        </td>
                        <td className="py-4 px-6">
                          {record.photo ? (
                            <img
                              src={record.photo}
                              alt="Verification"
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
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleDeleteRecord(record._id)}
                            className="text-red-400 hover:text-white bg-red-500/10 hover:bg-red-600 border border-red-500/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
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