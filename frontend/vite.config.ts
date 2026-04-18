import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const port = Number(env.VITE_PORT || 5173);
  const basePath = env.BASE_PATH || "/";
  const apiProxyTarget = env.VITE_API_PROXY_TARGET || "http://127.0.0.1:8080";

  return {
    base: basePath,

    plugins: [
      react(),
      tailwindcss(),
      // ❌ supprimé runtimeErrorOverlay en prod
    ],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
      dedupe: ["react", "react-dom"],
    },

    build: {
      outDir: "dist",
      emptyOutDir: true,

      // ✅ corrige ton warning sourcemap
      sourcemap: false,

      // ✅ évite warning chunk size
      chunkSizeWarningLimit: 1000,

      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom"],
          },
        },
      },
    },

    server: {
      port,
      strictPort: true,
      host: "0.0.0.0",

      proxy: {
        "/api": {
          target: apiProxyTarget,
          changeOrigin: true,
        },
        "/uploads": {
          target: apiProxyTarget,
          changeOrigin: true,
        },
      },
    },

    preview: {
      port,
      strictPort: true,
      host: "0.0.0.0",
      proxy: {
        "/api": {
          target: apiProxyTarget,
          changeOrigin: true,
        },
        "/uploads": {
          target: apiProxyTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
