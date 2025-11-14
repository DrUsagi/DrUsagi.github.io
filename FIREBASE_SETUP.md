# Firebase Setup Guide for Forum

This forum uses Firebase Firestore for data storage. Follow these steps to set up Firebase:

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard
4. Enable Google Analytics (optional)

## Step 2: Enable Firestore Database

1. In your Firebase project, go to "Firestore Database"
2. Click "Create database"
3. Start in **test mode** (for development) or **production mode** (for production)
4. Choose a location for your database

## Step 3: Get Firebase Configuration

1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click the web icon (`</>`) to add a web app
4. Register your app (you can use any name)
5. Copy the Firebase configuration object

## Step 4: Configure Forum

1. Open `assets/js/forum.js`
2. Find the `firebaseConfig` object (around line 8)
3. Replace the placeholder values with your Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 5: Set Firestore Security Rules

1. In Firebase Console, go to Firestore Database > Rules
2. For development, you can use these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all forum posts
    match /forum_posts/{postId} {
      allow read: if true;
      allow create: if request.auth == null; // Allow anonymous creation
      allow update: if request.auth == null; // Allow anonymous updates (IP-based check in app)
      allow delete: if request.auth == null; // Allow anonymous deletes (IP-based check in app)
    }
  }
}
```

**Important Security Note:**
- The above rules allow anyone to read/write. For production, you should implement proper authentication.
- IP-based authentication in the client-side JavaScript is not fully secure (IPs can be spoofed).
- For a personal website with low traffic, this is acceptable, but for higher security, consider:
  - Implementing Firebase Authentication
  - Using Firebase Cloud Functions for server-side IP validation
  - Implementing rate limiting

## Step 6: Test the Forum

1. Deploy your website
2. Visit the `/forum/` page
3. Try creating a post
4. Verify that posts appear and can be edited/deleted

## Firestore Data Structure

The forum uses the following data structure:

### Collection: `forum_posts`

Each document contains:
- `title` (string): Post title
- `author` (string): Author name
- `content` (string): Post content
- `authorIP` (string): IP address of the author (for permission checking)
- `createdAt` (timestamp): Creation timestamp
- `updatedAt` (timestamp, optional): Last update timestamp
- `replies` (array): Array of reply objects

### Reply Object Structure:
- `author` (string): Reply author name
- `content` (string): Reply content
- `authorIP` (string): IP address of the reply author
- `createdAt` (timestamp): Creation timestamp
- `updatedAt` (timestamp, optional): Last update timestamp

## Firebase Pricing

Firebase has a free tier (Spark plan) that includes:
- 1 GB storage
- 10 GB/month network egress
- 50K reads/day
- 20K writes/day
- 20K deletes/day

For a personal website forum, this should be sufficient. If you exceed these limits, you'll need to upgrade to the Blaze plan (pay-as-you-go).

## Troubleshooting

### Forum not loading
- Check browser console for errors
- Verify Firebase config is correct
- Check Firestore rules allow read access

### Can't create posts
- Check Firestore rules allow write access
- Check browser console for errors
- Verify Firebase project is active

### Can't edit/delete posts
- Verify IP matching (check localStorage for 'userIP')
- Check Firestore rules allow update/delete
- Note: IP-based authentication is client-side only and not fully secure

## Alternative: Using GitHub Issues (No Setup Required)

If you prefer not to use Firebase, you could modify the forum to use GitHub Issues API instead. This would require:
- GitHub OAuth for authentication
- Using GitHub Issues as the backend
- More complex implementation

For now, Firebase is the recommended solution for ease of setup and functionality.

