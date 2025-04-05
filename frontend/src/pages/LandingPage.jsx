import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-5xl font-bold mb-6 text-indigo-700">
          AI Storyteller
        </h1>
        <p className="text-xl mb-8 text-gray-700">
          Create interactive stories with AI. Your imagination is the only limit.
        </p>
        
        <div className="bg-white p-8 rounded-lg shadow-lg mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center p-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-indigo-600">1</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Enter a Prompt</h3>
              <p className="text-gray-600 text-center">
                Start your story with a simple prompt like "A dragon in a futuristic city"
              </p>
            </div>
            
            <div className="flex flex-col items-center p-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-indigo-600">2</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Choose Your Path</h3>
              <p className="text-gray-600 text-center">
                Select from different options to guide your story in new directions
              </p>
            </div>
            
            <div className="flex flex-col items-center p-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-indigo-600">3</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Save & Share</h3>
              <p className="text-gray-600 text-center">
                Save your unique stories or share them with friends
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3">
              Get Started
            </Button>
          </Link>
          <Link to="/login">
            <Button className="bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-8 py-3">
              Login
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="mt-20 w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Featured Stories
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Featured story cards would go here */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">The Dragon's Metropolis</h3>
            <p className="text-gray-600 mb-4">
              A tale of a dragon adapting to life in a futuristic city filled with robots and AI...
            </p>
            <div className="text-sm text-gray-500">Created by StoryLover42</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Pirate's Last Voyage</h3>
            <p className="text-gray-600 mb-4">
              The final adventure of Captain Blackbeard as he searches for the legendary treasure...
            </p>
            <div className="text-sm text-gray-500">Created by AdventureSeeker</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;