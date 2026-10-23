import { defineConfig } from "vite";

export default defineConfig({
  esbuild: { jsx: "automatic", jsxImportSource: "preact" },
  server: {
    port: 5173,
    strictPort: true,
    // Keep API and WebSocket at the same origin during development.
    proxy: {
      "/api": { target: "http://127.0.0.1:3000" },
      "/ws": { target: "ws://127.0.0.1:3000", ws: true },
    },
  },
});
