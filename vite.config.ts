import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import remarkGfm from "remark-gfm";
import { resolve } from "path";
import { arrangePlugin } from "./src/deck/arrange/vitePlugin";

export default defineConfig({
  base: "/talks/",
  plugins: [
    {
      enforce: "pre",
      ...mdx({
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkGfm],
        providerImportSource: "@mdx-js/react",
      }),
    },
    react(),
    arrangePlugin(),
  ],
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        "infrastructure-for-answers": resolve(__dirname, "infrastructure-for-answers/index.html"),
        "ams-dbt-meetup-2026-06": resolve(__dirname, "ams-dbt-meetup-2026-06/index.html"),
        "vibe-coding-weekend-2026-08": resolve(__dirname, "vibe-coding-weekend-2026-08/index.html"),
      },
    },
  },
});
