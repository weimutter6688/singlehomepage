'use server';

// Check if a request has valid authentication token
export async function isAuthenticated(token: string | null | undefined): Promise<boolean> {
  const validToken = process.env.ACCESS_TOKEN;
  
  if (!validToken) {
    console.error('ACCESS_TOKEN is not defined in environment variables');
    return false;
  }
  
  return token === validToken;
}