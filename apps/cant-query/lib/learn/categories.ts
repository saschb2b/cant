import type { ChallengeCategory } from "./types";

/** Canonical display order of challenge categories. */
export const CATEGORY_ORDER: ChallengeCategory[] = [
  // Fundamentals
  "rest-api-design",
  "graphql-patterns",
  "websockets-realtime",
  // Security & Reliability
  "auth-patterns",
  "error-handling",
  // Client Patterns
  "api-consumption",
  "docs-contracts",
];

/** Human-readable labels for each challenge category. */
export const CATEGORY_LABELS: Record<ChallengeCategory, string> = {
  "rest-api-design": "REST API Design",
  "graphql-patterns": "GraphQL Patterns",
  "websockets-realtime": "WebSockets & Real-time",
  "auth-patterns": "Authentication & Authorization",
  "error-handling": "Error Handling",
  "api-consumption": "API Consumption",
  "docs-contracts": "Documentation & Contracts",
};

/** Logical grouping of categories for sidebar navigation. */
export interface CategorySection {
  label: string;
  categories: ChallengeCategory[];
}

export const CATEGORY_SECTIONS: CategorySection[] = [
  {
    label: "Fundamentals",
    categories: ["rest-api-design", "graphql-patterns", "websockets-realtime"],
  },
  {
    label: "Security & Reliability",
    categories: ["auth-patterns", "error-handling"],
  },
  {
    label: "Client Patterns",
    categories: ["api-consumption", "docs-contracts"],
  },
];

/** Recommended category order for newcomers starting from scratch. */
export const LEARNING_PATH: ChallengeCategory[] = [
  "rest-api-design",
  "error-handling",
  "auth-patterns",
  "api-consumption",
  "graphql-patterns",
];

/** Short description for each category, shown on the learn overview. */
export const CATEGORY_DESCRIPTIONS: Record<ChallengeCategory, string> = {
  "rest-api-design":
    "Resource naming, HTTP methods, status codes, pagination, and versioning. You'll hit this when your endpoints grow inconsistent, clients break on API changes, or you can't decide between PUT and PATCH.",
  "graphql-patterns":
    "Query structure, mutations, fragments, N+1 problems, and when GraphQL beats REST. You'll hit this when nested resolvers slow your API to a crawl or clients over-fetch data they never use.",
  "websockets-realtime":
    "When to use WebSockets vs SSE vs polling, connection lifecycle, reconnection, and message design. You'll hit this when you need live updates but long-polling is crushing your server or messages arrive out of order.",
  "auth-patterns":
    "API keys vs OAuth vs JWT, token placement, scopes, rate limiting, and permission models. You'll hit this when tokens leak through query strings, JWTs grow too large, or rate limits punish legitimate users.",
  "error-handling":
    "Error response structure, retry strategies, idempotency, timeouts, and graceful degradation. You'll hit this when clients can't tell a validation error from a server crash, or retries cause duplicate orders.",
  "api-consumption":
    "Caching strategies, request deduplication, batching, optimistic updates, and loading states. You'll hit this when the same endpoint is called five times on one page load or stale data lingers after a mutation.",
  "docs-contracts":
    "OpenAPI vs hand-written docs, schema validation, versioning communication, and SDK generation. You'll hit this when frontend and backend disagree on the shape of a response, or API docs are perpetually outdated.",
};
