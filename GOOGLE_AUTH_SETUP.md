# Google Authentication Setup Guide

This guide will help you set up Google OAuth 2.0 authentication for the Pie Menu backend.

## Prerequisites

1. A Google account
2. Access to Google Cloud Console

## Step 1: Install Required Packages

```bash
npm install passport passport-google-oauth20 express-session
```

## Step 2: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. Create OAuth 2.0 Credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Select "Web application"
   - Add the following to "Authorized redirect URIs":
     - `http://localhost:8000/api/v1/user/auth/google/callback` (for development)
     - `https://your-production-domain.com/api/v1/user/auth/google/callback` (for production)
   - Click "Create"
   - Copy the **Client ID** and **Client Secret**

## Step 3: Configure Environment Variables

Add the following to your `.env` file:

```env
# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:8000/api/v1/user/auth/google/callback

# Frontend URL (where users will be redirected after authentication)
FRONTEND_URL=http://localhost:3000

# Session Secret (generate a random string)
SESSION_SECRET=your_random_session_secret_here
```

## Step 4: API Endpoints

### Initiate Google Authentication
```
GET /api/v1/user/auth/google
```
This redirects the user to Google's OAuth consent screen.

### Google Callback (Web Redirect)
```
GET /api/v1/user/auth/google/callback
```
Google redirects here after authentication. This endpoint:
- Creates or updates the user in the database
- Generates access and refresh tokens
- Sets cookies
- Redirects to frontend with success/error status

### Google Callback (JSON Response)
```
GET /api/v1/user/auth/google/callback/json
```
Alternative endpoint that returns JSON instead of redirecting. Useful for:
- Mobile applications
- API testing
- Custom frontend implementations

## Step 5: Frontend Integration

### For Web Applications (React, Next.js, etc.)

1. **Add a "Sign in with Google" button:**

```jsx
const handleGoogleLogin = () => {
  window.location.href = 'http://localhost:8000/api/v1/user/auth/google';
};

<button onClick={handleGoogleLogin}>
  Sign in with Google
</button>
```

2. **Create a callback page to handle the redirect:**

```jsx
// pages/auth/callback.jsx or similar
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const AuthCallback = () => {
  const router = useRouter();
  
  useEffect(() => {
    const { success, error } = router.query;
    
    if (success === 'true') {
      // Cookies are already set by the backend
      // Redirect to dashboard or home
      router.push('/dashboard');
    } else {
      // Handle error
      console.error('Authentication failed:', error);
      router.push('/login?error=' + error);
    }
  }, [router.query]);
  
  return <div>Authenticating...</div>;
};

export default AuthCallback;
```

### For Mobile Applications or API Usage

Use the JSON callback endpoint and handle the response:

```javascript
// This would be called after Google OAuth flow in mobile app
fetch('http://localhost:8000/api/v1/user/auth/google/callback/json', {
  credentials: 'include' // Important for cookies
})
.then(res => res.json())
.then(data => {
  // Store tokens
  localStorage.setItem('accessToken', data.data.accessToken);
  localStorage.setItem('refreshToken', data.data.refreshToken);
  // Navigate to dashboard
})
.catch(error => {
  console.error('Authentication failed:', error);
});
```

## Step 6: User Model Updates

The User model has been updated to support Google authentication:

- `googleId`: Stores the Google user ID
- `profilePicture`: Stores the user's Google profile picture URL
- `password`: Now optional (only required for email/password registration)

Users can:
1. Register with Google (creates new account)
2. Link Google account to existing email/password account
3. Sign in with either method once linked

## Security Features

1. **JWT Tokens**: Access and refresh tokens are generated for authenticated users
2. **HTTP-Only Cookies**: Tokens are stored in secure, HTTP-only cookies
3. **CORS**: Configured to accept credentials from frontend
4. **Session Management**: Express session is used for OAuth flow

## Testing

1. Start your backend server:
```bash
npm run dev
```

2. Navigate to:
```
http://localhost:8000/api/v1/user/auth/google
```

3. Complete the Google OAuth flow

4. You should be redirected to your frontend with authentication cookies set

## Troubleshooting

### "Redirect URI mismatch" error
- Make sure the callback URL in Google Console exactly matches the one in your `.env` file
- Include the full path including `/api/v1/user/auth/google/callback`

### "Invalid credentials" error
- Verify your Client ID and Client Secret are correct
- Make sure there are no extra spaces or quotes in your `.env` file

### Cookies not being set
- Check that `CORS` is configured with `credentials: true`
- Ensure your frontend is making requests with `credentials: 'include'`
- In production, make sure cookies have `secure: true` and use HTTPS

### User not being created
- Check MongoDB connection
- Verify the User model is properly imported
- Check server logs for errors

## Production Deployment

1. Update `GOOGLE_CALLBACK_URL` to your production domain
2. Add production callback URL to Google Console
3. Set `NODE_ENV=production` in environment variables
4. Use HTTPS for all endpoints
5. Generate strong, random secrets for `SESSION_SECRET`, `JWT_ACCESS_SECRET`, and `JWT_REFRESH_SECRET`
6. Update `FRONTEND_URL` to your production frontend domain

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Passport.js Documentation](http://www.passportjs.org/)
- [passport-google-oauth20 Documentation](https://www.passportjs.org/packages/passport-google-oauth20/)

