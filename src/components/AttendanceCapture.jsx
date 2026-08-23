import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';

const AttendanceCapture = () => {
  const webcamRef = useRef(null);
  const [workerId, setWorkerId] = useState('');
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  // 1. Capture Photo from Webcam (Returns Base64 String)
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setPhoto(imageSrc);
    fetchLocation(); // Automatically fetch location when photo is taken
  }, [webcamRef]);

  // 2. Fetch GPS Location
  const fetchLocation = () => {
    if (!navigator.geolocation) {
      setLocation('Geolocation not supported by browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Format: "Lat: 27.845, Lng: 75.267"
        setLocation(`Lat: ${position.coords.latitude.toFixed(5)}, Lng: ${position.coords.longitude.toFixed(5)}`);
      },
      (error) => {
        console.error('GPS Error:', error);
        setLocation('Location Access Denied');
      },
      { enableHighAccuracy: true }
    );
  };

  // 3. Retake Photo
  const retakePhoto = () => {
    setPhoto(null);
    setLocation('');
    setStatus('idle');
  };

  // 4. Submit to Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!workerId || !photo || !location) {
      setMessage('Please provide Worker ID, capture a photo, and allow location access.');
      setStatus('error');
      return;
    }

    setStatus('loading');

    try {
      // Send request to the Express backend you configured
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workerId,
          photo,
          location
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Attendance recorded successfully!');
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to submit attendance.');
      }
    } catch (error) {
      console.error('Submission Error:', error);
      setStatus('error');
      setMessage('Server connection failed.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Worker Check-In</h2>

      {status === 'success' ? (
        <div className="text-center">
          <div className="text-green-600 font-semibold mb-4">{message}</div>
          <button 
            onClick={retakePhoto}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Check In Another Worker
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Worker ID Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Worker ID</label>
            <input
              type="text"
              required
              placeholder="e.g. EMP-101"
              value={workerId}
              onChange={(e) => setWorkerId(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Camera / Photo Preview Container */}
          <div className="relative rounded-lg overflow-hidden border bg-gray-100 aspect-video flex items-center justify-center">
            {!photo ? (
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover"
                videoConstraints={{ facingMode: "user" }} // Uses front camera on mobile
              />
            ) : (
              <img src={photo} alt="Captured Selfie" className="w-full h-full object-cover" />
            )}
          </div>

          {/* Controls & GPS Status */}
          <div className="flex justify-between items-center text-sm">
            {!photo ? (
              <button 
                type="button" 
                onClick={capture} 
                className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 w-full"
              >
                Capture Selfie
              </button>
            ) : (
              <button 
                type="button" 
                onClick={retakePhoto} 
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Retake Photo
              </button>
            )}
          </div>

          {/* Location Display */}
          {location && (
            <div className="text-xs text-gray-500 text-center font-mono bg-gray-50 py-1 rounded">
              GPS: {location}
            </div>
          )}

          {/* Error Message */}
          {status === 'error' && (
            <div className="text-red-500 text-sm text-center font-medium">{message}</div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!photo || !location || !workerId || status === 'loading'}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
          >
            {status === 'loading' ? 'Uploading & Watermarking...' : 'Submit Attendance'}
          </button>
        </form>
      )}
    </div>
  );
};

export default AttendanceCapture;