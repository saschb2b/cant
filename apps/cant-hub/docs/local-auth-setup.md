# Local Auth Setup

The screening feature (sign-in, dashboard, candidate flow) is hidden behind a feature flag. It is disabled in production by default and must be opted into for local development.

## Enabling the feature

Add this to `apps/cant-hub/.env.local`:

```env
NEXT_PUBLIC_SCREENING_ENABLED=true
```

Without this flag, the proxy returns 404 for `/sign-in`, `/dashboard/*`, `/onboarding/*`, and `/s/*`, and the user menu in the header is hidden. Production deployments leave it unset.

## Quick start (no OAuth needed)

1. Start the dev server:

```bash
pnpm dev:hub
```

2. Log in as a test user by visiting one of these URLs:

- **Recruiter**: http://localhost:3000/api/dev-login?role=recruiter
- **Developer**: http://localhost:3000/api/dev-login?role=developer
- **New user** (no role, triggers onboarding): http://localhost:3000/api/dev-login?role=new

This creates a real user and session in the database and sets a signed session cookie. You'll be redirected to the appropriate page.

3. To sign out, click the avatar in the header and select "Sign out".

## Resetting the database

Delete the SQLite file and restart:

```bash
rm apps/cant-hub/data/auth.db
```

The database and tables are created automatically on first request.

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
