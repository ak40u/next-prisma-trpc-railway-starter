"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createTRPCReact, httpBatchLink } from "@trpc/react-query"
import { useState, type ReactNode } from "react"
import superjson from "superjson"

import type { AppRouter } from "@/server/router"

export const trpc = createTRPCReact<AppRouter>()

export function TRPCProvider({ children }: { children: ReactNode }) {
  // Both clients are created in state, not at module scope: a module-level
  // client would be shared across every request during server rendering, which
  // leaks one user's cached data into another's page.
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [httpBatchLink({ url: "/api/trpc", transformer: superjson })],
    }),
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}
