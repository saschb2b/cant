import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { getAuth } from "./auth";

type Auth = ReturnType<typeof getAuth>;

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<Auth>()],
});
