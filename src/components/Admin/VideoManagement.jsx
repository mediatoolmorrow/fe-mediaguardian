import React, { useState, useEffect } from 'react';

export default function VideoManagement({ videoUrl, onSave, loading, error, successMessage }) {
  const [tempUrl, setTempUrl] = useState(videoUrl);

  useEffect(() => {
    setTempUrl(videoUrl);
  }, [videoUrl]);

  const handleSave = () => {
    onSave(tempUrl);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Tutorial Video URL</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL</label>
            <input
              type="text"
              value={tempUrl}
              onChange={(e) => setTempUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Accepts: youtube.com/watch?v=, youtube.com/embed/, or youtu.be/ URLs
            </p>
          </div>
          
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-100 text-red-800 rounded-lg">
              <span className="text-sm">{error}</span>
            </div>
          )}
          
          {successMessage && (
            <div className="p-3 bg-green-100 text-green-800 rounded-lg">
              {successMessage}
            </div>
          )}
          
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

    </div>
  );
}