// LINE Login configuration
const LINE_CLIENT_ID = import.meta.env.VITE_LINE_CLIENT_ID;
const LINE_REDIRECT_URI = import.meta.env.VITE_LINE_REDIRECT_URI || `${window.location.origin}/login`;

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
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    // Store state and code verifier in sessionStorage for verification
    sessionStorage.setItem('line_state', state);
    sessionStorage.setItem('line_code_verifier', codeVerifier);

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: LINE_CLIENT_ID,
      redirect_uri: LINE_REDIRECT_URI,
      state: state,
      scope: 'profile openid email',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      // Add these parameters to ensure app opens on mobile
      prompt: 'consent',
      ui_locales: 'th-TH' // Optional: set to Thai locale, change as needed
    });

    const lineAuthUrl = `https://access.line.me/oauth2/v2.1/authorize?${params.toString()}`;
    
    // This URL will automatically:
    // - Open LINE app on mobile devices (iOS/Android) if installed
    // - Fall back to web browser if app is not installed
    // - Open web version on desktop
    window.location.href = lineAuthUrl;
  },

  handleCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');

    if (error) {
      return { success: false, error: errorDescription || error };
    }

    if (!code || !state) {
      return { success: false, error: 'Missing authorization code or state' };
    }

    const savedState = sessionStorage.getItem('line_state');
    if (state !== savedState) {
      return { success: false, error: 'State mismatch - possible CSRF attack' };
    }

    const codeVerifier = sessionStorage.getItem('line_code_verifier');

    // Clean up sessionStorage
    sessionStorage.removeItem('line_state');
    sessionStorage.removeItem('line_code_verifier');

    return {
      success: true,
      code,
      codeVerifier,
      redirectUri: LINE_REDIRECT_URI
    };
  },

  // Check if current URL is a LINE callback
  isLineCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('code') && sessionStorage.getItem('line_state');
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