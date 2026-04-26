import type { BaseChallenge } from "../../game/types";

export const authPatternChallenges: BaseChallenge[] = [
  {
    id: "auth-001",
    category: "auth-patterns",
    difficulty: "easy",
    title: "Token placement in requests",
    prompt: "Which request sends the token more securely?",
    content: {
      type: "code",
      left: `// Token in Authorization header
fetch("/api/users", {
  headers: {
    Authorization: "Bearer eyJhbGciOi...",
    "Content-Type": "application/json",
  },
});`,
      right: `// Token in query string
fetch(
  "/api/users?token=eyJhbGciOi..."
);`,
    },
    correctSide: "left",
    explanationCorrect:
      "The Authorization header is the standard place for bearer tokens. Headers are not stored in browser history, proxy logs, or referrer URLs. They are also excluded from caching by default, reducing the risk of credential leakage.",
    explanationWrong:
      "Query string parameters appear in browser history, server access logs, referrer headers sent to third parties, and can be cached by proxies. This makes tokens in URLs easy to extract and replay.",
    sourceUrl: "https://datatracker.ietf.org/doc/html/rfc6750#section-2.1",
    sourceLabel: "RFC 6750: Bearer Token Usage",
  },
  {
    id: "auth-002",
    category: "auth-patterns",
    difficulty: "easy",
    title: "Third-party API access",
    prompt: "Which approach is safer for third-party integrations?",
    content: {
      type: "code",
      left: `// Shared API key for third party
const config = {
  apiKey: "sk-live-abc123",
};

thirdPartySDK.init(config);`,
      right: `// OAuth 2.0 for third-party access
const token = await oauth.authorize({
  clientId: "app-123",
  scope: "read:repos",
  redirectUri: "/callback",
});

thirdPartySDK.init({ token });`,
    },
    correctSide: "right",
    explanationCorrect:
      "OAuth 2.0 grants scoped, time-limited tokens that can be revoked without rotating your primary credentials. Users can see exactly what permissions they granted and revoke access at any time.",
    explanationWrong:
      "Sharing a single API key gives the third party full access to your account. If the key leaks, all integrations are compromised. You cannot limit scope per integration or revoke access for one consumer without breaking all of them.",
    sourceUrl: "https://datatracker.ietf.org/doc/html/rfc6749#section-1.1",
    sourceLabel: "RFC 6749: OAuth 2.0 Authorization Framework",
  },
  {
    id: "auth-003",
    category: "auth-patterns",
    difficulty: "easy",
    title: "JWT claim payload size",
    prompt: "Which JWT payload follows best practices?",
    content: {
      type: "code",
      left: `// JWT claims
const payload = {
  sub: "user-42",
  role: "editor",
  org: "acme",
  iat: 1710000000,
  exp: 1710003600,
};
// ~150 bytes encoded`,
      right: `// JWT claims
const payload = {
  sub: "user-42",
  name: "Jane Doe",
  email: "jane@example.com",
  avatar: "https://cdn.example.com/...",
  permissions: ["read", "write", ...],
  preferences: { theme: "dark", ... },
  address: { street: "123 Main St" },
};
// ~1.2 KB encoded`,
    },
    correctSide: "left",
    explanationCorrect:
      "JWTs are sent with every request, so keeping them small matters. Store only identifiers and essential authorization data (sub, role, org, exp). Fetch user profile details from a database or cache when needed.",
    explanationWrong:
      "Large JWTs increase bandwidth on every API call, may exceed header size limits (8 KB in many servers), and expose personal data in a format that is only base64-encoded, not encrypted. Stale profile data also lingers until the token expires.",
    sourceUrl: "https://datatracker.ietf.org/doc/html/rfc7519#section-4",
    sourceLabel: "RFC 7519: JWT Claims",
  },
  {
    id: "auth-004",
    category: "auth-patterns",
    difficulty: "medium",
    title: "Token refresh strategy",
    prompt: "Which token refresh pattern is more secure?",
    content: {
      type: "code",
      left: `// Long-lived access token
const token = jwt.sign(
  { sub: userId },
  SECRET,
  { expiresIn: "30d" }
);`,
      right: `// Refresh token rotation
const access = jwt.sign(
  { sub: userId },
  SECRET,
  { expiresIn: "15m" }
);
const refresh = generateOpaqueToken();
await db.storeRefresh(refresh, userId);`,
    },
    correctSide: "right",
    explanationCorrect:
      "Short-lived access tokens (15 minutes) limit the damage window if a token is stolen. Refresh token rotation issues a new refresh token on each use and invalidates the old one, so a stolen refresh token can only be used once before detection.",
    explanationWrong:
      "A 30-day access token gives an attacker a full month of access if compromised. Without rotation or server-side checks, there is no way to revoke it early. JWTs are stateless, so the server cannot invalidate them before expiry.",
    sourceUrl:
      "https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics#name-refresh-token-protection",
    sourceLabel: "OAuth Security Best Practices: Refresh Tokens",
  },
  {
    id: "auth-005",
    category: "auth-patterns",
    difficulty: "medium",
    title: "Rate limiting strategy",
    prompt: "Which rate limiting approach handles bursts more fairly?",
    content: {
      type: "code",
      left: `// Fixed window rate limiter
const windowStart = Math.floor(
  Date.now() / 60000
) * 60000;
const key = \`rate:\${ip}:\${windowStart}\`;
const count = await redis.incr(key);
await redis.expire(key, 60);

if (count > 100) {
  return res.status(429).send("Too many requests");
}`,
      right: `// Sliding window rate limiter
const now = Date.now();
const windowMs = 60000;
await redis.zremrangebyscore(
  \`rate:\${ip}\`, 0, now - windowMs
);
await redis.zadd(\`rate:\${ip}\`, now, uuid());
const count = await redis.zcard(\`rate:\${ip}\`);

if (count > 100) {
  return res.status(429).send("Too many requests");
}`,
    },
    correctSide: "right",
    explanationCorrect:
      "Sliding window rate limiting tracks each request timestamp, so the limit applies smoothly over any 60-second period. This prevents the boundary burst problem where a client sends 100 requests at 0:59 and another 100 at 1:01, effectively doubling their rate.",
    explanationWrong:
      "Fixed window counters reset at sharp boundaries. A client can send 100 requests at the end of one window and 100 at the start of the next, hitting 200 requests in a few seconds. This burst can overwhelm your API despite the rate limit.",
    sourceUrl:
      "https://cloud.google.com/architecture/rate-limiting-strategies-techniques",
    sourceLabel: "Google Cloud: Rate Limiting Strategies",
  },
  {
    id: "auth-006",
    category: "auth-patterns",
    difficulty: "medium",
    title: "Authorization model",
    prompt: "Which authorization model is more flexible?",
    content: {
      type: "code",
      left: `// Role-based access control
function canEdit(user: User) {
  return user.role === "admin"
      || user.role === "editor";
}`,
      right: `// Scope-based access control
function canEdit(user: User, doc: Doc) {
  const scopes = user.scopes;
  if (!scopes.includes("docs:write"))
    return false;
  if (scopes.includes("docs:write:all"))
    return true;
  return doc.orgId === user.orgId;
}`,
    },
    correctSide: "right",
    explanationCorrect:
      "Scope-based authorization decouples permissions from role names. You can grant granular permissions like docs:write or docs:write:all without changing code. Adding a new permission is a data change, not a code change, making it easier to evolve access policies.",
    explanationWrong:
      "Pure role-based checks couple permissions to role names in code. When requirements change (e.g., editors limited to their org), you must update every role check. Roles also lack granularity: you cannot give someone write access to docs but not settings without creating a new role.",
    sourceUrl: "https://datatracker.ietf.org/doc/html/rfc6749#section-3.3",
    sourceLabel: "RFC 6749: OAuth 2.0 Scope",
  },
  {
    id: "auth-007",
    category: "auth-patterns",
    difficulty: "hard",
    title: "CORS configuration",
    prompt: "Which CORS setup is safe for a credentialed API?",
    content: {
      type: "code",
      left: `// Wildcard CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT"],
  credentials: true,
}));`,
      right: `// Explicit origin allowlist
const ALLOWED = new Set([
  "https://app.example.com",
  "https://admin.example.com",
]);

app.use(cors({
  origin: (o, cb) =>
    cb(null, ALLOWED.has(o)),
  methods: ["GET", "POST", "PUT"],
  credentials: true,
}));`,
    },
    correctSide: "right",
    explanationCorrect:
      "An explicit allowlist ensures only your trusted frontends can make credentialed requests. Browsers enforce that credentials: true cannot pair with origin: *, so the wildcard version silently breaks cookie-based auth. The allowlist approach works correctly and limits exposure to CSRF from untrusted origins.",
    explanationWrong:
      "Using origin: * with credentials: true is invalid per the CORS spec. Browsers will block the response, and cookies or auth headers will not be sent. Even if you remove credentials, a wildcard origin lets any website make requests to your API, which is a security risk for sensitive endpoints.",
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS#credentialed_requests_and_wildcards",
    sourceLabel: "MDN: CORS Credentialed Requests",
  },
  {
    id: "auth-008",
    category: "auth-patterns",
    difficulty: "hard",
    title: "Password hashing",
    prompt: "Which password storage approach is secure?",
    content: {
      type: "code",
      left: `import crypto from "crypto";

// MD5 hash
async function hashPassword(pw: string) {
  return crypto
    .createHash("md5")
    .update(pw)
    .digest("hex");
}`,
      right: `import bcrypt from "bcrypt";

// bcrypt hash
async function hashPassword(pw: string) {
  const saltRounds = 12;
  return bcrypt.hash(pw, saltRounds);
}`,
    },
    correctSide: "right",
    explanationCorrect:
      "bcrypt is purpose-built for password hashing. It includes a random salt per password, uses an adaptive cost factor that makes brute force slow, and is resistant to GPU acceleration. A cost factor of 12 takes about 250ms per hash, making large-scale cracking impractical.",
    explanationWrong:
      "MD5 is a fast general-purpose hash, not a password hash. It has no built-in salt, so identical passwords produce identical hashes. A modern GPU can compute billions of MD5 hashes per second, and precomputed rainbow tables can crack common passwords instantly.",
    sourceUrl:
      "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html",
    sourceLabel: "OWASP: Password Storage Cheat Sheet",
  },
];
