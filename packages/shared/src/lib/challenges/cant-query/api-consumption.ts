import type { BaseChallenge } from "../../game/types";

export const apiConsumptionChallenges: BaseChallenge[] = [
  {
    id: "con-001",
    category: "api-consumption",
    difficulty: "easy",
    title: "Data fetching approach",
    prompt: "Which data fetching approach provides a better user experience?",
    content: {
      type: "code",

      left: `function UserProfile({ id }: { id: string }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch(\`/api/users/\${id}\`)
      .then((res) => res.json())
      .then(setUser);
  }, [id]);

  if (!user) return <Skeleton />;
  return <Profile user={user} />;
}`,

      right: `function UserProfile({ id }: { id: string }) {
  const { data: user } = useSWR(
    \`/api/users/\${id}\`,
    fetcher,
    { revalidateOnFocus: true }
  );

  if (!user) return <Skeleton />;
  return <Profile user={user} />;
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "SWR (stale-while-revalidate) returns cached data instantly and revalidates in the background. Users see content immediately on repeat visits instead of a loading spinner every time. The cache is shared across components, so navigating back to a page feels instant.",
    explanationWrong:
      "Fetching in useEffect with no cache means every mount triggers a new request and shows a loading skeleton. Navigation back to previously visited pages feels slow because the data is fetched from scratch each time.",
    sourceUrl: "https://swr.vercel.app/docs/revalidation",
    sourceLabel: "SWR Docs: Revalidation",
  },
  {
    id: "con-002",
    category: "api-consumption",
    difficulty: "easy",
    title: "Multi-component data fetching",
    prompt: "Which approach avoids redundant network requests?",
    content: {
      type: "code",

      left: `// Each component fetches independently
function Header() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetch("/api/me").then(r => r.json()).then(setUser);
  }, []);
  return <Avatar user={user} />;
}

function Sidebar() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetch("/api/me").then(r => r.json()).then(setUser);
  }, []);
  return <NavMenu user={user} />;
}`,

      right: `// Each component uses a query hook
function Header() {
  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: () => fetch("/api/me").then(r => r.json()),
  });
  return <Avatar user={user} />;
}

function Sidebar() {
  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: () => fetch("/api/me").then(r => r.json()),
  });
  return <NavMenu user={user} />;
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "TanStack Query deduplicates requests with the same query key. When Header and Sidebar both mount, only one network request fires. The second component receives the same cached result. This reduces bandwidth, avoids race conditions, and keeps data consistent across the UI.",
    explanationWrong:
      "Using raw fetch in useEffect means each component triggers its own request. Two components requesting the same endpoint at the same time results in two identical network calls, wasting bandwidth and potentially showing inconsistent data if responses arrive at different times.",
    sourceUrl:
      "https://tanstack.com/query/latest/docs/framework/react/guides/does-this-replace-client-state",
    sourceLabel: "TanStack Query: Does this replace client state?",
  },
  {
    id: "con-003",
    category: "api-consumption",
    difficulty: "easy",
    title: "Loading and error states",
    prompt: "Which pattern handles async states more reliably?",
    content: {
      type: "code",

      left: `function TodoList() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    retry: 2,
  });

  if (isLoading) return <Spinner />;
  if (error) return <ErrorBanner error={error} />;
  return <List items={data} />;
}`,

      right: `function TodoList() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos().then(setTodos);
  }, []);

  return <List items={todos} />;
}`,
    },

    correctSide: "left",
    explanationCorrect:
      "Handling loading, error, and success states explicitly prevents blank screens and confusing behavior. TanStack Query provides these states out of the box, along with automatic retries. Users see a spinner while data loads and a clear error message if something goes wrong.",
    explanationWrong:
      "Ignoring loading and error states means the component renders an empty list immediately, which can look broken. If the request fails, the user sees no feedback at all. This leads to silent failures that are hard to debug and frustrating for users.",
    sourceUrl:
      "https://tanstack.com/query/latest/docs/framework/react/guides/queries",
    sourceLabel: "TanStack Query: Queries",
  },
  {
    id: "con-004",
    category: "api-consumption",
    difficulty: "medium",
    title: "Mutation UI feedback",
    prompt: "Which approach feels more responsive when toggling a like?",
    content: {
      type: "code",

      left: `function LikeButton({ postId }: { postId: string }) {
  const utils = api.useUtils();
  const likeMutation = useMutation({
    mutationFn: () => toggleLike(postId),
    onMutate: async () => {
      await utils.posts.get.cancel(postId);
      const prev = utils.posts.get.getData(postId);
      utils.posts.get.setData(postId, (old) =>
        old ? { ...old, liked: !old.liked } : old
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      utils.posts.get.setData(postId, ctx?.prev);
    },
    onSettled: () => utils.posts.get.invalidate(postId),
  });

  return <HeartIcon onClick={() => likeMutation.mutate()} />;
}`,

      right: `function LikeButton({ postId }: { postId: string }) {
  const likeMutation = useMutation({
    mutationFn: () => toggleLike(postId),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts", postId]);
    },
  });

  return (
    <HeartIcon
      onClick={() => likeMutation.mutate()}
      disabled={likeMutation.isPending}
    />
  );
}`,
    },

    correctSide: "left",
    explanationCorrect:
      "Optimistic updates change the UI immediately before the server responds. The onMutate callback updates the cache optimistically, onError rolls back if the request fails, and onSettled refetches to sync with the server. The user sees instant feedback with no delay.",
    explanationWrong:
      "Waiting for the server before updating the UI adds noticeable lag on every interaction. Disabling the button during the request makes the app feel sluggish. For frequent, low-risk actions like likes, optimistic updates provide a significantly better experience.",
    sourceUrl:
      "https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates",
    sourceLabel: "TanStack Query: Optimistic Updates",
  },
  {
    id: "con-005",
    category: "api-consumption",
    difficulty: "medium",
    title: "Search request handling",
    prompt: "Which search implementation avoids stale results?",
    content: {
      type: "code",

      left: `function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) return;
    fetch(\`/api/search?q=\${query}\`)
      .then((r) => r.json())
      .then(setResults);
  }, [query]);

  return <SearchResults results={results} />;
}`,

      right: `function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) return;
    const controller = new AbortController();

    fetch(\`/api/search?q=\${query}\`, {
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then(setResults)
      .catch((e) => {
        if (e.name !== "AbortError") throw e;
      });

    return () => controller.abort();
  }, [query]);

  return <SearchResults results={results} />;
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "AbortController cancels the previous request when the query changes. Without it, a slow response for an earlier keystroke can overwrite results from a later, faster response. The cleanup function in useEffect ensures only the latest request's results are applied.",
    explanationWrong:
      "Without request cancellation, typing quickly creates a race condition. If the user types 'react' and the request for 're' resolves after the request for 'react', the UI shows results for 're' instead. This is a common and confusing bug in search implementations.",
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/API/AbortController",
    sourceLabel: "MDN: AbortController",
  },
  {
    id: "con-006",
    category: "api-consumption",
    difficulty: "medium",
    title: "Multiple API calls",
    prompt:
      "Which approach loads a dashboard with multiple data sources more efficiently?",
    content: {
      type: "code",

      left: `async function loadDashboard(userId: string) {
  const user = await fetch(\`/api/users/\${userId}\`);
  const orders = await fetch(\`/api/orders?user=\${userId}\`);
  const stats = await fetch(\`/api/stats/\${userId}\`);

  return {
    user: await user.json(),
    orders: await orders.json(),
    stats: await stats.json(),
  };
}`,

      right: `async function loadDashboard(userId: string) {
  const [user, orders, stats] = await Promise.all([
    fetch(\`/api/users/\${userId}\`).then(r => r.json()),
    fetch(\`/api/orders?user=\${userId}\`).then(r => r.json()),
    fetch(\`/api/stats/\${userId}\`).then(r => r.json()),
  ]);

  return { user, orders, stats };
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Promise.all fires all three requests in parallel. If each takes 200ms, the total wait is around 200ms instead of 600ms. Independent requests should always run concurrently. The browser can handle multiple simultaneous connections to the same origin.",
    explanationWrong:
      "Sequential await statements force each request to wait for the previous one to finish. Three 200ms requests take 600ms total. This pattern is correct when requests depend on each other, but for independent data sources it wastes time and makes the dashboard feel slow.",
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all",
    sourceLabel: "MDN: Promise.all()",
  },
  {
    id: "con-007",
    category: "api-consumption",
    difficulty: "hard",
    title: "Polling strategy",
    prompt: "Which polling approach minimizes bandwidth usage?",
    content: {
      type: "code",

      left: `// Polls at regular interval
function usePollFeed(interval = 30_000) {
  const { data } = useQuery({
    queryKey: ["feed"],
    queryFn: () =>
      fetch("/api/feed").then(r => r.json()),
    refetchInterval: interval,
  });

  return data;
}`,

      right: `// Polls with conditional headers
function usePollFeed(interval = 30_000) {
  const etagRef = useRef("");
  const { data } = useQuery({
    queryKey: ["feed"],
    queryFn: async () => {
      const res = await fetch("/api/feed", {
        headers: etagRef.current
          ? { "If-None-Match": etagRef.current }
          : {},
      });
      if (res.status === 304) throw new NoUpdateError();
      etagRef.current = res.headers.get("ETag") ?? "";
      return res.json();
    },
    refetchInterval: interval,
    retry: (count, err) => !(err instanceof NoUpdateError),
  });

  return data;
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Conditional requests with ETags let the server respond with 304 Not Modified when nothing has changed. This saves bandwidth and processing time on both client and server. For polling endpoints that rarely change, the savings are substantial over time.",
    explanationWrong:
      "Downloading the full response body on every poll interval wastes bandwidth when the data has not changed. For large payloads polled frequently, this adds up quickly and puts unnecessary load on both the network and the server.",
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/ETag",
    sourceLabel: "MDN: ETag",
  },
  {
    id: "con-008",
    category: "api-consumption",
    difficulty: "hard",
    title: "Infinite scroll pagination",
    prompt: "Which pagination pattern handles growing lists correctly?",
    content: {
      type: "code",

      left: `function Feed() {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Post[]>([]);

  useEffect(() => {
    fetch(\`/api/posts?page=\${page}\`)
      .then((r) => r.json())
      .then((data) => setItems((prev) => [...prev, ...data]));
  }, [page]);

  return (
    <>
      {items.map((p) => <PostCard key={p.id} post={p} />)}
      <button onClick={() => setPage((p) => p + 1)}>
        Load more
      </button>
    </>
  );
}`,

      right: `function Feed() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage }
    = useInfiniteQuery({
      queryKey: ["posts"],
      queryFn: ({ pageParam = 1 }) =>
        fetch(\`/api/posts?page=\${pageParam}\`)
          .then(r => r.json()),
      getNextPageParam: (last, pages) =>
        last.length > 0 ? pages.length + 1 : undefined,
    });

  const items = data?.pages.flat() ?? [];
  return (
    <>
      {items.map((p) => <PostCard key={p.id} post={p} />)}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}>
          {isFetchingNextPage ? "Loading..." : "Load more"}
        </button>
      )}
    </>
  );
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "useInfiniteQuery manages paginated data as a structured list of pages. It tracks whether more pages exist, prevents duplicate fetches, caches all loaded pages, and handles refetching individual pages. The hasNextPage flag hides the button when all content is loaded.",
    explanationWrong:
      "Manual pagination with useState and useEffect has several issues. There is no deduplication, so fast clicks can append the same page twice. There is no way to know when all pages are loaded. Refetching earlier pages requires rebuilding the entire list. The growing array in state also lacks caching across navigation.",
    sourceUrl:
      "https://tanstack.com/query/latest/docs/framework/react/guides/infinite-queries",
    sourceLabel: "TanStack Query: Infinite Queries",
  },
];
