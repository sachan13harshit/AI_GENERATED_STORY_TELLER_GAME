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
      // Only attempt to load if we have a valid ID and it's the initial load
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

  // If we're creating a new story (no id) or haven't started the story yet
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{currentStory.title}</h1>
      <StoryContent content={currentStory.segments[currentStory.currentSegmentIndex]?.content} />
      <StoryChoices 
        choices={currentStory.segments[currentStory.currentSegmentIndex]?.choices || []}
        onChoiceSelect={handleChoiceSelect}
      />
    </div>
  );
};

export default StoryPage;