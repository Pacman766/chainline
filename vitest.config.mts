import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    // Integration tests exercise the server-side Payload Local API (incl. JWT
    // signing via jose, which needs Node's Uint8Array). jsdom swaps the global
    // Uint8Array and breaks jose, so these run in the node environment.
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/int/**/*.int.spec.ts'],
    // Tests never mutate schema — disable Payload's dev push so getPayload() does
    // not stall on a schema pull/prompt. Schema is owned by migrations (already
    // present on the dev DB the suite connects to).
    env: { PAYLOAD_MIGRATING: 'true' },
    // Integration suites set up data over a remote Neon Postgres; the default
    // 10s hook/test timeout is too tight for the round-trips from a dev machine.
    hookTimeout: 30000,
    testTimeout: 30000,
    // Integration tests share one Postgres DB; running files in parallel races
    // on schema push (CREATE TYPE/TABLE → duplicate pg_type). Run them serially.
    fileParallelism: false,
  },
})
