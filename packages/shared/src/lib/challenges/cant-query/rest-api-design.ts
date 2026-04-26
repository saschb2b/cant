import type { BaseChallenge } from "../../game/types";

export const restApiDesignChallenges: BaseChallenge[] = [
  {
    id: "rest-001",
    category: "rest-api-design",
    difficulty: "easy",
    title: "Resource naming conventions",
    prompt: "Which URL pattern follows REST naming conventions?",
    content: {
      type: "code",

      left: `// Express route handlers
app.get("/getUsers", (req, res) => {
  const users = db.findAllUsers();
  res.json(users);
});

app.post("/createUser", (req, res) => {
  const user = db.insertUser(req.body);
  res.status(201).json(user);
});

app.delete("/deleteUser/:id", (req, res) => {
  db.removeUser(req.params.id);
  res.status(204).send();
});`,

      right: `// Express route handlers
app.get("/users", (req, res) => {
  const users = db.findAllUsers();
  res.json(users);
});

app.post("/users", (req, res) => {
  const user = db.insertUser(req.body);
  res.status(201).json(user);
});

app.delete("/users/:id", (req, res) => {
  db.removeUser(req.params.id);
  res.status(204).send();
});`,
    },

    correctSide: "right",
    explanationCorrect:
      "RESTful URLs use plural nouns to represent resources, not verbs. The HTTP method (GET, POST, DELETE) already communicates the action being performed. Using /users as the resource path keeps the API consistent and predictable.",
    explanationWrong:
      "Using verbs like /getUsers, /createUser, and /deleteUser duplicates information already conveyed by the HTTP method. This pattern leads to inconsistent naming across teams and makes the API harder to discover. REST treats URLs as resource identifiers, not action descriptions.",
    sourceUrl: "https://restfulapi.net/resource-naming/",
    sourceLabel: "RESTful API: Resource Naming",
  },
  {
    id: "rest-002",
    category: "rest-api-design",
    difficulty: "easy",
    title: "HTTP methods for reading data",
    prompt: "Which approach correctly retrieves a resource?",
    content: {
      type: "code",

      left: `// Next.js API route
// POST /api/products/search
export async function POST(req: Request) {
  const { id } = await req.json();
  const product = await db.product.findUnique({
    where: { id },
  });
  return Response.json(product);
}

// Client
const res = await fetch("/api/products/search", {
  method: "POST",
  body: JSON.stringify({ id: "abc-123" }),
});`,

      right: `// Next.js API route
// GET /api/products/[id]
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const product = await db.product.findUnique({
    where: { id: params.id },
  });
  return Response.json(product);
}

// Client
const res = await fetch("/api/products/abc-123");`,
    },

    correctSide: "right",
    explanationCorrect:
      "GET is the correct HTTP method for retrieving resources. GET requests are cacheable, bookmarkable, and safe (they do not modify server state). Browsers and CDNs can cache GET responses, which improves performance significantly.",
    explanationWrong:
      "Using POST to read data defeats HTTP caching because POST responses are not cached by default. It also violates the semantic meaning of POST, which indicates a state-changing operation. Intermediaries like CDNs and proxies cannot optimize POST requests the way they optimize GET.",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET",
    sourceLabel: "MDN: GET method",
  },
  {
    id: "rest-003",
    category: "rest-api-design",
    difficulty: "easy",
    title: "Status codes for resource creation",
    prompt:
      "Which response status code is appropriate after creating a resource?",
    content: {
      type: "code",

      left: `// Express: create a new order
app.post("/orders", async (req, res) => {
  const order = await db.order.create({
    data: req.body,
  });

  res.status(201).json({
    id: order.id,
    status: order.status,
    createdAt: order.createdAt,
  });
});

// Response: 201 Created
// { "id": "ord-42", "status": "pending", ... }`,

      right: `// Express: create a new order
app.post("/orders", async (req, res) => {
  const order = await db.order.create({
    data: req.body,
  });

  res.status(200).json({
    id: order.id,
    status: order.status,
    createdAt: order.createdAt,
  });
});

// Response: 200 OK
// { "id": "ord-42", "status": "pending", ... }`,
    },

    correctSide: "left",
    explanationCorrect:
      "HTTP 201 Created is the correct status code when a new resource has been successfully created. It signals to clients and intermediaries that the request resulted in a new resource. Pairing it with a Location header pointing to the new resource is also a best practice.",
    explanationWrong:
      "Returning 200 OK after creating a resource is technically valid but loses semantic meaning. Clients cannot distinguish between a successful read and a successful creation. Automated tools, API testing frameworks, and documentation generators rely on proper status codes to understand behavior.",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201",
    sourceLabel: "MDN: 201 Created",
  },
  {
    id: "rest-004",
    category: "rest-api-design",
    difficulty: "medium",
    title: "Partial updates with PUT vs PATCH",
    prompt: "Which HTTP method is correct for a partial update?",
    content: {
      type: "code",

      left: `// PUT /api/users/42
// Client sends only the fields to update
const res = await fetch("/api/users/42", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "new@example.com",
  }),
});

// Server handler
app.put("/users/:id", async (req, res) => {
  // Replaces the entire resource
  await db.user.update({
    where: { id: req.params.id },
    data: req.body,
  });
});`,

      right: `// PATCH /api/users/42
// Client sends only the fields to update
const res = await fetch("/api/users/42", {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "new@example.com",
  }),
});

// Server handler
app.patch("/users/:id", async (req, res) => {
  // Merges with the existing resource
  await db.user.update({
    where: { id: req.params.id },
    data: req.body,
  });
});`,
    },

    correctSide: "right",
    explanationCorrect:
      "PATCH is designed for partial updates where you send only the fields that changed. PUT, by definition, replaces the entire resource. When you only need to update an email address, PATCH communicates that intent clearly and avoids accidentally nullifying other fields.",
    explanationWrong:
      "PUT semantically means 'replace the entire resource at this URL.' Sending a partial payload with PUT is misleading. A strict REST server receiving a PUT with only { email } would be correct to set all other fields to null, since PUT implies a full replacement.",
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PATCH",
    sourceLabel: "MDN: PATCH method",
  },
  {
    id: "rest-005",
    category: "rest-api-design",
    difficulty: "medium",
    title: "Pagination strategy",
    prompt: "Which pagination strategy handles large datasets better?",
    content: {
      type: "code",

      left: `// Offset pagination
// GET /api/posts?page=50&limit=20

app.get("/posts", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const posts = await db.post.findMany({
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  res.json({ data: posts, page, limit });
});`,

      right: `// Cursor-based pagination
// GET /api/posts?cursor=abc123&limit=20

app.get("/posts", async (req, res) => {
  const { cursor, limit = "20" } = req.query;
  const take = parseInt(limit);

  const posts = await db.post.findMany({
    take,
    ...(cursor && {
      skip: 1,
      cursor: { id: cursor },
    }),
    orderBy: { createdAt: "desc" },
  });

  const nextCursor = posts[posts.length - 1]?.id;
  res.json({ data: posts, nextCursor });
});`,
    },

    correctSide: "right",
    explanationCorrect:
      "Cursor-based pagination performs consistently regardless of dataset size. The database seeks directly to the cursor position instead of counting and skipping rows. It also avoids the problem of missing or duplicated items when records are inserted or deleted between page requests.",
    explanationWrong:
      "Offset pagination degrades as the page number grows because the database must count through all preceding rows before returning results. On page 50 with 20 items per page, the database skips 980 rows. It can also show duplicates or skip items when the dataset changes between requests.",
    sourceUrl:
      "https://www.prisma.io/docs/orm/prisma-client/queries/pagination#cursor-based-pagination",
    sourceLabel: "Prisma: Cursor-based pagination",
  },
  {
    id: "rest-006",
    category: "rest-api-design",
    difficulty: "medium",
    title: "API versioning strategy",
    prompt: "Which API versioning approach is easier to adopt and maintain?",
    content: {
      type: "code",

      left: `// Path-based versioning
// GET /api/v1/products
// GET /api/v2/products

// Next.js route structure
// app/api/v1/products/route.ts
export async function GET() {
  const products = await getProductsV1();
  return Response.json(products);
}

// app/api/v2/products/route.ts
export async function GET() {
  const products = await getProductsV2();
  return Response.json(products);
}`,

      right: `// Header-based versioning
// GET /api/products
// Accept: application/vnd.myapi.v2+json

// app/api/products/route.ts
export async function GET(req: Request) {
  const accept = req.headers.get("accept");
  const version = accept?.includes("v2")
    ? 2 : 1;

  const products = version === 2
    ? await getProductsV2()
    : await getProductsV1();

  return Response.json(products);
}`,
    },

    correctSide: "left",
    explanationCorrect:
      "Path-based versioning is explicit, easy to understand, and simple to route. Each version has its own URL, making it straightforward to test in a browser, share in documentation, and configure in API gateways. Most major APIs (Stripe, GitHub, Twilio) use this approach.",
    explanationWrong:
      "Header-based versioning keeps URLs clean but adds complexity. Clients must remember to set custom Accept headers, browser testing requires extra tooling, and the routing logic becomes harder to maintain as versions grow. It also makes caching more complex since the URL alone does not determine the response.",
    sourceUrl: "https://restfulapi.net/versioning/",
    sourceLabel: "RESTful API: Versioning",
  },
  {
    id: "rest-007",
    category: "rest-api-design",
    difficulty: "hard",
    title: "Query parameters vs path parameters",
    prompt: "Which parameter style is more appropriate here?",
    content: {
      type: "code",

      left: `// Path params for resource identity
// GET /api/users/42/orders/7

app.get("/users/:userId/orders/:orderId",
  async (req, res) => {
    const order = await db.order.findFirst({
      where: {
        id: req.params.orderId,
        userId: req.params.userId,
      },
    });
    res.json(order);
  }
);

// Query params for filtering
// GET /api/orders?status=shipped&sort=date
app.get("/orders", async (req, res) => {
  const { status, sort } = req.query;
  const orders = await db.order.findMany({
    where: { status },
    orderBy: { [sort]: "desc" },
  });
  res.json(orders);
});`,

      right: `// Query params for all lookups
// GET /api/orders?userId=42&orderId=7

app.get("/orders", async (req, res) => {
  const { userId, orderId, status, sort }
    = req.query;

  const where: any = {};
  if (userId) where.userId = userId;
  if (orderId) where.id = orderId;
  if (status) where.status = status;

  const orders = await db.order.findMany({
    where,
    orderBy: sort
      ? { [sort]: "desc" }
      : undefined,
  });
  res.json(orders);
});`,
    },

    correctSide: "left",
    explanationCorrect:
      "Path parameters identify specific resources (/users/42/orders/7 points to exactly one order), while query parameters filter or modify collections. This separation makes URLs predictable and cacheable. Each unique path maps to a distinct resource, and query strings refine the result set.",
    explanationWrong:
      "Putting everything in query parameters blurs the line between identifying a resource and filtering a collection. The URL /orders?orderId=7 does not clearly communicate that you are requesting a single, specific resource. It also makes caching less effective and URL design inconsistent across the API.",
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_URL#parameters",
    sourceLabel: "MDN: URL parameters",
  },
  {
    id: "rest-008",
    category: "rest-api-design",
    difficulty: "hard",
    title: "Nested resources vs flat endpoints",
    prompt: "Which endpoint structure is more maintainable at scale?",
    content: {
      type: "code",

      left: `// Multi-level nested resources
// GET  /api/orgs/:orgId/teams/:teamId
//        /projects/:projectId/tasks/:taskId

app.get(
  "/orgs/:orgId/teams/:teamId" +
  "/projects/:projId/tasks/:taskId",
  async (req, res) => {
    const task = await db.task.findFirst({
      where: {
        id: req.params.taskId,
        project: {
          id: req.params.projId,
          team: { id: req.params.teamId,
            orgId: req.params.orgId },
        },
      },
    });
    res.json(task);
  }
);`,

      right: `// Single-level nesting
// GET /api/projects/:projectId/tasks
// GET /api/tasks/:taskId

app.get("/projects/:projectId/tasks",
  async (req, res) => {
    const tasks = await db.task.findMany({
      where: { projectId: req.params.projectId },
    });
    res.json(tasks);
  }
);

app.get("/tasks/:taskId", async (req, res) => {
  const task = await db.task.findUnique({
    where: { id: req.params.taskId },
  });
  res.json(task);
});`,
    },

    correctSide: "right",
    explanationCorrect:
      "Limiting nesting to one level keeps URLs short, readable, and easy to maintain. Once you have a task ID, you can access it directly at /tasks/:taskId without reconstructing the entire hierarchy. This reduces coupling between resources and simplifies client code.",
    explanationWrong:
      "Deeply nested URLs force clients to know the full resource hierarchy just to fetch a single task. If the task moves to a different project or team, the URL changes and all client code breaks. The long parameter chains also make routes harder to read, test, and document.",
    sourceUrl: "https://restfulapi.net/resource-naming/",
    sourceLabel: "RESTful API: Resource Naming",
  },
];
