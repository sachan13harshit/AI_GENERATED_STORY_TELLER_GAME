import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStory } from '../context/StoryContext';
import StoryContent from '../components/story/StoryContent';
import StoryChoices from '../components/story/StoryChoices';
import StoryPrompt from '../components/story/StoryPrompt';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const StoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentStory, loadStory, startNewStory, chooseOption, loading, error } = useStory();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [storyStarted, setStoryStarted] = useState(false);

  const loadExistingStory = useCallback(async () => {
    try {
      if (id && isInitialLoad) {
        const story = await loadStory(id);
        if (!story) {
          throw new Error('Failed to load story');
        }
        setStoryStarted(true);
        setIsInitialLoad(false);
      }
    } catch (err) {
      console.error('Error loading story:', err);
      navigate('/dashboard');
    }
  }, [id, loadStory, navigate, isInitialLoad]);

  const handlePromptSubmit = async (prompt) => {
    try {
      const result = await startNewStory(prompt);
      if (result) {
        setStoryStarted(true);
        navigate(`/story/${result._id}`);
      }
    } catch (err) {
      console.error('Failed to start story:', err);
    }
  };

  const handleChoiceSelect = async (choice) => {
    try {
      await chooseOption(choice);
    } catch (err) {
      console.error('Error selecting choice:', err);
    }
  };

  const handleDownloadStory = () => {
    if (!currentStory) return;

    const storyText = currentStory.segments
      .map((segment, index) => {
        const segmentNumber = index + 1;
        return `Chapter ${segmentNumber}:\n${segment.content}\n\n`;
      })
      .join('\n');

    const blob = new Blob([storyText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentStory.title || 'story'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (id) {
      loadExistingStory();
    }
  }, [id, loadExistingStory]);

  if (loading && isInitialLoad) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message={error} />
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!id || !storyStarted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Create a New Story</h1>
        <StoryPrompt onSubmit={handlePromptSubmit} loading={loading} />
      </div>
    );
  }

  if (!currentStory) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message="Story not found" />
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {currentStory.genre && (
            <div className="mb-4">
              <span className="inline-block bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
                {currentStory.genre}
              </span>
            </div>
          )}
          
          <h1 className="text-4xl font-bold mb-8 text-gray-900">{currentStory.title}</h1>
          
          <div className="prose prose-lg max-w-none mb-8">
            <StoryContent content={currentStory.segments[currentStory.currentSegmentIndex]?.content} />
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">What happens next?</h2>
            <div className="mb-8">
              <StoryChoices 
                choices={currentStory.segments[currentStory.currentSegmentIndex]?.choices || []}
                onChoiceSelect={handleChoiceSelect}
              />
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleDownloadStory}
              className="inline-flex items-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Download Story
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StoryPage;