import React, { useState } from 'react';
import Button from '../common/Button';

const StorySaveShare = ({ onSave, onShare, onDownload, loading }) => {
  const [shareLink, setShareLink] = useState('');
  const [showShareLink, setShowShareLink] = useState(false);

  const handleShare = async () => {
    const link = await onShare();
    if (link) {
      setShareLink(link);
      setShowShareLink(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    // Could add toast notification here
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        Save or Share Your Story
      </h3>
      
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={onSave}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2"
          disabled={loading}
        >
          Save Story
        </Button>
        
        <Button
          onClick={handleShare}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2"
          disabled={loading}
        >
          Share Story
        </Button>
        
        <Button
          onClick={onDownload}
          className="bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-4 py-2"
          disabled={loading}
        >
          Download as Text
        </Button>
      </div>
      
      {showShareLink && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <div className="flex items-center">
            <input
              type="text"
              value={shareLink}
              readOnly
              className="flex-grow p-2 border border-gray-300 rounded-md mr-2"
            />
            <Button
              onClick={copyToClipboard}
              className="bg-gray-200 hover:bg-gray-300 px-3 py-2"
            >
              Copy
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorySaveShare;