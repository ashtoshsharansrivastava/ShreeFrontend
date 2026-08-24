import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Worker Directory & Account Management Section
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
    <div className="space-y-6 mb-10">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-base font-bold text-slate-800 mb-4">Add New Worker Account</h2>
        <form onSubmit={handleAddWorker} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Worker ID</label>
            <input
              type="text"
              placeholder="e.g. EMP102"
              value={formData.workerId}
              onChange={(e) => setFormData({ ...formData, workerId: e.target.value })}
              className="w-full border border-slate-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
            <input
              type="text"
              placeholder="e.g. Rajesh Kumar"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full border border-slate-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full border border-slate-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Profile Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-xs text-slate-500 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-lg text-sm transition shadow-sm"
            >
              + Create Worker
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-base font-bold text-slate-800">Worker Directory ({workers.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                <th className="p-4 font-bold">Photo</th>
                <th className="p-4 font-bold">Worker ID</th>
                <th className="p-4 font-bold">Full Name</th>
                <th className="p-4 font-bold">Role</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-slate-500 font-semibold animate-pulse">
                    Loading workers directory...
                  </td>
                </tr>
              ) : workers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-slate-500 font-semibold">
                    No worker accounts configured.
                  </td>
                </tr>
              ) : (
                workers.map((w) => (
                  <tr key={w.workerId} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="p-4">
                      {w.profileImage ? (
                        <img src={w.profileImage} alt={w.fullName} className="w-10 h-10 rounded-full object-cover border" />
                      ) : (
                        <div className="w-10 h-10 bg-slate-100 border rounded-full flex items-center justify-center text-xs font-bold text-slate-400">
                          N/A
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-semibold uppercase text-slate-900">{w.workerId}</td>
                    <td className="p-4 font-medium">{w.fullName}</td>
                    <td className="p-4 capitalize">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${w.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'}`}>
                        {w.role}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {w.profileImage && (
                        <button
                          onClick={() => handleRemovePhoto(w.workerId)}
                          className="text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg transition"
                        >
                          Clear Photo
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteWorker(w.workerId)}
                        className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg transition"
                      >
                        Delete Worker
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
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get('https://shree-attendance-backend.onrender.com/api/attendance');
      const data = response.data.records || response.data;
      const sortedData = Array.isArray(data) ? data.sort((a, b) => new Date(b.createdAt || b.timestamp) - new Date(a.createdAt || a.timestamp)) : [];
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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this attendance record and its selfie proof?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`https://shree-attendance-backend.onrender.com/api/attendance/${id}`);
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
      <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-4">
          <img src="/shreelogo.png" alt="Shree Cement" className="h-8 object-contain" />
          <div className="h-6 w-px bg-slate-300"></div>
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">Nawalgarh Plant - Attendance Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-slate-600">Admin: {user?.fullName || user?.name || 'Administrator'}</span>
          <button 
            onClick={handleLogout}
            className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
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

        {/* Worker Account & Profile Picture Management */}
        <WorkerManagementSection />

        {/* Attendance Data Table */}
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
                    const dateObj = new Date(record.createdAt || record.timestamp);
                    const timeString = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const dateString = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

                    return (
                      <tr key={record._id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                        <td className="p-4 font-semibold text-slate-900 uppercase">{record.workerId}</td>
                        <td className="p-4">
                          <div className="font-bold">{timeString}</div>
                          <div className="text-xs text-slate-500">{dateString}</div>
                        </td>
                        <td className="p-4 font-mono text-xs">{record.location}</td>
                        <td className="p-4">
                          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                            {record.status || 'Verified'}
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