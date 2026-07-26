import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { publicProcedure, router } from "./trpc"

export const appRouter = router({
  posts: router({
    list: publicProcedure.query(() =>
      prisma.post.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
    ),
    create: publicProcedure
      // Validation lives on the server. The client gets the types from it for
      // free, but the check itself is not something a browser can skip.
      .input(z.object({ title: z.string().min(1).max(120), body: z.string().min(1).max(4000) }))
      .mutation(({ input }) => prisma.post.create({ data: input })),
  }),
})

export type AppRouter = typeof appRouter
