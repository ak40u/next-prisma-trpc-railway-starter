import { defineConfig, env } from "prisma/config"

// Prisma 7 removed `url` from the datasource block in schema.prisma. The CLI -
// migrate, introspect, studio - reads the connection string from here instead,
// while the application gets its own connection through a driver adapter.
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
})
