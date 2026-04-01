# Local Auth Setup

## Quick start (no OAuth needed)

1. Seed the database with test accounts:

```bash
cd apps/cant-hub
pnpm db:seed
```

2. Start the dev server:

```bash
pnpm dev:hub
```

3. Open the browser console and set a session cookie to log in as a test user:

```js
// Log in as recruiter
document.cookie = "better-auth.session_token=test-session-recruiter; path=/";

// Log in as developer
document.cookie = "better-auth.session_token=test-session-developer; path=/";
```

4. Refresh the page.

## Resetting the database

Delete the SQLite file and re-seed:

```bash
rm apps/cant-hub/data/auth.db
cd apps/cant-hub && pnpm db:seed
```

## Setting up real OAuth apps (for integration testing)

### GitHub

1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Set Homepage URL to `http://localhost:3000`
4. Set Authorization callback URL to `http://localhost:3000/api/auth/callback/github`
5. Copy Client ID and Client Secret into `.env`

### Google

1. Go to https://console.cloud.google.com/apis/credentials
2. Create an OAuth 2.0 Client ID (Web application)
3. Add `http://localhost:3000` to Authorized JavaScript origins
4. Add `http://localhost:3000/api/auth/callback/google` to Authorized redirect URIs
5. Copy Client ID and Client Secret into `.env`

### GitLab

1. Go to https://gitlab.com/-/user_settings/applications
2. Set Redirect URI to `http://localhost:3000/api/auth/callback/gitlab`
3. Select scopes: `read_user`, `openid`, `profile`, `email`
4. Copy Application ID and Secret into `.env`

### .env template

```env
BETTER_AUTH_SECRET="any-random-string"
BETTER_AUTH_URL="http://localhost:3000"
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
GITLAB_CLIENT_ID="..."
GITLAB_CLIENT_SECRET="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```
