import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// Add this import at the top of your component file:
import API from '../services/api'; // Adjust the path to match where your api.js is saved

// Updated handleSubmit function:
const handleSubmit = async () => {
  if (!photoBase64) return alert('Please capture a photo first');
  setUploading(true);
  
  try {
    // Automatically routes to Render in production or localhost in dev
    await API.post('/attendance', {
      workerId: user?.workerId || user?.name,
      photo: photoBase64,
      location: location ? `${location.lat}, ${location.lng}` : 'Location unavailable',
      timestamp: new Date().toISOString()
    });

    alert('Attendance recorded successfully!');
    setPhotoBase64(null); // Reset preview
  } catch (error) {
    console.error('Attendance submit error:', error);
    // Displays exact error response from backend if present (helps debug 400 Bad Requests)
    const serverErrorMessage = error.response?.data?.error || 'Failed to submit attendance';
    alert(serverErrorMessage);
  } finally {
    setUploading(false);
  }
};
export default function Attendance({ user, setUser }) {
  const [location, setLocation] = useState(null);
  const [photoBase64, setPhotoBase64] = useState(null);
  const [uploading, setUploading] = useState(false);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        (error) => alert("Please enable GPS location services to mark attendance.")
      );
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  const handlePhotoCapture = (e) => {
    const file = e.target.files[0];
    if (!file || !location) {
      alert("Ensure GPS location is enabled before taking a photo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const timestamp = new Date().toLocaleString();
        const geoText = `Lat: ${location.lat.toFixed(5)}, Lng: ${location.lng.toFixed(5)}`;
        const watermarkText = `SHREE CEMENT | ${timestamp} | ${geoText}`;
        
        ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
        ctx.fillRect(0, canvas.height - 90, canvas.width, 90);
        
        ctx.font = `bold ${Math.max(16, Math.floor(canvas.width * 0.035))}px sans-serif`;
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(watermarkText, canvas.width / 2, canvas.height - 35);
        
        // Export as Base64 string directly for JSON backend transport
        const base64Data = canvas.toDataURL('image/jpeg', 0.85);
        setPhotoBase64(base64Data);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Updated handleSubmit function:
const handleSubmit = async () => {
  if (!photoBase64) return alert('Please capture a photo first');
  setUploading(true);
  
  try {
    // Automatically routes to Render in production or localhost in dev
    await API.post('/attendance', {
      workerId: user?.workerId || user?.name,
      photo: photoBase64,
      location: location ? `${location.lat}, ${location.lng}` : 'Location unavailable',
      timestamp: new Date().toISOString()
    });

    alert('Attendance recorded successfully!');
    setPhotoBase64(null); // Reset preview
  } catch (error) {
    console.error('Attendance submit error:', error);
    // Displays exact error response from backend if present (helps debug 400 Bad Requests)
    const serverErrorMessage = error.response?.data?.error || 'Failed to submit attendance';
    alert(serverErrorMessage);
  } finally {
    setUploading(false);
  }
};
  return (
    <div className="relative min-h-screen w-full bg-slate-900 flex items-center justify-center p-4 overflow-hidden select-none">
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06]">
        <img src="/shreelogo.png" alt="Shree Cement Watermark" className="w-72 sm:w-96 max-w-full h-auto object-contain" />
      </div>

      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-slate-100">
        
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <img src="/shreelogo.png" alt="Shree Cement Logo" className="h-9 w-auto object-contain" />
            <div>
              <h2 className="text-sm font-bold text-slate-800 leading-tight">{user.name}</h2>
              {!location ? (
                <p className="text-red-500 text-[11px] font-semibold animate-pulse mt-0.5">Acquiring GPS...</p>
              ) : (
                <p className="text-emerald-600 text-[11px] font-semibold mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                  GPS Active ✓
                </p>
              )}
            </div>
          </div>
          <button onClick={handleLogout} className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition">
            Logout
          </button>
        </div>

        <canvas ref={canvasRef} className="hidden"></canvas>

        <div className="mb-5">
          <label className="flex flex-col items-center justify-center w-full py-5 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white rounded-xl cursor-pointer transition shadow-md">
            <span className="text-2xl mb-1">📷</span>
            <span className="text-sm font-bold tracking-wide">Take Verification Selfie</span>
            <input type="file" accept="image/*" capture="user" onChange={handlePhotoCapture} className="hidden" />
          </label>
        </div>

        {photoBase64 && (
          <div className="mb-5 rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-slate-900">
            <img src={photoBase64} alt="Attendance Preview" className="w-full h-auto object-cover max-h-72" />
          </div>
        )}

        <button 
          onClick={handleSubmit} 
          disabled={uploading || !photoBase64}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white py-3.5 rounded-xl font-bold transition shadow-lg shadow-emerald-600/20 text-sm tracking-wide"
        >
          {uploading ? 'Uploading Record...' : 'Submit Attendance'}
        </button>
      </div>
    </div>
  );
}