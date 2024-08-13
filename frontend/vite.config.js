import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Assuming zustand is in node_modules
      zustand: path.resolve(__dirname, "node_modules/zustand"),
    },
  },
});
