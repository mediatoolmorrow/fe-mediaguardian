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
      console.error('LINE_CLIENT_ID is not configured');
      throw new Error('LINE Client ID is not configured');
    }

    if (!LINE_REDIRECT_URI) {
      console.error('LINE_REDIRECT_URI is not configured');
      throw new Error('LINE Redirect URI is not configured');
    }

    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    // Encode verifier in the state parameter itself
    // Format: state_timestamp_verifier
    const combinedState = `${state}_${Date.now()}_${codeVerifier}`;
    
    // Store in multiple places as backup
    try {
      localStorage.setItem('line_state', state);
      localStorage.setItem('line_code_verifier', codeVerifier);
      sessionStorage.setItem('line_state', state);
      sessionStorage.setItem('line_code_verifier', codeVerifier);
      
      // Also store in cookie as final fallback
      document.cookie = `line_state=${state}; path=/; max-age=600; SameSite=Lax`;
      document.cookie = `line_verifier=${codeVerifier}; path=/; max-age=600; SameSite=Lax`;
    } catch (e) {
      console.warn('Storage not available:', e);
    }

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: LINE_CLIENT_ID,
      redirect_uri: LINE_REDIRECT_URI,
      state: combinedState, // Send combined state
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
    const stateParam = urlParams.get('state');
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');

    if (error) {
      return { success: false, error: errorDescription || error };
    }

    if (!code) {
      return { success: false, error: 'Missing authorization code' };
    }

    let state, codeVerifier, timestamp;

    // Try to extract from state parameter first (most reliable)
    if (stateParam && stateParam.includes('_')) {
      const parts = stateParam.split('_');
      if (parts.length === 3) {
        state = parts[0];
        timestamp = parseInt(parts[1]);
        codeVerifier = parts[2];
        
        console.log('Retrieved from state parameter');
      }
    }

    // Fallback: Try to get from storage
    if (!state || !codeVerifier) {
      const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
      };

      state = localStorage.getItem('line_state') || 
              sessionStorage.getItem('line_state') || 
              getCookie('line_state');
              
      codeVerifier = localStorage.getItem('line_code_verifier') || 
                     sessionStorage.getItem('line_code_verifier') || 
                     getCookie('line_verifier');
      
      console.log('Retrieved from storage/cookies');
    }

    // Check if we have the required data
    if (!state || !codeVerifier) {
      return {
        success: false,
        error: 'ข้อมูลการเข้าสู่ระบบหายไป กรุณาลองใหม่อีกครั้ง (Auth data missing, please try again)'
      };
    }

    // Check timeout (10 minutes)
    if (timestamp) {
      const elapsed = Date.now() - timestamp;
      if (elapsed > 10 * 60 * 1000) {
        this.cleanup();
        return {
          success: false,
          error: 'การเข้าสู่ระบบหมดเวลา กรุณาลองใหม่อีกครั้ง (Session expired, please try again)'
        };
      }
    }

    // Validate state (extract just the state part if it came from parameter)
    const receivedState = stateParam ? stateParam.split('_')[0] : stateParam;
    if (receivedState !== state) {
      this.cleanup();
      return {
        success: false,
        error: 'State mismatch - please try again'
      };
    }

    // Exchange code for access token
    try {
      const accessToken = await exchangeCodeForToken(code, codeVerifier);
      this.cleanup();

      return {
        success: true,
        accessToken
      };
    } catch (err) {
      this.cleanup();

      return {
        success: false,
        error: err.message || 'Failed to get access token'
      };
    }
  },

  cleanup() {
    // Clean up all storage
    try {
      localStorage.removeItem('line_state');
      localStorage.removeItem('line_code_verifier');
      sessionStorage.removeItem('line_state');
      sessionStorage.removeItem('line_code_verifier');
      
      // Clear cookies
      document.cookie = 'line_state=; path=/; max-age=0';
      document.cookie = 'line_verifier=; path=/; max-age=0';
    } catch (e) {
      console.warn('Cleanup error:', e);
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