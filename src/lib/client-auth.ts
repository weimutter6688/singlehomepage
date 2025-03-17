'use client';

// Get the access token from environment variable or localStorage
export function getAccessToken(): string {
  if (typeof window === 'undefined') {
    return '';
  }
  
  // Try to get the token from localStorage first (for persistence)
  const storedToken = localStorage.getItem('access_token');
  if (storedToken) {
    return storedToken;
  }
  
  // Fall back to environment variable
  const envToken = process.env.NEXT_PUBLIC_ACCESS_TOKEN || '';
  if (envToken) {
    // Store for future use
    localStorage.setItem('access_token', envToken);
  }
  
  return envToken;
}

// Set a custom access token (e.g., from user input)
export function setAccessToken(token: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem('access_token', token);
}