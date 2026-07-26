import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client"

// Prisma 7 connects through a driver adapter rather than reading the URL out of
// the schema, so the connection string is read here, at runtime - which is also
// what makes the build work without a database.
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error("DATABASE_URL is not set")
}

// Next reloads modules on every edit in development. Without holding the client
// on globalThis each reload opens a new connection pool, and the database runs
// out of connections long before you notice.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter: new PrismaPg({ connectionString }) })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
