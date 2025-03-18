'use client';

// Check if user is authenticated by verifying the cookie with the server
export async function checkAuthentication(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/verify', {
      method: 'GET',
      credentials: 'include',
    });
    return response.ok;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
}

// Set access token by making a server request that sets an httpOnly cookie
export async function setAccessToken(token: string): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error setting access token:', error);
    return false;
  }
}