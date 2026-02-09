const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Token expiration event handling
let onTokenExpiredCallback = null;

export const setTokenExpiredCallback = (callback) => {
  onTokenExpiredCallback = callback;
};

const handleResponse = async (response) => {
  if (response.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('backend_token');
    if (onTokenExpiredCallback) {
      onTokenExpiredCallback();
    }
    throw new Error('Session expired. Please login again.');
  }
  return response;
};

export const api = {
  /* Auth */
  async syncFirebaseUser(firebaseUser, provider) {
    const idToken = await firebaseUser.getIdToken();

    const response = await fetch(`${API_BASE_URL}/api/auth/firebase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify({
        email: firebaseUser.email,
        providerId: firebaseUser.uid,
        provider: provider,
        username: firebaseUser.displayName,
        avatar: firebaseUser.photoURL
      })
    });

    await handleResponse(response);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to sync user');
    }

    return response.json();
  },

  async syncLineUser(lineProfile, accessToken) {
    const response = await fetch(`${API_BASE_URL}/api/auth/line`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        accessToken: accessToken,
        userId: lineProfile.userId,
        displayName: lineProfile.displayName,
        pictureUrl: lineProfile.pictureUrl,
        email: lineProfile.email || null
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to sync LINE user');
    }

    return response.json();
  },

  async registerWithEmail(email, password) {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  },

  async loginWithEmail(email, password) {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  },

  async getCurrentUser(token) {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    await handleResponse(response);

    if (!response.ok) {
      throw new Error('Failed to get user');
    }

    return response.json();
  },

  async logout(token) {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.ok;
  },

  /* Admin Management (Super Admin only) */
  async getAdminMe(token) {
    const response = await fetch(`${API_BASE_URL}/api/admin/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    await handleResponse(response);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get admin info');
    }

    return response.json();
  },

  async getAdminList(token) {
    const response = await fetch(`${API_BASE_URL}/api/admin/admins`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    await handleResponse(response);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch admin list');
    }

    return response.json();
  },

  async getUserList(token) {
    const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    await handleResponse(response);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch user list');
    }

    return response.json();
  },

  async resetUserRateLimit(token, userId) {
    const response = await fetch(`${API_BASE_URL}/api/admin/reset-rate-limit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ userId })
    });

    await handleResponse(response);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to reset rate limit');
    }

    return response.json();
  },

  async addAdmin(token, email) {
    const response = await fetch(`${API_BASE_URL}/api/admin/add-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ email })
    });

    await handleResponse(response);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add admin');
    }

    return response.json();
  },

  async removeAdmin(token, email) {
    const response = await fetch(`${API_BASE_URL}/api/admin/remove-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ email })
    });

    await handleResponse(response);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to remove admin');
    }

    return response.json();
  },

  async addSuperAdmin(token, email) {
    const response = await fetch(`${API_BASE_URL}/api/admin/add-superadmin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ email })
    });

    await handleResponse(response);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add super admin');
    }

    return response.json();
  },

  /* LLM */
  async generateAdviceText(token, { content, contentDescription, problem, concerning, approach, goal }) {
    const response = await fetch(`${API_BASE_URL}/api/llm/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        mode: 'text',
        content,
        contentDescription,
        problem,
        concerning,
        approach,
        goal
      })
    });

    await handleResponse(response);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to generate advice');
    }

    return response.json();
  },

  async generateAdviceImage(token, imageUrl, contentDescription ) {
    const response = await fetch(`${API_BASE_URL}/api/llm/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        mode: 'image',
        imageUrl,
        contentDescription 
      })
    });

    await handleResponse(response);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to analyze image');
    }

    return response.json();
  },

  async generateAdviceLink(token, videoUrl, contentDescription ) {
    const response = await fetch(`${API_BASE_URL}/api/llm/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        mode: 'link',
        videoUrl,
        contentDescription 
      })
    });

    await handleResponse(response);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || error.error || 'Failed to analyze video');
    }

    return response.json();
  },
  /* Results */
  async getResultById(token, resultId) {
    const response = await fetch(`${API_BASE_URL}/api/prompts/${resultId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    await handleResponse(response);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch result');
    }

    return response.json();
  },

  async getLatestResults(token, limit = 5) {
    const response = await fetch(`${API_BASE_URL}/api/llm/prompts?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch results');
    }

    return response.json();
  },

  /* Survey */
  async submitSurvey(token, formSet, answers) {
    const response = await fetch(`${API_BASE_URL}/api/survey/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        formSet,
        answers
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit survey');
    }

    return response.json();
  },

  async updateUserFlags(token, updates) {
    const response = await fetch(`${API_BASE_URL}/api/auth/update-flags`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update user flags');
    }

    return response.json();
  },

  /* Survey Admin */
  async getSurveyChartData(token) {
    const response = await fetch(`${API_BASE_URL}/api/survey/admin/charts`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch chart data');
    }

    return response.json();
  },

  async downloadSurveyCSV(token) {
    const response = await fetch(`${API_BASE_URL}/api/survey/admin/download/csv`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to download CSV');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `survey-data-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  },

  /* Prompt Admin */
  async getPromptChartData(token) {
    const response = await fetch(`${API_BASE_URL}/api/prompts/admin/charts`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch prompt chart data');
    }

    return response.json();
  },

  async downloadPromptCSV(token) {
    const response = await fetch(`${API_BASE_URL}/api/prompts/admin/download/csv`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to download CSV');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt-data-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
};

export default api;
