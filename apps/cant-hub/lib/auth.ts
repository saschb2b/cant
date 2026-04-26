import { betterAuth } from "better-auth";
import { getDb } from "./db";

function createAuth() {
  return betterAuth({
    database: getDb(),
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID ?? "",
        clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
      },
      gitlab: {
        clientId: process.env.GITLAB_CLIENT_ID ?? "",
        clientSecret: process.env.GITLAB_CLIENT_SECRET ?? "",
      },
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID ?? "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      },
    },
    user: {
      additionalFields: {
        role: {
          type: "string",
          required: false,
        },
      },
    },
  });
}

type Auth = ReturnType<typeof createAuth>;

let _auth: Auth | undefined;

/**
 * Lazy initializer so module-level imports (build-time page collection,
 * RSC bundling) do not open the SQLite database. The DB is opened, and
 * better-auth migrations are run, on first access.
 */
export function getAuth(): Auth {
  if (_auth) return _auth;
  const auth = createAuth();
  _auth = auth;

  void import("better-auth/db/migration").then(async ({ getMigrations }) => {
    const { runMigrations } = await getMigrations(auth.options);
    await runMigrations();
  });

  return auth;
}
