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
      <h2 className="text-xl font-semibold mb-4">What happens next?</h2>
      <div className="grid gap-4">
        {choices.map((choice, index) => (
          <button
            key={index}
            onClick={() => handleChoiceClick(choice, index)}
            disabled={loadingChoice !== null}
            className={`p-4 border rounded-lg transition-colors relative
              ${loadingChoice === index 
                ? 'border-blue-500 bg-blue-50 cursor-wait' 
                : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'}`}
          >
            {loadingChoice === index ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                <span>Loading...</span>
              </div>
            ) : (
              choice
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StoryChoices;