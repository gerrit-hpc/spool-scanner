import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    base: "/",
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        "/spoolman": {
          target: env.SPOOLMAN_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/spoolman/, ""),
        },
      },
    },
  };
});
