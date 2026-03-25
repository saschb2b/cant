import type { Challenge } from "../types";

export const reactTypescriptChallenges: Challenge[] = [
  {
    id: "rt-001",
    category: "react-typescript",
    difficulty: "easy",
    title: "Component props typing",
    badCode: `function UserCard(props: any) {
  return (
    <div>
      <h2>{props.name}</h2>
      <p>{props.emial}</p>
      {/* Typo: "emial" instead of "email" */}
      {/* No error because props is any */}
    </div>
  );
}

<UserCard name="Alice" />
// Missing email, no error`,
    goodCode: `interface UserCardProps {
  name: string;
  email: string;
  role?: "admin" | "user";
}

function UserCard({ name, email, role = "user" }: UserCardProps) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{email}</p>
      <span>{role}</span>
    </div>
  );
}

// <UserCard name="Alice" />
// Error: missing required prop 'email'`,
    correctSide: "right",
    explanationCorrect:
      "Defining a props interface gives you autocomplete, catches typos, and ensures required props are passed. Destructuring in the parameter list with default values makes the component signature clear. Optional props use ? and can have defaults.",
    explanationWrong:
      "Using any for props disables all type checking on the component. Misspelled property accesses, missing required props, and wrong value types all pass without errors. The bugs only surface at runtime when the UI renders incorrectly or crashes.",
    sourceUrl: "https://react.dev/learn/typescript#typing-component-props",
    sourceLabel: "React: Typing Component Props",
  },
  {
    id: "rt-002",
    category: "react-typescript",
    difficulty: "easy",
    title: "Event handler types",
    badCode: `function SearchInput() {
  const handleChange = (e: any) => {
    // e is 'any', no autocomplete
    console.log(e.target.value);
    // What if target is null?
    // What if value doesn't exist?
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Works, but no type safety
  };

  return <input onChange={handleChange} />;
}`,
    goodCode: `function SearchInput() {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log(e.target.value);
    // target is HTMLInputElement, not null
    // .value is guaranteed to exist
  };

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
  };

  return <input onChange={handleChange} />;
}`,
    correctSide: "right",
    explanationCorrect:
      "React provides generic event types like ChangeEvent, FormEvent, MouseEvent, and KeyboardEvent. The generic parameter specifies the element type (HTMLInputElement, HTMLFormElement), which types the target property correctly and provides autocomplete for element-specific properties.",
    explanationWrong:
      "Using any for event types removes autocomplete for event properties and element-specific attributes. You lose access to typed properties like e.target.value, e.target.checked, and e.currentTarget. Event types are straightforward to use and prevent common mistakes like forgetting preventDefault.",
    sourceUrl: "https://react.dev/learn/typescript#typing-dom-events",
    sourceLabel: "React: Typing DOM Events",
  },
  {
    id: "rt-003",
    category: "react-typescript",
    difficulty: "medium",
    title: "forwardRef with generics",
    badCode: `const Input = React.forwardRef((props, ref) => {
  // ref is unknown, props is {}
  // No autocomplete, no type safety
  return (
    <input
      ref={ref}
      placeholder={props.placeholder}
      // Error: Property 'placeholder'
      // does not exist on type '{}'
    />
  );
});`,
    goodCode: `interface InputProps {
  placeholder?: string;
  label: string;
  error?: string;
}

const Input = React.forwardRef<
  HTMLInputElement,
  InputProps
>(({ placeholder, label, error }, ref) => {
  return (
    <div>
      <label>{label}</label>
      <input ref={ref} placeholder={placeholder} />
      {error && <span>{error}</span>}
    </div>
  );
});

Input.displayName = "Input";`,
    correctSide: "right",
    explanationCorrect:
      "React.forwardRef accepts two generic parameters: the ref element type and the props type. This gives the ref the correct type (HTMLInputElement) so consumers get autocomplete on ref.current, and the component gets typed props. Setting displayName helps with React DevTools.",
    explanationWrong:
      "Without generic parameters, forwardRef infers ref as unknown and props as an empty object. Accessing any prop requires a type assertion, and the ref cannot be used with element-specific methods. The generic parameters are the only way to get proper types through forwardRef.",
    sourceUrl: "https://react.dev/reference/react/forwardRef",
    sourceLabel: "React: forwardRef",
  },
  {
    id: "rt-004",
    category: "react-typescript",
    difficulty: "medium",
    title: "Children typing",
    badCode: `interface LayoutProps {
  children: any;
}

function Layout({ children }: LayoutProps) {
  return <main>{children}</main>;
}

// All of these work, but some shouldn't:
<Layout children={undefined} />
<Layout children={new Map()} />
<Layout children={Symbol("x")} />
// Maps and Symbols aren't renderable`,
    goodCode: `interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return <main>{children}</main>;
}

// Accepts valid React children:
<Layout>Hello</Layout>
<Layout><Header /><Content /></Layout>
<Layout>{null}</Layout>
<Layout>{items.map((i) => <Item key={i.id} />)}</Layout>

// For single element only:
// children: React.ReactElement`,
    correctSide: "right",
    explanationCorrect:
      "React.ReactNode covers everything React can render: elements, strings, numbers, fragments, portals, null, undefined, and booleans. Using it instead of any prevents passing non-renderable values like Maps, Sets, and Symbols. Use React.ReactElement if you need exactly one JSX element.",
    explanationWrong:
      "Typing children as any allows non-renderable values like Maps and Symbols to be passed. React will throw a runtime error when it tries to render them. ReactNode is the correct type for the children prop because it matches exactly what React can render.",
    sourceUrl: "https://react.dev/learn/typescript#typing-children",
    sourceLabel: "React: Typing Children",
  },
  {
    id: "rt-005",
    category: "react-typescript",
    difficulty: "hard",
    title: "Discriminated prop unions",
    badCode: `interface ButtonProps {
  variant: "link" | "button";
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

function Button({ variant, href, onClick, children }: ButtonProps) {
  if (variant === "link") {
    // href might be undefined even for links
    return <a href={href}>{children}</a>;
  }
  return <button onClick={onClick}>{children}</button>;
}

// No error, but link has no href:
<Button variant="link">Go</Button>`,
    goodCode: `type ButtonProps =
  | {
      variant: "link";
      href: string;
      children: React.ReactNode;
    }
  | {
      variant: "button";
      onClick?: () => void;
      children: React.ReactNode;
    };

function Button(props: ButtonProps) {
  if (props.variant === "link") {
    // href is guaranteed to be string
    return <a href={props.href}>{props.children}</a>;
  }
  return (
    <button onClick={props.onClick}>
      {props.children}
    </button>
  );
}

// Error: 'href' is missing for variant "link"
// <Button variant="link">Go</Button>`,
    correctSide: "right",
    explanationCorrect:
      "Discriminated unions use a literal type field (variant) to determine which set of props is required. When variant is 'link', TypeScript knows href is required and onClick does not exist. This makes invalid states unrepresentable at the type level.",
    explanationWrong:
      "Making all variant-specific props optional means TypeScript cannot enforce that a link has an href or that a button has an onClick. A link without href renders as an anchor with no destination. Discriminated unions enforce correct props for each variant.",
    sourceUrl:
      "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions",
    sourceLabel: "TypeScript: Discriminated Unions",
  },
  {
    id: "rt-006",
    category: "react-typescript",
    difficulty: "hard",
    title: "Polymorphic 'as' prop",
    badCode: `interface TextProps {
  as?: string;
  children: React.ReactNode;
  className?: string;
}

function Text({ as = "p", children, ...rest }: TextProps) {
  const Component = as as any;
  return <Component {...rest}>{children}</Component>;
}

// No validation of valid HTML elements
// No type safety on element-specific props
<Text as="buttn">Click</Text>
// Typo renders <buttn> tag`,
    goodCode: `type TextProps<T extends React.ElementType> = {
  as?: T;
  children: React.ReactNode;
} & Omit<
  React.ComponentPropsWithoutRef<T>,
  "as" | "children"
>;

function Text<T extends React.ElementType = "p">({
  as,
  children,
  ...rest
}: TextProps<T>) {
  const Component = as || "p";
  return <Component {...rest}>{children}</Component>;
}

<Text as="a" href="/about">Link</Text>
// <Text as="a" href={42}>Link</Text>
// Error: href must be string`,
    correctSide: "right",
    explanationCorrect:
      "A generic component parameterized by React.ElementType lets TypeScript infer the correct props for whatever element or component is passed via the 'as' prop. Using Omit prevents conflicts between your custom props and the target element's props. This is the pattern used by libraries like Chakra UI and Radix.",
    explanationWrong:
      "Typing the 'as' prop as string provides no validation. Typos in element names compile without errors, and element-specific props like href are not type-checked. The generic pattern connects the 'as' value to the allowed props, so passing href to a div is caught at compile time.",
    sourceUrl:
      "https://www.totaltypescript.com/concepts/polymorphic-components",
    sourceLabel: "Total TypeScript: Polymorphic Components",
  },
];
