# Guestbook Setup Instructions

The guestbook feature requires a backend service to handle message storage and deletion. Since GitHub Pages is a static site, you have several options:

## Option 1: Use GitHub Issues API (Recommended)

This approach uses GitHub Issues to store guestbook messages. Each message becomes an issue.

### Setup Steps:

1. **Create a GitHub Personal Access Token:**
   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate a new token with `public_repo` scope
   - Store it securely (you'll need it for the backend)

2. **Create a Serverless Function:**
   - Use Vercel, Netlify Functions, or GitHub Actions
   - The function should:
     - Accept POST requests to add messages
     - Accept DELETE requests to remove messages (only if IP matches)
     - Store messages in GitHub Issues or a JSON file in the repo

3. **Update the Guestbook Page:**
   - Replace the API endpoint in `_pages/guestbook.md` with your serverless function URL

## Option 2: Use Firebase (Easier Setup)

Firebase provides a free tier and is easier to set up:

1. **Create a Firebase Project:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Firestore Database

2. **Update the Guestbook JavaScript:**
   - Add Firebase SDK
   - Update the JavaScript to use Firestore instead of GitHub API

## Option 3: Use Staticman (Simplest for Static Sites)

Staticman is designed for static sites like Jekyll:

1. **Set up Staticman:**
   - Follow instructions at [Staticman](https://staticman.net/)
   - Configure it in `_config.yml` (already configured)
   - Enable it for the guestbook page

2. **Update Guestbook:**
   - Use Staticman's form submission endpoint
   - Messages will be stored as YAML files in `_data/comments/`

## Current Implementation

The current guestbook page (`_pages/guestbook.md`) includes:
- ✅ Frontend UI for displaying and submitting messages
- ✅ IP-based identification (using localStorage)
- ✅ Markdown support for messages
- ✅ Delete functionality (requires backend)
- ⚠️ Backend API integration (needs to be implemented)

## Quick Start with Staticman

The easiest option is to use Staticman, which is already configured in `_config.yml`:

1. **Enable Staticman in `_config.yml`:**
   ```yaml
   comments:
     provider: "staticman"
   ```

2. **Update the guestbook page to use Staticman form**

3. **Deploy Staticman instance** (or use the public instance)

Would you like me to implement one of these options?

