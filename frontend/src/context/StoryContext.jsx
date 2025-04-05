import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
  generateStory, 
  continueStory, 
  getUserStories, 
  getStoryById, 
  saveStory,
  shareStory
} from '../services/storyService';

export const StoryContext = createContext();

// Create a custom hook for using the story context
export const useStory = () => {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error('useStory must be used within a StoryProvider');
  }
  return context;
};

export const StoryProvider = ({ children }) => {
  const [currentStory, setCurrentStory] = useState(null);
  const [storyHistory, setStoryHistory] = useState([]);
  const [userStories, setUserStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const startNewStory = async (prompt) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await generateStory(prompt);
      
      if (!response || !response.success) {
        throw new Error('Failed to generate story: Invalid response');
      }

      const storyData = response;
      
      const newStory = {
        _id: storyData.id,
        title: storyData.title || 'Untitled Story',
        initialPrompt: prompt,
        preview: storyData.content?.substring(0, 150) + '...' || '',
        segments: [{
          content: storyData.content || '',
          prompt: prompt,
          choices: Array.isArray(storyData.choices) ? storyData.choices : [],
          sequence: 1
        }],
        currentSegmentIndex: 0,
        segmentCount: 1
      };
      
      setCurrentStory(newStory);
      setStoryHistory(newStory.segments);
      setLoading(false);
      return newStory;
    } catch (err) {
      console.error('Error starting new story:', err);
      setError(err.message || 'Failed to generate story');
      setLoading(false);
      return null;
    }
  };

  const chooseOption = async (choice) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!currentStory || !currentStory._id) {
        throw new Error('No active story');
      }
      
      const response = await continueStory(currentStory._id, choice);
      
      if (!response || !response.success) {
        throw new Error('Failed to continue story: Invalid response');
      }

      const continuation = response;
      
      const updatedHistory = [...storyHistory, {
        content: continuation.content || '',
        prompt: choice,
        choiceMade: choice,
        choices: Array.isArray(continuation.choices) ? continuation.choices : [],
        sequence: storyHistory.length + 1
      }];

      setStoryHistory(updatedHistory);
      
      setCurrentStory({
        ...currentStory,
        segments: updatedHistory,
        currentSegmentIndex: updatedHistory.length - 1,
        segmentCount: updatedHistory.length
      });
      
      setLoading(false);
      return continuation;
    } catch (err) {
      console.error('Error continuing story:', err);
      setError(err.message || 'Failed to continue story');
      setLoading(false);
      return null;
    }
  };

  const loadUserStories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const stories = await getUserStories();
      setUserStories(Array.isArray(stories) ? stories : []);
      
      setLoading(false);
      return stories;
    } catch (err) {
      console.error('Error loading stories:', err);
      setError(err.message || 'Failed to load stories');
      setUserStories([]);
      setLoading(false);
      return [];
    }
  };

  const loadStory = async (storyId) => {
    try {
      // Validate story ID
      if (!storyId || typeof storyId !== 'string' || storyId.trim() === '' || 
          storyId === 'undefined' || storyId === 'null') {
        throw new Error('Invalid story ID');
      }

      setLoading(true);
      setError(null);
      
      const storyData = await getStoryById(storyId);
      
      if (!storyData || !storyData.success) {
        throw new Error('Failed to load story: Invalid response from server');
      }

      // Backend returns { success: true, id, title, initialPrompt, segments }
      const story = {
        _id: storyData.id,
        title: storyData.title || 'Untitled Story',
        initialPrompt: storyData.initialPrompt,
        preview: storyData.segments[0]?.content?.substring(0, 150) + '...' || '',
        segments: storyData.segments.map(segment => ({
          content: segment.content || '',
          prompt: segment.prompt || '',
          choices: Array.isArray(segment.choices) ? segment.choices : []
        })),
        currentSegmentIndex: storyData.segments.length - 1,
        segmentCount: storyData.segments.length,
        createdAt: storyData.createdAt,
        updatedAt: storyData.updatedAt
      };

      setCurrentStory(story);
      setStoryHistory(story.segments);
      
      setLoading(false);
      return story;
    } catch (err) {
      console.error('Error loading story:', err);
      setError(err.message || 'Failed to load story');
      setCurrentStory(null);
      setStoryHistory([]);
      setLoading(false);
      throw err; // Re-throw to allow handling in components
    }
  };

  const handleSaveStory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!currentStory) {
        throw new Error('No story to save');
      }

      // Prepare story data for saving
      const storyToSave = {
        _id: currentStory._id,
        title: currentStory.title || 'Untitled Story',
        initialPrompt: currentStory.initialPrompt,
        preview: currentStory.segments[0]?.content?.substring(0, 150) + '...' || '',
        segments: currentStory.segments.map((segment, index) => ({
          content: segment.content || '',
          prompt: segment.prompt || (index === 0 ? currentStory.initialPrompt : segment.choiceMade) || 'Initial prompt',
          choices: Array.isArray(segment.choices) ? segment.choices : [],
          sequence: index + 1
        }))
      };
      
      const savedStory = await saveStory(storyToSave);
      
      if (!savedStory || !savedStory.success) {
        throw new Error('Failed to save story: Invalid response from server');
      }

      // The backend returns { success: true, data: { id, title, ... } }
      const storyData = savedStory.data;

      // Update current story with the saved version
      const updatedStory = {
        ...currentStory,
        _id: storyData._id || storyData.id, // Handle both _id and id
        title: storyData.title,
        preview: storyData.preview,
        initialPrompt: storyData.initialPrompt || currentStory.initialPrompt,
        segmentCount: storyData.segmentCount || currentStory.segments.length,
        segments: storyData.segments || currentStory.segments,
        updatedAt: storyData.updatedAt || new Date().toISOString()
      };

      setCurrentStory(updatedStory);
      
      // Update user stories list
      const storyForList = {
        _id: updatedStory._id,
        title: updatedStory.title,
        preview: updatedStory.preview,
        segmentCount: updatedStory.segmentCount,
        createdAt: updatedStory.createdAt || storyData.createdAt,
        updatedAt: updatedStory.updatedAt
      };

      if (!userStories.find(s => s._id === updatedStory._id)) {
        setUserStories(prevStories => [...prevStories, storyForList]);
      } else {
        setUserStories(prevStories => 
          prevStories.map(s => s._id === updatedStory._id ? storyForList : s)
        );
      }
      
      setLoading(false);
      return updatedStory;
    } catch (err) {
      console.error('Error saving story:', err);
      setError(err.message || 'Failed to save story');
      setLoading(false);
      return null;
    }
  };

  const handleShareStory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const shareUrl = await shareStory(currentStory.id);
      
      setLoading(false);
      return shareUrl;
    } catch (err) {
      setError(err.message || 'Failed to share story');
      setLoading(false);
      return null;
    }
  };

  return (
    <StoryContext.Provider
      value={{
        currentStory,
        storyHistory,
        userStories,
        loading,
        error,
        startNewStory,
        chooseOption,
        loadUserStories,
        loadStory,
        saveStory: handleSaveStory,
        shareStory: handleShareStory
      }}
    >
      {children}
    </StoryContext.Provider>
  );
};