// LINE Login configuration
const LINE_CLIENT_ID = import.meta.env.VITE_LINE_CLIENT_ID;
const LINE_REDIRECT_URI = import.meta.env.VITE_LINE_REDIRECT_URI || `${window.location.origin}/login`;

// Debug: Log the configuration
console.log('=== LINE CONFIG ===');
console.log('Client ID:', LINE_CLIENT_ID);
console.log('Redirect URI:', LINE_REDIRECT_URI);
console.log('Window Origin:', window.location.origin);
console.log('==================');

// Generate random state for CSRF protection
const generateState = () => {
  const array = new Uint32Array(8);
  window.crypto.getRandomValues(array);
  return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
};

// Generate code verifier for PKCE
const generateCodeVerifier = () => {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return base64UrlEncode(array);
};

// Base64 URL encode
const base64UrlEncode = (buffer) => {
  const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

// Generate code challenge from verifier (S256 method)
const generateCodeChallenge = async (verifier) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return base64UrlEncode(hash);
};

export const lineAuth = {
  // Initiate LINE login
  async login() {
    // Validate required environment variables
    if (!LINE_CLIENT_ID) {
      console.error('LINE_CLIENT_ID is not configured');
      throw new Error('LINE Client ID is not configured');
    }
    
    if (!LINE_REDIRECT_URI) {
      console.error('LINE_REDIRECT_URI is not configured');
      throw new Error('LINE Redirect URI is not configured');
    }
    
    console.log('LINE Login Config:', {
      clientId: LINE_CLIENT_ID,
      redirectUri: LINE_REDIRECT_URI
    });

    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    // Store state and code verifier in localStorage for verification
    localStorage.setItem('line_state', state);
    localStorage.setItem('line_code_verifier', codeVerifier);

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: LINE_CLIENT_ID,
      redirect_uri: LINE_REDIRECT_URI, // This will be URL-encoded automatically
      state: state,
      scope: 'profile openid email',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256'
    });

    const lineAuthUrl = `https://access.line.me/oauth2/v2.1/authorize?${params.toString()}`;

    console.log('=== FULL AUTH URL ===');
    console.log(lineAuthUrl);
    console.log('=== PARAMS ===');
    console.log('client_id:', LINE_CLIENT_ID);
    console.log('redirect_uri:', LINE_REDIRECT_URI);
    console.log('redirect_uri (encoded):', encodeURIComponent(LINE_REDIRECT_URI));
    console.log('==================');

    // Check if we're on mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
      console.log('Opening LINE app on mobile...');

      // Store fallback URL
      const fallbackUrl = lineAuthUrl;

      if (isAndroid) {
        // Android: Use intent URL to open LINE app with fallback to web
        const intentUrl = `intent://authorize?${params.toString()}#Intent;scheme=line;package=jp.naver.line.android;S.browser_fallback_url=${encodeURIComponent(fallbackUrl)};end`;
        window.location.href = intentUrl;
      } else if (isIOS) {
        // iOS: Try LINE URL scheme first, with timeout fallback to web
        const lineAppUrl = `line://authorize?${params.toString()}`;

        // Set fallback timeout - if app doesn't open within 1.5s, redirect to web
        const fallbackTimeout = setTimeout(() => {
          console.log('LINE app not responding, falling back to web...');
          window.location.href = fallbackUrl;
        }, 1500);

        // Listen for page visibility change (app opened successfully)
        const handleVisibilityChange = () => {
          if (document.hidden) {
            clearTimeout(fallbackTimeout);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
          }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Try to open LINE app
        window.location.href = lineAppUrl;
      }
    } else {
      // Desktop: Use standard web URL
      console.log('Opening LINE web login...');
      window.location.href = lineAuthUrl;
    }
  },

  handleCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');

    console.log('=== LINE CALLBACK ===');
    console.log('Code:', code ? 'present' : 'missing');
    console.log('State from URL:', state);
    console.log('Error:', error);

    if (error) {
      return { success: false, error: errorDescription || error };
    }

    if (!code) {
      return { success: false, error: 'Missing authorization code' };
    }

    const savedState = localStorage.getItem('line_state');
    const codeVerifier = localStorage.getItem('line_code_verifier');

    console.log('Saved state:', savedState);
    console.log('Code verifier:', codeVerifier ? 'present' : 'missing');

    // Check state match
    if (!savedState || state !== savedState) {
      console.warn('State mismatch or missing - this can happen on mobile browsers');
      // On mobile, state might be lost due to browser context changes
      // If we have a code but no state, we can still try (backend will validate)
      if (!codeVerifier) {
        return {
          success: false,
          error: 'การเข้าสู่ระบบหมดเวลา กรุณาลองใหม่อีกครั้ง (Session expired, please try again)'
        };
      }
    }

    // Clean up localStorage
    localStorage.removeItem('line_state');
    localStorage.removeItem('line_code_verifier');

    return {
      success: true,
      code,
      codeVerifier: codeVerifier || null,
      redirectUri: LINE_REDIRECT_URI
    };
  },

  // Check if current URL is a LINE callback
  isLineCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    // Check for code param - state might be missing on mobile due to browser context changes
    const hasCode = urlParams.has('code');
    const hasState = urlParams.has('state');
    // Accept callback if we have code and state in URL (even if localStorage state is missing)
    return hasCode && hasState;
  },

  // Clear LINE callback params from URL
  clearCallbackParams() {
    const url = new URL(window.location.href);
    url.searchParams.delete('code');
    url.searchParams.delete('state');
    window.history.replaceState({}, document.title, url.pathname);
  }
};

export default lineAuth;