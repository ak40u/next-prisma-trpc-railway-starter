import { initTRPC } from "@trpc/server"
import superjson from "superjson"

// superjson is what lets a Date cross the wire as a Date instead of a string -
// the single most common surprise when wiring tRPC to a database.
const t = initTRPC.create({ transformer: superjson })

export const router = t.router
export const publicProcedure = t.procedure
