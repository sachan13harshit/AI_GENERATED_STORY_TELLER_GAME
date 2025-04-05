import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { StoryContext } from '../../context/StoryContext';
import StoryList from './StoryList';
import Button from '../common/Button';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { userStories, loading, error } = useContext(StoryContext);

  const handleCreateStory = () => {
    navigate('/story');
  };

  const handleStorySelect = (storyId) => {
    navigate(`/story/${storyId}`);
  };

  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Your Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {user?.name || 'Storyteller'}! Continue your adventures or start a new one.
          </p>
        </div>
        
        <Button 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3"
          onClick={handleCreateStory}
        >
          Create New Story
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-md text-red-700 mb-6">
          <h3 className="font-semibold mb-2">Error</h3>
          <p>{error}</p>
        </div>
      )}
      
      <StoryList 
        stories={userStories} 
        loading={loading} 
        onStorySelect={handleStorySelect} 
        onCreateStory={handleCreateStory}
      />
    </div>
  );
};

export default Dashboard;