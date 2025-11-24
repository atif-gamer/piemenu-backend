# Google Authentication Implementation Summary

## Changes Made

### 1. Package Dependencies
Added the following packages (need to install):
```bash
npm install passport passport-google-oauth20 express-session
```

### 2. User Model Updates (`Models/User.js`)
- Added `googleId` field (unique, sparse index)
- Added `profilePicture` field
- Made `password` field conditional (only required if no googleId)
- Updated password hashing to check if password exists

### 3. Passport Configuration (`config/passport.js`)
Created new file with:
- Google OAuth strategy configuration
- User serialization/deserialization
- Automatic user creation or linking for Google accounts

### 4. Controller Updates (`Controllers/user.controller.js`)
Added three new controller functions:
- `googleAuth`: Initiates Google OAuth flow
- `googleAuthCallback`: Handles redirect after Google auth (redirects to frontend)
- `googleAuthCallbackJSON`: Alternative that returns JSON response

### 5. Route Updates (`routes/user.routes.js`)
Added three new routes:
- `GET /api/v1/user/auth/google` - Start OAuth flow
- `GET /api/v1/user/auth/google/callback` - Handle redirect (web)
- `GET /api/v1/user/auth/google/callback/json` - Handle with JSON response (API)

### 6. App Configuration (`app.js`)
- Imported passport and express-session
- Added session middleware
- Initialized passport middleware

## Environment Variables Required

Add these to your `.env` file:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:8000/api/v1/user/auth/google/callback

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Session Secret
SESSION_SECRET=your_random_secret_here
```

## How It Works

1. User clicks "Sign in with Google" on frontend
2. Frontend redirects to `/api/v1/user/auth/google`
3. User is taken to Google's consent screen
4. After approval, Google redirects to callback URL
5. Backend creates/updates user and generates tokens
6. User is redirected to frontend with cookies set
7. Frontend can now make authenticated requests

## User Flow

### New Google User
1. User signs in with Google
2. New user account created with Google profile data
3. No password required
4. Tokens generated and returned

### Existing Email/Password User
1. User signs in with Google using same email
2. Google account linked to existing account
3. User can now sign in with either method

### Returning Google User
1. User signs in with Google
2. Existing account found via googleId
3. Tokens refreshed and returned

## API Response Format

The callback endpoint redirects to:
```
{FRONTEND_URL}/auth/callback?success=true
```

Or on error:
```
{FRONTEND_URL}/auth/callback?success=false&error={error_message}
```

The JSON callback endpoint returns:
```json
{
  "statusCode": 200,
  "message": "User authenticated successfully",
  "data": {
    "user": {
      "_id": "...",
      "name": "...",
      "email": "...",
      "googleId": "...",
      "profilePicture": "..."
    },
    "stores": [...],
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

## Security Features

- JWT tokens for authentication
- HTTP-only cookies prevent XSS attacks
- Secure cookies in production (HTTPS)
- SameSite cookie policy for CSRF protection
- Password not required for Google-only accounts
- Automatic account linking by email

## Next Steps

1. Install required packages
2. Set up Google Cloud Console project
3. Add environment variables
4. Integrate with frontend
5. Test the authentication flow

See `GOOGLE_AUTH_SETUP.md` for detailed setup instructions.

