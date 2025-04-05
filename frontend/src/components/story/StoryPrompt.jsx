// StoryPrompt.jsx
import React, { useState } from 'react';
import Button from '../common/Button';

const StoryPrompt = ({ onSubmit, loading }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Start Your Story
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="prompt" className="block text-gray-700 mb-2">
            Enter a prompt to begin your story:
          </label>
          <textarea
            id="prompt"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows="3"
            placeholder="e.g., A dragon in a futuristic city..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
          ></textarea>
        </div>
        <Button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Story'}
        </Button>
      </form>
    </div>
  );
};

export default StoryPrompt;