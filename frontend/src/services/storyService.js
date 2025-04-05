import api from './api';

export const generateStory = async (prompt) => {
  try {
    const response = await api.post('/stories/generate', { prompt });
    return response.data;
  } catch (error) {
    console.error('Error generating story:', error);
    throw error;
  }
};

export const continueStory = async (storyId, choice) => {
  try {
    const response = await api.post(`/stories/${storyId}/continue`, { choice });
    return response.data;
  } catch (error) {
    console.error('Error continuing story:', error);
    throw error;
  }
};

export const getUserStories = async () => {
  try {
    const response = await api.get('/stories');
    return response.data;
  } catch (error) {
    console.error('Error fetching user stories:', error);
    throw error;
  }
};

export const getStoryById = async (id) => {
  try {
    // Validate ID before making the request
    if (!id || typeof id !== 'string' || id.trim() === '' || 
        id === 'undefined' || id === 'null') {
      throw new Error('Invalid story ID');
    }

    const response = await api.get(`/stories/${id}`);

    if (!response.data || !response.data.success) {
      throw new Error('Invalid response from server');
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching story:', error);
    throw error;
  }
};

export const saveStory = async (storyData) => {
  try {
    const response = await api.put(`/stories/${storyData._id}`, storyData);
    return response.data;
  } catch (error) {
    console.error('Error saving story:', error);
    throw error;
  }
};

export const shareStory = async (storyId) => {
  try {
    const response = await api.post(`/stories/${storyId}/share`);
    return response.data;
  } catch (error) {
    console.error('Error sharing story:', error);
    throw error;
  }
};