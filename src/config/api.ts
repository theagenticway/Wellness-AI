// src/config/api.ts
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  ENDPOINTS: {
    WELLNESS: {
      TIPS: '/wellness',
      DAILY_PLAN: '/api/wellness/daily-plan',
      NUTRITION_PLAN: '/api/wellness/nutrition-plan',
      EXERCISE_PLAN: '/api/wellness/exercise-plan',
      CBT_PLAN: '/api/wellness/cbt-plan',
      MINDFULNESS_PLAN: '/api/wellness/mindfulness-plan',
      PROGRESS: '/api/wellness/assess-progress',
      PHASE_TRANSITION: '/api/wellness/phase-transition'
    },
    HEALTH: '/health',
    TEST_AI: '/test-ai'
  }
};

// API utility functions
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};

// Specific API functions for wellness
export const wellnessAPI = {
  getDailyPlan: async (userProfile: any, healthMetrics: any) => {
    return apiCall(API_CONFIG.ENDPOINTS.WELLNESS.DAILY_PLAN, {
      method: 'POST',
      body: JSON.stringify({
        userProfile,
        healthMetrics
      })
    });
  },

  getNutritionPlan: async (userProfile: any, dietaryPreferences: string[] = []) => {
    return apiCall(API_CONFIG.ENDPOINTS.WELLNESS.NUTRITION_PLAN, {
      method: 'POST',
      body: JSON.stringify({
        userProfile,
        dietaryPreferences
      })
    });
  },

  getExercisePlan: async (userProfile: any) => {
    return apiCall(API_CONFIG.ENDPOINTS.WELLNESS.EXERCISE_PLAN, {
      method: 'POST',
      body: JSON.stringify({
        userProfile
      })
    });
  },

  getCBPlan: async (userProfile: any) => {
    return apiCall(API_CONFIG.ENDPOINTS.WELLNESS.CBT_PLAN, {
      method: 'POST',
      body: JSON.stringify({
        userProfile
      })
    });
  },

  getMindfulnessPlan: async (userProfile: any) => {
    return apiCall(API_CONFIG.ENDPOINTS.WELLNESS.MINDFULNESS_PLAN, {
      method: 'POST',
      body: JSON.stringify({
        userProfile
      })
    });
  },

  assessProgress: async (userProfile: any, recentActivities: any[], healthMetrics: any) => {
    return apiCall(API_CONFIG.ENDPOINTS.WELLNESS.PROGRESS, {
      method: 'POST',
      body: JSON.stringify({
        userProfile,
        recentActivities,
        healthMetrics
      })
    });
  },

  testAI: async () => {
    return apiCall(API_CONFIG.ENDPOINTS.TEST_AI, {
      method: 'POST'
    });
  },

  checkHealth: async () => {
    return apiCall(API_CONFIG.ENDPOINTS.HEALTH);
  }
};
