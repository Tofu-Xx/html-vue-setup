import { defineConfig } from "vite";

export default defineConfig({
  base: "/",
  build: {

    lib: {
      entry: "src/index.js",
      formats: ["umd"],
      name: "html-vue-setup",
    },
  }
});