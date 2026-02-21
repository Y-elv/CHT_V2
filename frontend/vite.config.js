import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  // In dev, proxy /api, /auth, /socket.io to backend (set in .env or fallback for local dev)
  const proxyTarget =
    env.VITE_PROXY_TARGET ||
    (mode === "development" ? "https://chtv2-bn.onrender.com" : "");

  return {
    plugins: [react()],
    resolve: {
      alias: {
        zustand: path.resolve(__dirname, "node_modules/zustand"),
      },
    },
    server: proxyTarget
      ? {
          proxy: {
            "/api": { target: proxyTarget, changeOrigin: true },
            // Only proxy /auth/* (e.g. /auth/google), not /auth-verification (frontend route)
            "/auth/": { target: proxyTarget, changeOrigin: true },
            "/socket.io": { target: proxyTarget, changeOrigin: true, ws: true },
          },
        }
      : undefined,
  };
});
