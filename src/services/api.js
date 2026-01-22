const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const api = {
  // Sync Firebase user to backend
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

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to sync user');
    }

    return response.json();
  },

  // Sync LINE user to backend
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

  // Email/Password registration
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

  // Email/Password login
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

  // Get current user from backend
  async getCurrentUser(token) {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get user');
    }

    return response.json();
  },

  // Logout
  async logout(token) {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.ok;
  }
};

export default api;
