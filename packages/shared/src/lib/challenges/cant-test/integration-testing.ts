import type { BaseChallenge } from "../../game/types";

export const integrationTestingChallenges: BaseChallenge[] = [
  {
    id: "int-001",
    category: "integration-testing",
    difficulty: "easy",
    title: "Database cleanup between tests",
    prompt: "Which approach cleans up test data more reliably?",
    content: {
      type: "code",

      left: `// test/users.integration.test.ts
beforeEach(async () => {
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
});

it("creates a user", async () => {
  const user = await createUser({ name: "Alice" });
  expect(user.name).toBe("Alice");

  const count = await prisma.user.count();
  expect(count).toBe(1);
});`,

      right: `// test/users.integration.test.ts
afterEach(async () => {
  await prisma.user.deleteMany();
});

it("creates a user", async () => {
  const user = await createUser({ name: "Alice" });
  expect(user.name).toBe("Alice");

  const count = await prisma.user.count();
  expect(count).toBe(1);
});`,
    },

    correctSide: "left",
    explanationCorrect:
      "Cleaning up before each test guarantees a known starting state regardless of whether a previous test crashed, timed out, or was skipped. Using beforeEach with ordered deletions (respecting foreign key constraints) means every test begins with an empty database, making failures reproducible.",
    explanationWrong:
      "Relying on afterEach for cleanup is fragile. If a test fails or the process exits unexpectedly, the cleanup never runs and leftover data leaks into subsequent tests. This creates flaky, order-dependent test suites that pass individually but fail when run together.",
    sourceUrl:
      "https://www.prisma.io/docs/orm/prisma-client/testing/integration-testing",
    sourceLabel: "Prisma Docs: Integration Testing",
  },
  {
    id: "int-002",
    category: "integration-testing",
    difficulty: "easy",
    title: "Test isolation with separate data",
    prompt: "Which strategy isolates test data more effectively?",
    content: {
      type: "code",

      left: `// test/orders.integration.test.ts
const SHARED_USER_ID = "user-global-1";

beforeAll(async () => {
  await prisma.user.create({
    data: { id: SHARED_USER_ID, name: "Shared" },
  });
});

it("places an order", async () => {
  const order = await placeOrder(SHARED_USER_ID, {
    item: "Book",
  });
  expect(order.userId).toBe(SHARED_USER_ID);
});

it("lists orders for user", async () => {
  const orders = await listOrders(SHARED_USER_ID);
  expect(orders.length).toBeGreaterThan(0);
});`,

      right: `// test/orders.integration.test.ts
function createTestUser(name: string) {
  return prisma.user.create({
    data: { name },
  });
}

it("places an order", async () => {
  const user = await createTestUser("Alice");
  const order = await placeOrder(user.id, {
    item: "Book",
  });
  expect(order.userId).toBe(user.id);
});

it("lists orders for user", async () => {
  const user = await createTestUser("Bob");
  const orders = await listOrders(user.id);
  expect(orders).toHaveLength(0);
});`,
    },

    correctSide: "right",
    explanationCorrect:
      "Creating fresh, unique data for every test case eliminates hidden coupling between tests. Each test sets up exactly what it needs and can assert precise expectations. A factory function keeps the setup concise while generating distinct records.",
    explanationWrong:
      "Sharing a single user across tests introduces order dependency. The second test assumes the first test already created an order, so reordering or running tests in isolation causes failures. Shared mutable state is one of the most common sources of flaky integration tests.",
    sourceUrl: "https://martinfowler.com/articles/nonDeterminism.html",
    sourceLabel: "Martin Fowler: Eradicating Non-Determinism in Tests",
  },
  {
    id: "int-003",
    category: "integration-testing",
    difficulty: "medium",
    title: "API testing approach",
    prompt: "Which approach tests the API layer more thoroughly?",
    content: {
      type: "code",

      left: `// test/api.integration.test.ts
import request from "supertest";
import { app } from "../src/app";

it("creates and retrieves a product", async () => {
  const create = await request(app)
    .post("/api/products")
    .send({ name: "Widget", price: 9.99 })
    .expect(201);

  const productId = create.body.id;

  const get = await request(app)
    .get(\`/api/products/\${productId}\`)
    .expect(200);

  expect(get.body.name).toBe("Widget");
  expect(get.body.price).toBe(9.99);
});`,

      right: `// test/api.integration.test.ts
import { createProduct, getProduct } from "../src/services";

it("creates and retrieves a product", async () => {
  const product = await createProduct({
    name: "Widget",
    price: 9.99,
  });

  const found = await getProduct(product.id);

  expect(found.name).toBe("Widget");
  expect(found.price).toBe(9.99);
});`,
    },

    correctSide: "left",
    explanationCorrect:
      "Using supertest to make HTTP requests against the Express app exercises the full middleware stack: routing, body parsing, validation, error handling, and serialization. This catches integration issues that calling service functions directly would miss, such as incorrect status codes, missing headers, or middleware ordering bugs.",
    explanationWrong:
      "Calling service functions directly only tests the business logic layer. It skips HTTP routing, middleware, request validation, and response serialization. A test that passes at the service level can still fail in production because a route was misconfigured or middleware rejected the request.",
    sourceUrl: "https://github.com/ladjs/supertest#readme",
    sourceLabel: "Supertest: HTTP assertions for Node.js",
  },
  {
    id: "int-004",
    category: "integration-testing",
    difficulty: "medium",
    title: "Test database seeding",
    prompt: "Which seeding strategy works better for integration tests?",
    content: {
      type: "code",

      left: `// test/seed.ts
export async function seedDatabase() {
  await prisma.category.createMany({
    data: [
      { id: "cat-1", name: "Electronics" },
      { id: "cat-2", name: "Books" },
      { id: "cat-3", name: "Clothing" },
    ],
  });
  await prisma.product.createMany({
    data: [
      { name: "Phone", categoryId: "cat-1" },
      { name: "Novel", categoryId: "cat-2" },
      { name: "Shirt", categoryId: "cat-3" },
      { name: "Laptop", categoryId: "cat-1" },
    ],
  });
}

// Used once in globalSetup for all tests`,

      right: `// test/factories.ts
export function createCategory(overrides = {}) {
  return prisma.category.create({
    data: { name: "Test Category", ...overrides },
  });
}

export function createProduct(
  categoryId: string,
  overrides = {}
) {
  return prisma.product.create({
    data: {
      name: "Test Product",
      categoryId,
      ...overrides,
    },
  });
}

// Each test calls the factories it needs`,
    },

    correctSide: "right",
    explanationCorrect:
      "Factory functions let each test create only the data it needs with sensible defaults. Tests stay independent, readable, and easy to debug. When a test fails, you can see its entire data setup inline rather than searching through a shared seed file.",
    explanationWrong:
      "A shared seed script loads a fixed dataset that every test depends on. Adding a product or changing a category name can break unrelated tests. Over time the seed file grows to accommodate every test scenario, becoming brittle and hard to maintain. Tests also become order-dependent if they mutate the shared data.",
    sourceUrl: "https://thoughtbot.com/blog/factory-bot-for-beginners",
    sourceLabel: "Thoughtbot: Why Factories Over Fixtures",
  },
  {
    id: "int-005",
    category: "integration-testing",
    difficulty: "medium",
    title: "Service boundary testing",
    prompt: "Which approach tests a service boundary more effectively?",
    content: {
      type: "code",

      left: `// test/payment.integration.test.ts
it("processes a payment", async () => {
  const charge = jest.fn().mockResolvedValue({
    id: "ch_123",
    status: "succeeded",
  });
  const stripeClient = { charges: { create: charge } };

  const result = await processPayment(
    stripeClient as any,
    { amount: 5000, currency: "usd" }
  );

  expect(result.status).toBe("succeeded");
  expect(charge).toHaveBeenCalledWith({
    amount: 5000,
    currency: "usd",
  });
});`,

      right: `// test/payment.integration.test.ts
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_TEST_KEY!);

it("processes a payment", async () => {
  const result = await processPayment(stripe, {
    amount: 5000,
    currency: "usd",
    source: "tok_visa",
  });

  expect(result.status).toBe("succeeded");
  expect(result.amount).toBe(5000);
});`,
    },

    correctSide: "right",
    explanationCorrect:
      "For integration tests at service boundaries, using the real client against a sandbox or test environment verifies that your code works with the actual API contract. Stripe provides test-mode API keys and tokens (like tok_visa) specifically for this purpose. This catches serialization issues, API version mismatches, and incorrect parameter names.",
    explanationWrong:
      "Mocking the entire Stripe client turns this into a unit test that only verifies your code calls the mock with expected arguments. It cannot detect breaking changes in the API, incorrect field names, or serialization bugs. Integration tests should exercise real service boundaries to catch issues that mocks hide.",
    sourceUrl: "https://docs.stripe.com/testing",
    sourceLabel: "Stripe Docs: Testing",
  },
  {
    id: "int-006",
    category: "integration-testing",
    difficulty: "hard",
    title: "Transaction rollback for test cleanup",
    prompt: "Which cleanup strategy handles complex data relationships better?",
    content: {
      type: "code",

      left: `// test/setup.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

beforeEach(async () => {
  await prisma.$executeRaw\`
    BEGIN;
    SAVEPOINT test_start;
  \`;
});

afterEach(async () => {
  await prisma.$executeRaw\`
    ROLLBACK TO SAVEPOINT test_start;
  \`;
});

export { prisma };`,

      right: `// test/setup.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

beforeEach(async () => {
  const tables = await prisma.$queryRaw<
    { tablename: string }[]
  >\`
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public'
  \`;

  for (const { tablename } of tables) {
    await prisma.$executeRawUnsafe(
      \`TRUNCATE TABLE "\${tablename}" CASCADE\`
    );
  }
});

export { prisma };`,
    },

    correctSide: "left",
    explanationCorrect:
      "Wrapping each test in a transaction with a savepoint and rolling back afterward is extremely fast because no data is ever committed to disk. It handles arbitrarily complex data relationships without needing to know the table structure or deletion order. This pattern scales well as the schema grows.",
    explanationWrong:
      "Truncating every table before each test is slow, especially as the database grows. The CASCADE option can trigger unexpected side effects, and querying pg_tables adds overhead. For large schemas this becomes a significant bottleneck. Transaction rollback achieves the same isolation with near-zero cost.",
    sourceUrl: "https://www.postgresql.org/docs/current/sql-savepoint.html",
    sourceLabel: "PostgreSQL Docs: SAVEPOINT",
  },
  {
    id: "int-007",
    category: "integration-testing",
    difficulty: "hard",
    title: "External dependency management in tests",
    prompt: "Which approach handles external dependencies more reliably?",
    content: {
      type: "code",

      left: `// test/db.integration.test.ts
import { Client } from "pg";

const client = new Client({
  host: "localhost",
  port: 5432,
  database: "testdb",
  user: "postgres",
  password: "postgres",
});

beforeAll(async () => {
  await client.connect();
  await client.query("DELETE FROM users");
});

afterAll(async () => {
  await client.end();
});

it("inserts a user", async () => {
  await client.query(
    "INSERT INTO users (name) VALUES ($1)",
    ["Alice"]
  );
  const res = await client.query("SELECT * FROM users");
  expect(res.rows).toHaveLength(1);
});`,

      right: `// test/db.integration.test.ts
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { Client } from "pg";

let container: StartedPostgreSqlContainer;
let client: Client;

beforeAll(async () => {
  container = await new PostgreSqlContainer()
    .withDatabase("testdb")
    .start();
  client = new Client({
    connectionString: container.getConnectionUri(),
  });
  await client.connect();
  await client.query(\`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY, name TEXT
    )
  \`);
}, 30_000);

afterAll(async () => {
  await client.end();
  await container.stop();
});

it("inserts a user", async () => {
  await client.query(
    "INSERT INTO users (name) VALUES ($1)",
    ["Alice"]
  );
  const res = await client.query("SELECT * FROM users");
  expect(res.rows).toHaveLength(1);
});`,
    },

    correctSide: "right",
    explanationCorrect:
      "Testcontainers spins up a real PostgreSQL instance in Docker for each test suite. Every run gets a fresh, isolated database with no leftover state. There is no dependency on a pre-configured local database, and CI pipelines work without extra setup steps. The container is torn down automatically after the tests complete.",
    explanationWrong:
      "Connecting to a shared local database assumes the database exists, has the correct schema, and is not being used by another test run. This breaks in CI without additional provisioning scripts and can cause conflicts when developers run tests concurrently. Hardcoded credentials also make the setup rigid and environment-specific.",
    sourceUrl:
      "https://testcontainers.com/guides/getting-started-with-testcontainers-for-nodejs/",
    sourceLabel: "Testcontainers: Getting Started with Node.js",
  },
  {
    id: "int-008",
    category: "integration-testing",
    difficulty: "hard",
    title: "End-to-end test scope",
    prompt: "Which testing approach verifies a user workflow more effectively?",
    content: {
      type: "code",

      left: `// test/checkout.e2e.test.ts
it("completes the checkout flow", async () => {
  const user = await createTestUser();
  const token = await loginUser(user);

  const cart = await request(app)
    .post("/api/cart/items")
    .set("Authorization", \`Bearer \${token}\`)
    .send({ productId: "prod-1", quantity: 2 })
    .expect(200);

  const order = await request(app)
    .post("/api/orders")
    .set("Authorization", \`Bearer \${token}\`)
    .send({ cartId: cart.body.id })
    .expect(201);

  const status = await request(app)
    .get(\`/api/orders/\${order.body.id}\`)
    .set("Authorization", \`Bearer \${token}\`)
    .expect(200);

  expect(status.body.status).toBe("confirmed");
  expect(status.body.items).toHaveLength(1);
});`,

      right: `// test/checkout.e2e.test.ts
it("adds item to cart", async () => {
  const user = await createTestUser();
  const token = await loginUser(user);

  await request(app)
    .post("/api/cart/items")
    .set("Authorization", \`Bearer \${token}\`)
    .send({ productId: "prod-1", quantity: 2 })
    .expect(200);
});

it("creates an order from cart", async () => {
  const cartId = "pre-seeded-cart-1";

  await request(app)
    .post("/api/orders")
    .send({ cartId })
    .expect(201);
});

it("retrieves order details", async () => {
  const orderId = "pre-seeded-order-1";

  await request(app)
    .get(\`/api/orders/\${orderId}\`)
    .expect(200);
});`,
    },

    correctSide: "left",
    explanationCorrect:
      "A single test that walks through the full checkout flow (add to cart, place order, verify order) catches integration issues between steps. It verifies that the authentication token, cart ID, and order ID flow correctly across multiple API calls. This mirrors how a real user interacts with the system.",
    explanationWrong:
      "Splitting the workflow into isolated tests with pre-seeded data skips the connections between steps. The second test never proves that an order can actually be created from a cart built by the first endpoint. Pre-seeded IDs also hide data-flow bugs. When testing a user workflow, the value lies in verifying the entire chain works together.",
    sourceUrl: "https://martinfowler.com/bliki/BroadStackTest.html",
    sourceLabel: "Martin Fowler: Broad Stack Tests",
  },
];
