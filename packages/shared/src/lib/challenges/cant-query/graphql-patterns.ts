import type { BaseChallenge } from "../../game/types";

export const graphqlPatternChallenges: BaseChallenge[] = [
  {
    id: "gql-001",
    category: "graphql-patterns",
    difficulty: "easy",
    title: "Query nesting depth",
    prompt: "Which query structure is easier to maintain and cache?",
    content: {
      type: "code",
      lang: "graphql",
      left: `query GetOrderDetails($id: ID!) {
  order(id: $id) {
    id
    status
    customer {
      id
      name
      address {
        city
        country
        region {
          name
          timezone
        }
      }
    }
  }
}`,
      right: `query GetOrderDetails($id: ID!) {
  order(id: $id) {
    id
    status
    customerId
  }
}

query GetCustomer($id: ID!) {
  customer(id: $id) {
    id
    name
    city
    country
  }
}`,
    },
    correctSide: "right",
    explanationCorrect:
      "Flatter queries are easier to cache, test, and reuse. Each query fetches exactly one concern, and the results can be cached independently. Deeply nested queries couple unrelated data together and make it harder to predict response times.",
    explanationWrong:
      "Deeply nested queries fetch everything in one request, but they create tight coupling between unrelated data. A change to the Region type forces updates to every query that nests through Address. They also make caching less effective because the entire response invalidates when any nested piece changes.",
    sourceUrl:
      "https://graphql.org/learn/best-practices/#server-side-batching-caching",
    sourceLabel: "GraphQL: Best Practices",
  },
  {
    id: "gql-002",
    category: "graphql-patterns",
    difficulty: "easy",
    title: "Mutations vs queries for side effects",
    prompt: "Which approach correctly handles creating a user?",
    content: {
      type: "code",
      lang: "graphql",
      left: `query CreateUser($input: UserInput!) {
  createUser(input: $input) {
    id
    name
    email
  }
}`,
      right: `mutation CreateUser($input: UserInput!) {
  createUser(input: $input) {
    id
    name
    email
  }
}`,
    },
    correctSide: "right",
    explanationCorrect:
      "Operations that create, update, or delete data must use the mutation type. Mutations run sequentially (not in parallel), which prevents race conditions. They also signal to clients and caches that data has changed, enabling automatic cache updates.",
    explanationWrong:
      "Using a query for a write operation violates the GraphQL specification. Queries are expected to be side-effect free and may run in parallel. Caching layers will treat the result as read-only data and may serve stale results, and tools like GraphiQL will not warn about accidental re-execution.",
    sourceUrl: "https://graphql.org/learn/queries/#mutations",
    sourceLabel: "GraphQL: Mutations",
  },
  {
    id: "gql-003",
    category: "graphql-patterns",
    difficulty: "easy",
    title: "Shared field selections",
    prompt: "Which approach avoids duplicating field selections?",
    content: {
      type: "code",
      lang: "graphql",
      left: `query GetDashboard {
  currentUser {
    id
    name
    email
    avatarUrl
  }
  postAuthor: post(id: "1") {
    author {
      id
      name
      email
      avatarUrl
    }
  }
}`,
      right: `fragment UserFields on User {
  id
  name
  email
  avatarUrl
}

query GetDashboard {
  currentUser {
    ...UserFields
  }
  postAuthor: post(id: "1") {
    author {
      ...UserFields
    }
  }
}`,
    },
    correctSide: "right",
    explanationCorrect:
      "Fragments let you define a set of fields once and reuse them across multiple queries. When the User type gains a new field, you update the fragment in one place. Fragments also enable type-safe code generation in tools like GraphQL Code Generator.",
    explanationWrong:
      "Duplicating field selections across queries is error-prone. If you add a field to one selection but forget the other, your UI shows inconsistent data. As the number of queries grows, keeping all selections in sync becomes increasingly difficult.",
    sourceUrl: "https://graphql.org/learn/queries/#fragments",
    sourceLabel: "GraphQL: Fragments",
  },
  {
    id: "gql-004",
    category: "graphql-patterns",
    difficulty: "medium",
    title: "Resolver data loading",
    prompt: "Which resolver pattern avoids the N+1 query problem?",
    content: {
      type: "code",
      left: `// resolvers.ts
const resolvers = {
  Post: {
    author: async (post) => {
      // Resolves author for each post
      return db.users.findById(post.authorId);
    },
  },
  Query: {
    posts: () => db.posts.findAll(),
  },
};`,
      right: `// resolvers.ts
import DataLoader from "dataloader";

const userLoader = new DataLoader(
  (ids: string[]) =>
    db.users.findByIds(ids)
);

const resolvers = {
  Post: {
    author: (post) =>
      userLoader.load(post.authorId),
  },
  Query: {
    posts: () => db.posts.findAll(),
  },
};`,
    },
    correctSide: "right",
    explanationCorrect:
      "DataLoader batches individual load calls within a single tick into one bulk query. For 50 posts by 10 unique authors, you get 1 batched query instead of 50 individual queries. It also deduplicates and caches results within the same request.",
    explanationWrong:
      "Without DataLoader, fetching a list of 50 posts triggers 50 separate database queries for authors (one per post). This is the classic N+1 problem. Response times grow linearly with the number of items, and database connection pools can become exhausted under load.",
    sourceUrl: "https://github.com/graphql/dataloader#batch-function",
    sourceLabel: "DataLoader: Batch Function",
  },
  {
    id: "gql-005",
    category: "graphql-patterns",
    difficulty: "medium",
    title: "Query field selection",
    prompt: "Which query fetches only what the component needs?",
    content: {
      type: "code",
      left: `// UserAvatar.tsx
const USER_QUERY = gql\`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
      avatarUrl
      bio
      createdAt
      role
      settings {
        theme
        notifications
      }
    }
  }
\`;
`,
      right: `// UserAvatar.tsx
const USER_QUERY = gql\`
  query GetUserAvatar($id: ID!) {
    user(id: $id) {
      id
      name
      avatarUrl
    }
  }
\`;
`,
    },
    correctSide: "right",
    explanationCorrect:
      "One of GraphQL's key advantages is requesting only the fields you need. A focused query reduces payload size, speeds up response times, and makes it clear which data a component depends on. It also reduces the chance of fetching sensitive data unnecessarily.",
    explanationWrong:
      "Fetching every available field defeats the purpose of GraphQL. The component only needs name and avatarUrl, but the query pulls in settings, bio, and other unrelated data. This wastes bandwidth, slows down the response, and creates an implicit dependency on fields the component does not use.",
    sourceUrl: "https://graphql.org/learn/queries/#fields",
    sourceLabel: "GraphQL: Fields",
  },
  {
    id: "gql-006",
    category: "graphql-patterns",
    difficulty: "medium",
    title: "Input types for mutations",
    prompt: "Which mutation signature is more maintainable?",
    content: {
      type: "code",
      lang: "graphql",
      left: `type Mutation {
  createProject(
    name: String!
    description: String
    ownerId: ID!
    isPublic: Boolean!
    tags: [String!]
    templateId: ID
  ): Project!
}`,
      right: `input CreateProjectInput {
  name: String!
  description: String
  ownerId: ID!
  isPublic: Boolean!
  tags: [String!]
  templateId: ID
}

type Mutation {
  createProject(
    input: CreateProjectInput!
  ): Project!
}`,
    },
    correctSide: "right",
    explanationCorrect:
      "Wrapping mutation arguments in an input type keeps the schema clean as fields grow. Clients pass a single variables object, and you can reuse the input type across mutations (e.g., create and update). It also makes it easier to add or deprecate fields without changing the mutation signature.",
    explanationWrong:
      "Listing every argument directly on the mutation works for simple cases, but it becomes unwieldy as the number of fields grows. Adding a new required field is a breaking change to the mutation signature. Input types provide a cleaner abstraction that scales better.",
    sourceUrl: "https://graphql.org/learn/schema/#input-types",
    sourceLabel: "GraphQL: Input Types",
  },
  {
    id: "gql-007",
    category: "graphql-patterns",
    difficulty: "hard",
    title: "Mutation error handling",
    prompt: "Which error handling pattern gives clients more control?",
    content: {
      type: "code",
      left: `type Mutation {
  createUser(input: CreateUserInput!): User
}

// Resolver throws on error
createUser: async (_, { input }) => {
  const exists = await db.users
    .findByEmail(input.email);
  if (exists) {
    throw new GraphQLError(
      "Email already taken"
    );
  }
  return db.users.create(input);
};`,
      right: `union CreateUserResult =
  | CreateUserSuccess
  | EmailTakenError
  | ValidationError

type CreateUserSuccess { user: User! }
type EmailTakenError { email: String! }
type ValidationError { fields: [FieldError!]! }

type Mutation {
  createUser(
    input: CreateUserInput!
  ): CreateUserResult!
}`,
    },
    correctSide: "right",
    explanationCorrect:
      "Union result types make errors part of the schema, so clients can handle each case with typed fragments. Code generation produces exhaustive switch statements. The mutation always returns a non-null result, and expected errors (like duplicate emails) are not mixed with unexpected server errors in the errors array.",
    explanationWrong:
      "Throwing GraphQLError for expected business errors puts them in the top-level errors array alongside unexpected server failures. Clients must parse error messages or codes from an untyped array, which is fragile. There is no schema-level documentation of what can go wrong, so new developers have to read resolver code to understand possible outcomes.",
    sourceUrl:
      "https://www.apollographql.com/docs/technotes/TN0041-errors-as-data-explained",
    sourceLabel: "Apollo: Errors as Data",
  },
  {
    id: "gql-008",
    category: "graphql-patterns",
    difficulty: "hard",
    title: "GraphQL pagination",
    prompt: "Which pagination approach handles real-time data safely?",
    content: {
      type: "code",
      lang: "graphql",
      left: `type Query {
  posts(page: Int!, perPage: Int!): [Post!]!
}

# Usage:
# posts(page: 2, perPage: 10)
# Skips first 10, returns next 10`,
      right: `type PageInfo {
  hasNextPage: Boolean!
  endCursor: String
}

type PostEdge {
  node: Post!
  cursor: String!
}

type PostConnection {
  edges: [PostEdge!]!
  pageInfo: PageInfo!
}

type Query {
  posts(
    first: Int!
    after: String
  ): PostConnection!
}`,
    },
    correctSide: "right",
    explanationCorrect:
      "Cursor-based pagination uses an opaque cursor (often a base64-encoded ID) to mark the position in the list. If items are inserted or deleted between page fetches, no items are skipped or duplicated. The Relay Connection specification provides a standard that works across all GraphQL clients.",
    explanationWrong:
      "Offset-based pagination (page/perPage) breaks when data changes between requests. If a new post is inserted while a user is on page 1, page 2 will repeat the last item from page 1. Deletions cause items to be skipped entirely. This leads to inconsistent and confusing user experiences.",
    sourceUrl: "https://relay.dev/graphql/connections.htm",
    sourceLabel: "Relay: Connection Specification",
  },
];
