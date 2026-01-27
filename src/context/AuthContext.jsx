import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  auth,
  googleProvider,
  facebookProvider,
  appleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from '../config/firebase';
import { api } from '../services/api';
import { lineAuth } from '../services/lineAuth';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [backendUser, setBackendUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Optionally sync with backend on auth state change
        const token = localStorage.getItem('backend_token');
        if (token) {
          try {
            const response = await api.getCurrentUser(token);
            // Handle both { user: {...} } and direct user object response formats
            const userData = response.user || response;
            setBackendUser(userData);
          } catch (err) {
            console.error('Failed to get backend user:', err);
          }
        }
      } else {
        setBackendUser(null);
        localStorage.removeItem('backend_token');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Handle LINE callback on mount
  useEffect(() => {
    if (lineAuth.isLineCallback()) {
      handleLineCallback();
    }
  }, []);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Email/Password Sign In
  const signInWithEmail = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const backendResponse = await api.syncFirebaseUser(result.user, null);
      setBackendUser(backendResponse.user);
      if (backendResponse.token) {
        localStorage.setItem('backend_token', backendResponse.token);
      }
      return { success: true, user: result.user, backendUser: backendResponse.user };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Email/Password Sign Up
  const signUpWithEmail = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const backendResponse = await api.syncFirebaseUser(result.user, null);
      setBackendUser(backendResponse.user);
      if (backendResponse.token) {
        localStorage.setItem('backend_token', backendResponse.token);
      }
      return { success: true, user: result.user, backendUser: backendResponse.user };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Google Sign In
  const signInWithGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const backendResponse = await api.syncFirebaseUser(result.user, 'google');
      setBackendUser(backendResponse.user);
      if (backendResponse.token) {
        localStorage.setItem('backend_token', backendResponse.token);
      }
      return { success: true, user: result.user, backendUser: backendResponse.user };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Facebook Sign In
  const signInWithFacebook = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const backendResponse = await api.syncFirebaseUser(result.user, 'facebook');
      setBackendUser(backendResponse.user);
      if (backendResponse.token) {
        localStorage.setItem('backend_token', backendResponse.token);
      }
      return { success: true, user: result.user, backendUser: backendResponse.user };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Apple Sign In
  const signInWithApple = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, appleProvider);
      const backendResponse = await api.syncFirebaseUser(result.user, 'apple');
      setBackendUser(backendResponse.user);
      if (backendResponse.token) {
        localStorage.setItem('backend_token', backendResponse.token);
      }
      return { success: true, user: result.user, backendUser: backendResponse.user };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // LINE Sign In - Initiates the OAuth flow
  const signInWithLine = async () => {
    setError(null);
    await lineAuth.login();
  };

  // Handle LINE OAuth callback
  const handleLineCallback = async () => {
    setLoading(true);
    try {
      const callbackResult = lineAuth.handleCallback();

      if (!callbackResult.success) {
        setError(callbackResult.error);
        lineAuth.clearCallbackParams();
        return { success: false, error: callbackResult.error };
      }

      // Send the auth code to backend for token exchange and user creation
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/auth/line/callback`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            code: callbackResult.code,
            codeVerifier: callbackResult.codeVerifier,
            redirectUri: callbackResult.redirectUri
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'LINE authentication failed');
      }

      const data = await response.json();
      setBackendUser(data.user);

      if (data.token) {
        localStorage.setItem('backend_token', data.token);
      }

      lineAuth.clearCallbackParams();
      return { success: true, backendUser: data.user };
    } catch (err) {
      setError(err.message);
      lineAuth.clearCallbackParams();
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setError(null);
    try {
      const token = localStorage.getItem('backend_token');
      if (token) {
        await api.logout(token);
      }
      await signOut(auth);
      setUser(null);
      setBackendUser(null);
      localStorage.removeItem('backend_token');
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Reset Password
  const resetPassword = async (email) => {
    setError(null);
    setSuccessMessage(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage('ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว');
      return { success: true };
    } catch (err) {
      let errorMessage = err.message;
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'ไม่พบบัญชีผู้ใช้ที่ใช้อีเมลนี้';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'รูปแบบอีเมลไม่ถูกต้อง';
      }
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Update user flags (isFirstTime, isSubmitFirstForm)
  const updateUserFlags = async (updates) => {
    setError(null);
    try {
      const token = localStorage.getItem('backend_token');
      if (!token) {
        throw new Error('No authentication token');
      }
      const updatedUser = await api.updateUserFlags(token, updates);
      setBackendUser(updatedUser.user || updatedUser);
      return { success: true, user: updatedUser };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Refresh backend user data
  const refreshBackendUser = async () => {
    try {
      const token = localStorage.getItem('backend_token');
      if (token) {
        const response = await api.getCurrentUser(token);
        // Handle both { user: {...} } and direct user object response formats
        const userData = response.user || response;
        setBackendUser(userData);
        return { success: true, user: userData };
      }
      return { success: false, error: 'No token' };
    } catch (err) {
      console.error('Failed to refresh backend user:', err);
      return { success: false, error: err.message };
    }
  };

  // Role-based access helpers
  const isAdmin = backendUser?.isAdmin === true || backendUser?.role === 'admin' || backendUser?.role === 'superadmin';
  const isSuperAdmin = backendUser?.isSuperAdmin === true || backendUser?.role === 'superadmin';

  const value = {
    user,
    backendUser,
    loading,
    error,
    successMessage,
    isAdmin,
    isSuperAdmin,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInWithFacebook,
    signInWithApple,
    signInWithLine,
    logout,
    resetPassword,
    updateUserFlags,
    refreshBackendUser,
    clearError: () => setError(null),
    clearSuccessMessage: () => setSuccessMessage(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
