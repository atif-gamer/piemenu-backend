# Google Authentication Setup Checklist

Use this checklist to ensure your Google Authentication is set up correctly.

## ✅ Backend Setup

### 1. Install Dependencies
- [ ] Run: `npm install passport passport-google-oauth20 express-session`
- [ ] Verify packages are in `package.json`

### 2. Google Cloud Console Setup
- [ ] Create/select a project at [console.cloud.google.com](https://console.cloud.google.com)
- [ ] Enable Google+ API or Google Identity Services API
- [ ] Create OAuth 2.0 credentials
- [ ] Add authorized redirect URI: `http://localhost:8000/api/v1/user/auth/google/callback`
- [ ] For production, add: `https://your-domain.com/api/v1/user/auth/google/callback`
- [ ] Copy Client ID
- [ ] Copy Client Secret

### 3. Environment Variables
Create or update your `.env` file:

- [ ] `GOOGLE_CLIENT_ID=your_client_id`
- [ ] `GOOGLE_CLIENT_SECRET=your_client_secret`
- [ ] `GOOGLE_CALLBACK_URL=http://localhost:8000/api/v1/user/auth/google/callback`
- [ ] `FRONTEND_URL=http://localhost:3000`
- [ ] `SESSION_SECRET=random_secret_string`
- [ ] `JWT_ACCESS_SECRET=your_access_secret`
- [ ] `JWT_REFRESH_SECRET=your_refresh_secret`

### 4. Code Changes (Already Done ✓)
- [x] Updated User model to support Google OAuth
- [x] Created Passport configuration
- [x] Added Google auth controllers
- [x] Added Google auth routes
- [x] Updated app.js with Passport middleware

### 5. Test Backend
- [ ] Start server: `npm run dev`
- [ ] Navigate to: `http://localhost:8000/api/v1/user/auth/google`
- [ ] Verify Google OAuth consent screen appears
- [ ] Complete sign-in process
- [ ] Verify redirect works (even if frontend isn't ready yet)

## ✅ Frontend Setup

### 1. Environment Variables
- [ ] `NEXT_PUBLIC_API_URL=http://localhost:8000` (Next.js)
- [ ] `VITE_API_URL=http://localhost:8000` (Vite/Vue)
- [ ] `REACT_APP_API_URL=http://localhost:8000` (Create React App)

### 2. Create Components
- [ ] Google login button component
- [ ] Auth callback page/component
- [ ] Update login page to include Google option

### 3. Configure Routing
- [ ] Add route for auth callback (e.g., `/auth/callback`)
- [ ] Ensure callback route handles query parameters

### 4. Test Frontend
- [ ] Click "Sign in with Google" button
- [ ] Complete OAuth flow
- [ ] Verify redirect back to frontend
- [ ] Check that cookies are set (dev tools > Application > Cookies)
- [ ] Verify authenticated requests work

## ✅ Integration Testing

### Test Scenarios
- [ ] New user signs up with Google
  - [ ] User created in database
  - [ ] Tokens generated
  - [ ] Redirected to frontend
  
- [ ] Existing email/password user signs in with Google
  - [ ] Google account linked to existing account
  - [ ] User can sign in with either method
  
- [ ] Returning Google user signs in
  - [ ] User found by googleId
  - [ ] Tokens refreshed
  - [ ] Redirected successfully
  
- [ ] Make authenticated request after Google login
  - [ ] Cookies sent with request
  - [ ] Backend validates tokens
  - [ ] Protected routes accessible

## ✅ Production Checklist

### Backend
- [ ] Update `GOOGLE_CALLBACK_URL` to production domain
- [ ] Add production callback URL to Google Console
- [ ] Set `NODE_ENV=production`
- [ ] Use strong, random secrets for all environment variables
- [ ] Enable HTTPS
- [ ] Update CORS settings for production frontend domain
- [ ] Test OAuth flow on production

### Frontend
- [ ] Update API URL to production backend
- [ ] Test Google login flow
- [ ] Verify cookies work with production domain
- [ ] Check CORS settings
- [ ] Test all auth-related features

### Google Console
- [ ] Add production domain to authorized JavaScript origins
- [ ] Add production callback URL to authorized redirect URIs
- [ ] Verify OAuth consent screen information
- [ ] Consider OAuth verification if needed

## ✅ Troubleshooting

Common issues and solutions:

- [ ] "Redirect URI mismatch"
  - Check Google Console authorized redirect URIs
  - Ensure exact match with backend callback URL
  
- [ ] Cookies not being set
  - Verify `credentials: 'include'` in frontend requests
  - Check CORS configuration has `credentials: true`
  - In production, ensure cookies have `secure: true` and use HTTPS
  
- [ ] "Invalid credentials"
  - Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
  - Check for extra spaces in .env file
  
- [ ] User not created
  - Check MongoDB connection
  - Verify User model import
  - Check server logs for errors

## 📚 Documentation Files

Reference these files for more details:
- `GOOGLE_AUTH_SETUP.md` - Detailed setup guide
- `GOOGLE_AUTH_IMPLEMENTATION.md` - Technical implementation details
- `FRONTEND_INTEGRATION_EXAMPLE.md` - Code examples for frontend

## 🔒 Security Reminders

- [ ] Never commit `.env` file to version control
- [ ] Use strong, random secrets in production
- [ ] Always use HTTPS in production
- [ ] Keep Google Client Secret confidential
- [ ] Regularly rotate secrets
- [ ] Monitor for suspicious authentication attempts
- [ ] Implement rate limiting on auth endpoints
- [ ] Keep dependencies updated

## ✨ Optional Enhancements

Consider adding these features:
- [ ] Email verification
- [ ] Two-factor authentication
- [ ] Account deletion/unlinking
- [ ] OAuth with other providers (Facebook, GitHub, etc.)
- [ ] User profile picture upload (in addition to Google photo)
- [ ] Admin panel for user management
- [ ] Analytics for login methods

