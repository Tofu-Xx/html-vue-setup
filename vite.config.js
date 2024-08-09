import { defineConfig } from "vite";

export default defineConfig({
  base: "/",
  build: {
    lib: {
      entry: "src/main.js",
      formats: ["umd"],
      name: "html-vue-setup",
      fileName: (format) => `main.${format}.js`,
    },
  }
});