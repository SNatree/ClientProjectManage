// import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [vue()]
// })
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import httpProxy  from 'http-proxy';
// import { ENV } from "./src/ENV.js";
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return defineConfig({
    plugins: [vue()],
    clearScreen: true,
    server: {
      host: process.env.VITE_HOST,
      port: process.env.VITE_PORT,
    },
    // mode: mode,
    envDir: ".env.[mode]",
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      commonjsOptions: {
        include: [/node_modules/],
      },
      outDir: `dist/${mode}/dist`,
      rollupOptions: {
        // https://rollupjs.org/guide/en/#big-list-of-options
      },
    },
  });
};
