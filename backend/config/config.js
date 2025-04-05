module.exports = {
    // JWT configuration
    jwt: {
      secret: process.env.JWT_SECRET || 'your-secret-key',
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    },
    
    // AI service configuration
    ai: {
      model: process.env.AI_MODEL || 'gpt-3.5-turbo',
      apiKey: process.env.OPENAI_API_KEY
    },

    // MongoDB configuration
    mongodb: {
      uri: process.env.MONGO_URI
    }
  };