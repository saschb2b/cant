import type { BaseChallenge } from "../../game/types";

export const docsContractsChallenges: BaseChallenge[] = [
  {
    id: "doc-001",
    category: "docs-contracts",
    difficulty: "easy",
    title: "OpenAPI spec vs hand-written docs",
    prompt: "Which approach to API documentation stays accurate over time?",
    content: {
      type: "code",
      lang: "yaml",
      left: `# Hand-written API docs (README.md)
# POST /users
# Body: { name, email, age }
# Returns: User object
#
# Note: age is optional
# Updated: March 2024`,

      right: `# openapi.yaml
paths:
  /users:
    post:
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/CreateUser"
      responses:
        "201":
          description: User created
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/User"`,
    },

    correctSide: "right",
    explanationCorrect:
      "An OpenAPI spec serves as both documentation and a machine-readable contract. Tools can validate requests against it, generate client SDKs, and render interactive docs automatically. Because it is the source of truth, it stays in sync with the actual API behavior.",
    explanationWrong:
      "Hand-written docs drift from reality almost immediately. There is no automated way to verify they match the code, so every schema change requires a manual doc update. Over time the docs become unreliable, and developers stop trusting them entirely.",
    sourceUrl: "https://swagger.io/specification/",
    sourceLabel: "OpenAPI Specification",
  },
  {
    id: "doc-002",
    category: "docs-contracts",
    difficulty: "easy",
    title: "Input validation approach",
    prompt: "Which validates API input more reliably?",
    content: {
      type: "code",
      left: `import { z } from "zod";

const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().int().positive().optional(),
});

type CreateUser = z.infer<typeof CreateUserSchema>;

export function handleCreate(body: unknown) {
  const user = CreateUserSchema.parse(body);
  return createUser(user);
}`,

      right: `interface CreateUser {
  name: string;
  email: string;
  age?: number;
}

export function handleCreate(body: any) {
  if (!body.name || !body.email) {
    throw new Error("Missing fields");
  }
  return createUser(body as CreateUser);
}`,
    },

    correctSide: "left",
    explanationCorrect:
      "Zod validates data at runtime and infers TypeScript types from the same schema. You define the shape once and get both validation and type safety. Parse errors include detailed messages showing exactly which field failed and why.",
    explanationWrong:
      "Manual runtime checks are incomplete and error-prone. They miss edge cases (empty strings, wrong types, invalid formats), and the type assertion at the end bypasses the compiler. Every new field requires another hand-written check that someone might forget.",
    sourceUrl: "https://zod.dev/",
    sourceLabel: "Zod: TypeScript-first schema validation",
  },
  {
    id: "doc-003",
    category: "docs-contracts",
    difficulty: "easy",
    title: "API version retirement",
    prompt: "Which communicates an API version change safely?",
    content: {
      type: "code",
      left: `// Server: endpoint removal

// Before: GET /api/v1/users -> 200 OK
// After:  GET /api/v1/users -> 404 Not Found`,

      right: `// Server: deprecation headers + sunset date
app.get("/api/v1/users", (req, res) => {
  res.set("Deprecation", "true");
  res.set("Sunset", "Sat, 01 Jun 2025 00:00:00 GMT");
  res.set("Link", '</api/v2/users>; rel="successor-version"');

  const users = getUsers();
  res.json(users);
});`,
    },

    correctSide: "right",
    explanationCorrect:
      "Deprecation and Sunset headers give API consumers advance notice and a clear migration path. The Link header with rel='successor-version' points to the replacement endpoint. Clients can detect these headers and log warnings automatically, giving teams time to migrate.",
    explanationWrong:
      "Silently removing an endpoint breaks every client immediately with no explanation. Consumers have no way to prepare, and support teams get flooded with bug reports. Even a simple deprecation notice in docs is better than no warning at all.",
    sourceUrl: "https://datatracker.ietf.org/doc/html/rfc8594",
    sourceLabel: "RFC 8594: The Sunset HTTP Header Field",
  },
  {
    id: "doc-004",
    category: "docs-contracts",
    difficulty: "medium",
    title: "API client development",
    prompt: "Which approach to building API clients scales better?",
    content: {
      type: "code",
      left: `// openapi-ts.config.ts
import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "./openapi.yaml",
  output: { path: "./src/api", format: "prettier" },
  plugins: ["@hey-api/client-fetch", "@hey-api/typescript"],
});

import { getUsers } from "./api";
const { data, error } = await getUsers({
  query: { page: 1, limit: 20 },
});`,

      right: `// Hand-written API client
async function getUsers(page: number, limit: number) {
  const res = await fetch(
    \`/api/users?page=\${page}&limit=\${limit}\`
  );
  if (!res.ok) throw new Error("Failed");
  return res.json() as Promise<User[]>;
}`,
    },

    correctSide: "left",
    explanationCorrect:
      "Generated SDK clients stay in sync with the API spec automatically. When the spec changes, you regenerate the client and the compiler catches every call site that needs updating. This eliminates the entire class of bugs where the client and server disagree on types.",
    explanationWrong:
      "Hand-written clients require manual updates for every API change. The type assertion (as Promise<User[]>) is unchecked, so the types can silently drift from reality. With dozens of endpoints, keeping manual clients accurate becomes a full-time maintenance burden.",
    sourceUrl: "https://heyapi.dev/",
    sourceLabel: "Hey API: OpenAPI TypeScript client generator",
  },
  {
    id: "doc-005",
    category: "docs-contracts",
    difficulty: "medium",
    title: "Request and response examples in OpenAPI",
    prompt: "Which OpenAPI spec is more useful for consumers?",
    content: {
      type: "code",
      lang: "yaml",
      left: `paths:
  /orders:
    post:
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/Order"
      responses:
        "201":
          description: Created
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Order"`,

      right: `paths:
  /orders:
    post:
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/Order"
            example:
              items: [{ sku: "WIDGET-1", qty: 2 }]
              shipping: "express"
      responses:
        "201":
          description: Order created
          content:
            application/json:
              example:
                id: "ord_abc123"
                status: "confirmed"
                items: [{ sku: "WIDGET-1", qty: 2 }]
                total: 49.98`,
    },

    correctSide: "right",
    explanationCorrect:
      "Concrete examples in OpenAPI specs let developers understand the API at a glance without reading every schema definition. Tools like Swagger UI and Redoc render these examples inline, and they can be used to generate mock servers for testing.",
    explanationWrong:
      "A spec with only schema references forces consumers to mentally assemble what a real request looks like by navigating through nested $ref definitions. This slows down onboarding and increases the chance of integration mistakes.",
    sourceUrl: "https://swagger.io/docs/specification/v3_0/adding-examples/",
    sourceLabel: "Swagger: Adding Examples",
  },
  {
    id: "doc-006",
    category: "docs-contracts",
    difficulty: "medium",
    title: "API integration testing",
    prompt: "Which testing approach catches integration issues earlier?",
    content: {
      type: "code",
      left: `// Provider-only integration test
describe("GET /users/:id", () => {
  it("returns a user", async () => {
    const res = await request(app).get("/users/1");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("name");
  });
});`,

      right: `// Consumer contract (Pact)
const interaction = {
  uponReceiving: "a request for user 1",
  withRequest: { method: "GET", path: "/users/1" },
  willRespondWith: {
    status: 200,
    body: {
      id: like(1),
      fullName: like("Alice Smith"),
      email: like("alice@example.com"),
    },
  },
};`,
    },

    correctSide: "right",
    explanationCorrect:
      "Consumer-driven contracts let each client declare exactly what fields and formats it depends on. The provider verifies these contracts in CI, so breaking changes are caught before deployment. This catches the subtle mismatches that traditional integration tests miss.",
    explanationWrong:
      "Provider-only tests verify the API works in isolation but say nothing about what consumers actually use. A provider can rename a field, pass all its own tests, and still break every client. The gap between provider tests and real consumer expectations is where integration bugs hide.",
    sourceUrl: "https://docs.pact.io/",
    sourceLabel: "Pact: Consumer-Driven Contract Testing",
  },
  {
    id: "doc-007",
    category: "docs-contracts",
    difficulty: "hard",
    title: "Changelog and breaking change communication",
    prompt: "Which changelog format helps consumers upgrade safely?",
    content: {
      type: "code",
      lang: "markdown",
      left: `## v3.0.0
- Updated user endpoints
- Fixed bugs
- Improved performance
- Changed some response formats`,

      right: `## v3.0.0 (2025-03-15)

### BREAKING CHANGES
- \`GET /users\` response: \`name\` split into
  \`firstName\` and \`lastName\`
  Migration: concatenate both fields
- \`POST /orders\` now requires \`currency\` field
  Migration: add \`"currency": "USD"\` for
  existing integrations

### Deprecated
- \`GET /users?search=\` replaced by
  \`GET /users/search\` (removal in v4.0)

### Added
- \`GET /users/:id/orders\` endpoint
- Rate limit headers on all responses`,
    },

    correctSide: "right",
    explanationCorrect:
      "A structured changelog with explicit breaking change sections and migration instructions lets consumers assess upgrade effort before starting. Listing deprecated endpoints with removal timelines gives teams a clear window to migrate without surprise breakage.",
    explanationWrong:
      "Vague changelogs like 'updated endpoints' and 'changed some response formats' force consumers to discover breaking changes by trial and error. Without migration instructions, each consumer has to reverse-engineer what changed and how to adapt, multiplying the upgrade cost across every team.",
    sourceUrl: "https://keepachangelog.com/en/1.1.0/",
    sourceLabel: "Keep a Changelog",
  },
  {
    id: "doc-008",
    category: "docs-contracts",
    difficulty: "hard",
    title: "Frontend type management",
    prompt: "Which keeps frontend types in sync with the API?",
    content: {
      type: "code",
      left: `// Frontend types
interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
}`,

      right: `// Frontend types
import type { components } from "./api-schema";

type User = components["schemas"]["User"];
// { id: number; fullName: string; email: string;
//   role: "user" | "admin" | "viewer" }`,
    },

    correctSide: "right",
    explanationCorrect:
      "Generating TypeScript types from the OpenAPI spec creates a single source of truth. When the API adds a role or renames a field, the generated types update and the compiler flags every call site that needs fixing. This moves integration errors from runtime to build time.",
    explanationWrong:
      "Manually maintained frontend types are a snapshot that drifts from reality with every API change. The compiler cannot warn you because the hand-written types always look valid. The bugs surface as undefined values, missing fields, or wrong enum variants in production.",
    sourceUrl: "https://openapi-ts.dev/",
    sourceLabel: "openapi-typescript: Generate TypeScript from OpenAPI",
  },
];
