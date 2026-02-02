# Admin Authentication Setup Guide

## 📋 Overview
This guide covers the complete setup for admin authentication in your portfolio application.

## 🔐 Firebase Configuration

### 1. Authorized Domains (Required)
Add these domains in **Firebase Console → Authentication → Settings → Authorized domains**:

- ✅ `gcp.jeffdev.studio` (your custom domain)
- ✅ `portfolio-react-fmtd4eq2rq-uc.a.run.app` (Cloud Run URL)
- ✅ `localhost` (for local development)
- ✅ `127.0.0.1` (optional, for local IP access)

### 2. Enable Authentication Methods
**Firebase Console → Authentication → Sign-in method**:

- ✅ **Email/Password** - ENABLED
- ✅ **Email link (passwordless sign-in)** - Optional
- ❌ Google, GitHub, etc. - Disabled (unless you want to add them)

### 3. Create Admin User
**Firebase Console → Authentication → Users → Add user**:

- **Email**: `jeffmartinez2474@gmail.com` (hardcoded in AuthContext.jsx)
- **Password**: Set a strong password
- **User UID**: Will be auto-generated

**⚠️ IMPORTANT**: Only this exact email will have admin access!

## 🔧 Application Configuration

### Admin Email Whitelist
Located in `src/context/AuthContext.jsx`:

```javascript
// Explicit admin email whitelist
const ADMIN_EMAIL = 'jeffmartinez2474@gmail.com'
```

To add more admins, modify this to an array:
```javascript
const ADMIN_EMAILS = [
  'jeffmartinez2474@gmail.com',
  'another-admin@example.com'
]

// Then update the check:
setIsAdmin(user && ADMIN_EMAILS.includes(user.email))
```

### Environment Variables
Already configured in GitHub Secrets and passed to Docker build:

- ✅ `VITE_FIREBASE_API_KEY`
- ✅ `VITE_FIREBASE_AUTH_DOMAIN`
- ✅ `VITE_FIREBASE_PROJECT_ID`
- ✅ `VITE_FIREBASE_STORAGE_BUCKET`
- ✅ `VITE_FIREBASE_MESSAGING_SENDER_ID`
- ✅ `VITE_FIREBASE_APP_ID`
- ✅ `VITE_FIREBASE_MEASUREMENT_ID`

## 🛣️ Routes

### Public Routes
- `/admin/login` - Login page (accessible to all)
- `/admin/gateway` - Secret gateway with key parameter

### Protected Routes (Require Authentication)
All routes under `/admin/*` except `/admin/login` are protected by `ProtectedRoute` component.

Examples:
- `/admin` - Dashboard
- `/admin/blog` - Blog management
- `/admin/projects` - Projects management
- `/admin/services` - Services management
- `/admin/bookings` - Bookings management
- `/admin/payments` - Payments dashboard
- `/admin/analytics` - Analytics
- `/admin/messages` - Messages
- `/admin/settings` - System configuration
- `/admin/audit-logs` - Audit logs

## 🔒 Security Features

### 1. Protected Route Component
Located in `src/components/ProtectedRoute.jsx`:

- Checks if user is authenticated (`currentUser`)
- Checks if user has admin privileges (`isAdmin`)
- Redirects to `/admin/login` if not authenticated
- Shows "ACCESS DENIED" if authenticated but not admin

### 2. Session Persistence
Login form supports "Remember Me":
- ✅ Checked: `browserLocalPersistence` (stays logged in across sessions)
- ❌ Unchecked: `browserSessionPersistence` (logs out when browser closes)

### 3. Firebase Authentication Rules
Make sure your Firestore security rules restrict admin operations:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
             request.auth.token.email == 'jeffmartinez2474@gmail.com';
    }
    
    // Public read, admin-only write
    match /{document=**} {
      allow read: if true;  // Public read
      allow write: if isAdmin();  // Admin-only write
    }
  }
}
```

## 🚀 Testing Checklist

### Local Development
1. ✅ `npm run dev` - Start local server
2. ✅ Navigate to `http://localhost:5173/admin/login`
3. ✅ Login with admin email and password
4. ✅ Verify redirect to `/admin` dashboard
5. ✅ Check that all admin routes are accessible
6. ✅ Logout and verify redirect to login

### Production Testing
1. ✅ Navigate to `https://gcp.jeffdev.studio/admin/login`
2. ✅ Login with admin credentials
3. ✅ Verify Firebase connection (check browser console for errors)
4. ✅ Test protected routes
5. ✅ Test logout functionality

## 🐛 Troubleshooting

### "Failed to log in" Error
**Causes**:
- Domain not in Firebase authorized domains
- Wrong email/password
- Firebase Auth not enabled
- Network issues

**Solution**:
1. Check Firebase Console → Authentication → Settings → Authorized domains
2. Verify email/password are correct
3. Check browser console for detailed error
4. Ensure Firebase Auth is enabled for Email/Password

### "ACCESS DENIED" After Login
**Causes**:
- Email doesn't match `ADMIN_EMAIL` constant
- User is authenticated but not recognized as admin

**Solution**:
1. Check `src/context/AuthContext.jsx` - verify `ADMIN_EMAIL` matches your login email
2. Check browser console for user object: `console.log(currentUser)`
3. Ensure email is exactly the same (case-sensitive)

### Firebase Connection Errors
**Causes**:
- Environment variables not loaded
- Firebase config missing/incorrect
- Network/CORS issues

**Solution**:
1. Check that all `VITE_FIREBASE_*` env vars are set in build
2. Verify Firebase project settings
3. Check browser console for specific Firebase errors
4. Ensure Firebase SDK versions are compatible

### Session Not Persisting
**Causes**:
- "Remember Me" not checked
- Browser clearing cookies
- Firebase persistence not set correctly

**Solution**:
1. Check "Remember Me" when logging in
2. Verify browser allows cookies
3. Check Firebase Auth persistence settings

## 📝 Additional Notes

### Custom Domain Setup
If you add more custom domains:
1. Add to Firebase authorized domains
2. Update DNS records
3. Configure SSL certificates in Cloud Run
4. Test authentication on new domain

### Adding More Admins
1. Create user in Firebase Console → Authentication
2. Update `ADMIN_EMAIL` to `ADMIN_EMAILS` array in `AuthContext.jsx`
3. Add new email to array
4. Redeploy application

### Changing Admin Email
1. Update `ADMIN_EMAIL` in `src/context/AuthContext.jsx`
2. Create new user in Firebase with new email
3. Commit and redeploy

## 🔗 References

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [React Router Protected Routes](https://reactrouter.com/en/main/start/overview)
