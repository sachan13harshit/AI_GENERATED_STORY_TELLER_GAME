import React from 'react';

const StoryDisplay = ({ segment, storyTitle }) => {
  if (!segment) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      {storyTitle && (
        <h2 className="text-2xl font-semibold mb-4 text-indigo-700">
          {storyTitle}
        </h2>
      )}
      
      <div className="prose max-w-none">
        <p className="text-gray-800 whitespace-pre-line">{segment.content}</p>
      </div>
    </div>
  );
};

export default StoryDisplay;