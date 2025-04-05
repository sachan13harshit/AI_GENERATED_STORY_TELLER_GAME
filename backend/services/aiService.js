// services/aiService.js
const OpenAI = require('openai');
const config = require('../config/config');

// Initialize OpenAI Client
const openai = new OpenAI({
  apiKey: config.ai.apiKey,
});

/**
 * Generate the start of a story based on a prompt
 * @param {string} prompt - User's initial story prompt
 * @returns {Object} Story data including title, content and choices
 */
exports.generateStoryStart = async (prompt) => {
  try {
    const systemPrompt = `
      You are an AI storyteller that creates engaging short stories.
      
      Generate a short story beginning based on the user's prompt.
      
      Your story should be engaging, descriptive, and set the scene for an adventure.
      Keep it under 200 words.
      
      At the end, generate exactly 3 possible choices for how the story could continue.
      Make the choices interesting and divergent to give the story different possible paths.
      
      Your response should be in JSON format with these fields:
      - title: A catchy title for the story
      - content: The story text
      - choices: An array of 3 choices to continue the story
    `;

    const response = await openai.chat.completions.create({
      model: config.ai.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    // Parse the JSON response
    const responseText = response.choices[0].message.content;
    let storyData;
    
    try {
      storyData = JSON.parse(responseText);
    } catch (error) {
      // Fallback in case the AI doesn't return valid JSON
      console.error('Failed to parse AI response as JSON:', error);
      
      // Try to extract the data using regex
      const titleMatch = responseText.match(/title["']?:\s*["']([^"']+)["']/);
      const contentMatch = responseText.match(/content["']?:\s*["']([^"']+)["']/);
      const choicesMatch = responseText.match(/choices["']?:\s*\[(.*?)\]/s);
      
      storyData = {
        title: titleMatch ? titleMatch[1] : 'Untitled Story',
        content: contentMatch ? contentMatch[1] : responseText,
        choices: choicesMatch 
          ? choicesMatch[1].split(',').map(choice => 
              choice.replace(/["']/g, '').trim()
            )
          : ['Continue the adventure', 'Take a different path', 'End the story']
      };
    }

    return {
      title: storyData.title || 'Untitled Story',
      content: storyData.content || 'Once upon a time...',
      choices: storyData.choices || ['Continue the adventure', 'Take a different path', 'End the story']
    };
  } catch (error) {
    console.error('Error generating story start:', error);
    throw new Error('Failed to generate story. Please try again.');
  }
};

/**
 * Continue a story based on a previous segment and chosen path
 * @param {string} previousContent - Previous story segment content
 * @param {string} choice - The choice made by the user
 * @returns {Object} Continuation data including content and new choices
 */
exports.continueStory = async (previousContent, choice) => {
  try {
    const systemPrompt = `
      You are an AI storyteller that continues an ongoing story.
      
      The user will provide the previous part of the story and the choice they made.
      
      Continue the story based on their choice. Make it engaging and descriptive.
      Keep it under 400 words.
      
      At the end, generate exactly 3 possible choices for how the story could continue,
      unless it's a logical endpoint to the story, then you can provide fewer choices
      or end the story.
      
      Your response should be in JSON format with these fields:
      - content: The continuation text
      - choices: An array of choices to continue the story (or an empty array if the story ends)
    `;

    const response = await openai.chat.completions.create({
      model: config.ai.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Previous story: ${previousContent}\n\nChosen path: ${choice}` }
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    // Parse the JSON response
    const responseText = response.choices[0].message.content;
    let continuationData;
    
    try {
      continuationData = JSON.parse(responseText);
    } catch (error) {
      // Fallback in case the AI doesn't return valid JSON
      console.error('Failed to parse AI response as JSON:', error);
      
      // Try to extract the data using regex
      const contentMatch = responseText.match(/content["']?:\s*["']([^"']+)["']/);
      const choicesMatch = responseText.match(/choices["']?:\s*\[(.*?)\]/s);
      
      continuationData = {
        content: contentMatch ? contentMatch[1] : responseText,
        choices: choicesMatch 
          ? choicesMatch[1].split(',').map(choice => 
              choice.replace(/["']/g, '').trim()
            )
          : ['Continue the adventure', 'Take a different path', 'End the story']
      };
    }

    return {
      content: continuationData.content || 'The story continues...',
      choices: continuationData.choices || ['Continue the adventure', 'Take a different path', 'End the story']
    };
  } catch (error) {
    console.error('Error continuing story:', error);
    throw new Error('Failed to continue story. Please try again.');
  }
};