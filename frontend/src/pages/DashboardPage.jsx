import React, { useContext, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StoryContext } from '../context/StoryContext';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/common/Button';

const StoryCard = ({ story, onSelect }) => {
  const date = new Date(story.createdAt).toLocaleDateString();
  
  return (
    <div 
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onSelect(story._id)}
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

const DashboardPage = () => {
  const navigate = useNavigate();
  const { userStories, loadUserStories, loading, error } = useContext(StoryContext);
  const { user } = useContext(AuthContext);

  // Fetch stories only once when component mounts
  useEffect(() => {
    const fetchStories = async () => {
      try {
        await loadUserStories();
      } catch (err) {
        console.error('Failed to load stories:', err);
      }
    };
    fetchStories();
  }, []); // Empty dependency array means it only runs once on mount

  const handleStorySelect = useCallback((storyId) => {
    navigate(`/story/${storyId}`);
  }, [navigate]);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Your Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {user?.name || 'Storyteller'}! Continue your adventures or start a new one.
          </p>
        </div>
        
        <Link to="/story">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3">
            Create New Story
          </Button>
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-md text-red-700 mb-6">
          <h3 className="font-semibold mb-2">Error</h3>
          <p>{error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <div className="spinner mb-4">Loading...</div>
            <p className="text-gray-600">Loading your stories...</p>
          </div>
        </div>
      ) : (
        <>
          {!userStories || userStories.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <h2 className="text-2xl font-medium text-gray-700 mb-4">
                No stories yet
              </h2>
              <p className="text-gray-600 mb-6">
                You haven't created any stories yet. Start your first adventure now!
              </p>
              <Link to="/story">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3">
                  Create Your First Story
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userStories.map((story, index) => (
                <StoryCard
                  key={story._id || `story-${index}`}
                  story={story}
                  onSelect={handleStorySelect}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardPage;