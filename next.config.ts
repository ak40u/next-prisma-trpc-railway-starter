import type { NextConfig } from "next"

const config: NextConfig = {
  // The container is the deployment artefact; tracing the server into a
  // standalone bundle keeps node_modules out of the runtime image.
  output: "standalone",

  // TypeScript 7 ships a new compiler that does not expose the API Next uses for
  // type checking. This flag makes Next shell out to tsc instead, which is what
  // lets the project stay on the current TypeScript rather than pinning to 6.
  experimental: {
    useTypeScriptCli: true,
  },
}

export default config
