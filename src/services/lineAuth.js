// LINE Login configuration
const LINE_CLIENT_ID = import.meta.env.VITE_LINE_CLIENT_ID;
const LINE_REDIRECT_URI = import.meta.env.VITE_LINE_REDIRECT_URI || `${window.location.origin}/login`;

const generateState = () => {
  const array = new Uint32Array(8);
  window.crypto.getRandomValues(array);
  return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
};

const generateCodeVerifier = () => {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return base64UrlEncode(array);
};

const base64UrlEncode = (buffer) => {
  const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

const generateCodeChallenge = async (verifier) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return base64UrlEncode(hash);
};

// Storage helpers that use both localStorage and sessionStorage for reliability on mobile
const storage = {
  set: (key, value) => {
    try {
      localStorage.setItem(key, value);
      sessionStorage.setItem(key, value);
    } catch (e) {
      sessionStorage.setItem(key, value);
    }
  },
  
  get: (key) => {
    try {
      return localStorage.getItem(key) || sessionStorage.getItem(key);
    } catch (e) {
      return sessionStorage.getItem(key);
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    } catch (e) {
      sessionStorage.removeItem(key);
    }
  }
};

// Exchange authorization code for access token
const exchangeCodeForToken = async (code, codeVerifier) => {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: LINE_REDIRECT_URI,
    client_id: LINE_CLIENT_ID,
    code_verifier: codeVerifier
  });

  const response = await fetch('https://api.line.me/oauth2/v2.1/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error_description || 'Failed to exchange code for token');
  }

  const data = await response.json();
  return data.access_token;
};

export const lineAuth = {
  async login() {
    if (!LINE_CLIENT_ID) {
      throw new Error('LINE Client ID is not configured');
    }

    if (!LINE_REDIRECT_URI) {
      throw new Error('LINE Redirect URI is not configured');
    }

    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    // Use hybrid storage for mobile reliability
    storage.set('line_state', state);
    storage.set('line_code_verifier', codeVerifier);
    
    // Also store timestamp to detect expired sessions
    storage.set('line_auth_timestamp', Date.now().toString());

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: LINE_CLIENT_ID,
      redirect_uri: LINE_REDIRECT_URI,
      state: state,
      scope: 'profile openid email',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256'
    });

    const lineAuthUrl = `https://access.line.me/oauth2/v2.1/authorize?${params.toString()}`;
    window.location.href = lineAuthUrl;
  },

  async handleCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');

    if (error) {
      return { success: false, error: errorDescription || error };
    }

    if (!code) {
      return { success: false, error: 'Missing authorization code' };
    }

    const savedState = storage.get('line_state');
    const codeVerifier = storage.get('line_code_verifier');
    const timestamp = storage.get('line_auth_timestamp');

    // Check if session expired (5 minutes timeout)
    if (timestamp) {
      const elapsed = Date.now() - parseInt(timestamp);
      if (elapsed > 5 * 60 * 1000) { // 5 minutes
        storage.remove('line_state');
        storage.remove('line_code_verifier');
        storage.remove('line_auth_timestamp');
        return {
          success: false,
          error: 'การเข้าสู่ระบบหมดเวลา กรุณาลองใหม่อีกครั้ง หรือลองเข้าโดยตรงการผ่านกดลิงก์บนแอพไลน์บนมือถือ (Session expired, please try again)'
        };
      }
    }

    // Validate state - FIXED LOGIC
    if (!savedState || !codeVerifier) {
      return {
        success: false,
        error: 'ข้อมูลการเข้าสู่ระบบหายไป กรุณาลองใหม่อีกครั้ง หรือลองเข้าโดยตรงการผ่านกดลิงก์บนแอพไลน์บนมือถือ (Please try again)'
      };
    }

    if (state !== savedState) {
      storage.remove('line_state');
      storage.remove('line_code_verifier');
      storage.remove('line_auth_timestamp');
      return {
        success: false,
        error: 'State mismatch - possible CSRF attack'
      };
    }

    // Exchange code for access token
    try {
      const accessToken = await exchangeCodeForToken(code, codeVerifier);

      // Clean up storage
      storage.remove('line_state');
      storage.remove('line_code_verifier');
      storage.remove('line_auth_timestamp');

      return {
        success: true,
        accessToken
      };
    } catch (err) {
      // Clean up storage on error
      storage.remove('line_state');
      storage.remove('line_code_verifier');
      storage.remove('line_auth_timestamp');

      return {
        success: false,
        error: err.message || 'Failed to get access token'
      };
    }
  },

  isLineCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const hasCode = urlParams.has('code');
    const hasState = urlParams.has('state');
    return hasCode && hasState;
  },

  clearCallbackParams() {
    const url = new URL(window.location.href);
    url.searchParams.delete('code');
    url.searchParams.delete('state');
    url.searchParams.delete('error');
    url.searchParams.delete('error_description');
    window.history.replaceState({}, document.title, url.pathname);
  }
};

export default lineAuth;