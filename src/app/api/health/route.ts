import { prisma } from "@/lib/prisma"

// The health check answers only if the database answers too. A process that is
// up but cannot reach Postgres is not serving anything, and reporting it healthy
// only delays the moment you find out.
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return Response.json({ status: "ok", database: "reachable" })
  } catch {
    return Response.json({ status: "degraded", database: "unreachable" }, { status: 503 })
  }
}

export const dynamic = "force-dynamic"
