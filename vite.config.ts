import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  base: "/talks/",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        "infrastructure-for-answers": resolve(__dirname, "infrastructure-for-answers/index.html"),
      },
    },
  },
});
