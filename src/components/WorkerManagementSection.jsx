import { useState, useEffect } from 'react';
import axios from 'axios';

export default function WorkerManagementSection() {
  const [workers, setWorkers] = useState([]);
  const [formData, setFormData] = useState({ workerId: '', fullName: '', password: '', role: 'worker', profileImage: '' });

  const fetchWorkers = async () => {
    try {
      const res = await axios.get('https://shree-attendance-backend.onrender.com/api/workers');
      setWorkers(res.data.workers);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchWorkers(); }, []);

  // Handle base64 image upload selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, profileImage: reader.result });
      reader.readAsDataURL(file);
    }
  };

  // Add new worker
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

  // Delete worker account
  const handleDeleteWorker = async (workerId) => {
    if (!window.confirm(`Delete worker ${workerId}?`)) return;
    try {
      await axios.delete(`https://shree-attendance-backend.onrender.com/api/workers/${workerId}`);
      fetchWorkers();
    } catch (err) {
      alert('Failed to delete worker');
    }
  };

  // Clear/remove worker profile photo
  const handleRemovePhoto = async (workerId) => {
    try {
      await axios.put(`https://shree-attendance-backend.onrender.com/api/workers/${workerId}`, { removePhoto: true });
      fetchWorkers();
    } catch (err) {
      alert('Failed to remove photo');
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Worker Form */}
      <form onSubmit={handleAddWorker} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-center">
        <input placeholder="Worker ID" value={formData.workerId} onChange={(e) => setFormData({...formData, workerId: e.target.value})} className="border p-2 rounded text-sm" required />
        <input placeholder="Full Name" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="border p-2 rounded text-sm" required />
        <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="border p-2 rounded text-sm" required />
        <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm" />
        <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded text-sm font-bold">Add Worker</button>
      </form>

      {/* Workers List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-3">Photo</th>
              <th className="p-3">Worker ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Role</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {workers.map((w) => (
              <tr key={w.workerId} className="border-b">
                <td className="p-3">
                  {w.profileImage ? (
                    <img src={w.profileImage} alt={w.fullName} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-xs text-slate-500">N/A</div>
                  )}
                </td>
                <td className="p-3 font-semibold uppercase">{w.workerId}</td>
                <td className="p-3">{w.fullName}</td>
                <td className="p-3 capitalize">{w.role}</td>
                <td className="p-3 text-right space-x-2">
                  {w.profileImage && (
                    <button onClick={() => handleRemovePhoto(w.workerId)} className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded border border-amber-200">
                      Clear Photo
                    </button>
                  )}
                  <button onClick={() => handleDeleteWorker(w.workerId)} className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded border border-red-200">
                    Delete Worker
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}