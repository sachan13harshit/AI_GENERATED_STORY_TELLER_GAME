import React from 'react';

const StoryContent = ({ content }) => {
  if (!content) return null;

  return (
    <div className="prose prose-lg max-w-none mb-8">
      <p className="whitespace-pre-wrap">{content}</p>
    </div>
  );
};

export default StoryContent; 