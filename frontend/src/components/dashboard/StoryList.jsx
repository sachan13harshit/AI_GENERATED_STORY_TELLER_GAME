import React from 'react';
import Button from '../common/Button';

const StoryCard = ({ story, onSelect }) => {
  const date = new Date(story.createdAt).toLocaleDateString();
  
  return (
    <div 
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onSelect(story.id)}
    >
      <h3 className="text-xl font-semibold mb-2 text-indigo-700">{story.title}</h3>
      <p className="text-gray-600 mb-4 line-clamp-3">{story.preview}</p>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>Created: {date}</span>
        <span>{story.segmentCount} segments</span>
      </div>
    </div>
  );
};

const StoryList = ({ stories = [], loading, onStorySelect, onCreateStory }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-center">
          <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your stories...</p>
        </div>
      </div>
    );
  }

  // No stories found
  if (stories.length === 0) {
    return (
      <div className="bg-gray-50 p-8 rounded-lg text-center">
        <h2 className="text-2xl font-medium text-gray-700 mb-4">
          No stories yet
        </h2>
        <p className="text-gray-600 mb-6">
          You haven't created any stories yet. Start your first adventure now!
        </p>
        <Button 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3"
          onClick={onCreateStory}
        >
          Create Your First Story
        </Button>
      </div>
    );
  }

  // Display story grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {stories.map((story) => (
        <StoryCard
          key={story.id}
          story={story}
          onSelect={onStorySelect}
        />
      ))}
    </div>
  );
};

export default StoryList;