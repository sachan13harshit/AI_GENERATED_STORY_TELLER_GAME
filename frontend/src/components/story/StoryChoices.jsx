import React, { useState } from 'react';

const StoryChoices = ({ choices, onChoiceSelect }) => {
  const [loadingChoice, setLoadingChoice] = useState(null);

  if (!choices || choices.length === 0) return null;

  const handleChoiceClick = async (choice, index) => {
    setLoadingChoice(index);
    try {
      await onChoiceSelect(choice);
    } finally {
      setLoadingChoice(null);
    }
  };

  return (
    <div className="space-y-4">
      {choices.map((choice, index) => (
        <button
          key={index}
          onClick={() => handleChoiceClick(choice, index)}
          disabled={loadingChoice !== null}
          className={`w-full p-4 border rounded-lg text-left transition-colors relative
            ${loadingChoice === index 
              ? 'border-blue-500 bg-blue-50 cursor-wait' 
              : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'}`}
        >
          {loadingChoice === index ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500 mr-2"></div>
              <span>Loading...</span>
            </div>
          ) : (
            <span>{index + 1}. {choice}</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default StoryChoices;