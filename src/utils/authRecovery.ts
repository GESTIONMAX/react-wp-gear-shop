// Utility to handle auth recovery and token cleanup
export const clearAuthData = () => {
  // Clear all potential Supabase localStorage keys
  const keys = Object.keys(localStorage);
  const supabaseKeys = keys.filter(key => key.includes('sb-') && key.includes('auth'));
  
  supabaseKeys.forEach(key => {
    console.log('Clearing auth key:', key);
    localStorage.removeItem(key);
  });
  
  // Also clear specific project tokens
  localStorage.removeItem('sb-hgapjysrbldjqromnrov-auth-token');
  localStorage.removeItem('supabase.auth.token');
};

export const isTokenExpired = (token?: string) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch {
    return true;
  }
};

export const recoverFromTokenError = () => {
  console.log('Recovering from token error...');
  clearAuthData();
  
  // Reload the page to reinitialize auth state
  window.location.reload();
};