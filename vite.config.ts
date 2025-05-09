import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteCommonjs } from "@originjs/vite-plugin-commonjs";
import vitePluginRequire from "vite-plugin-require";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig(({ command, mode }) => {

  return {
    cacheDir: "./node_modules/.vite/ui",

    server: {
      port: 4200,
      host: "localhost"
    },

    preview: {
      port: 4300,
      host: "localhost"
    },

    plugins: [
      react(),
      viteCommonjs(),
      vitePluginRequire(),
      nodePolyfills(),
    ],

    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler"
        }
      }
    },
  };
});
