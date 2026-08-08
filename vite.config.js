import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  base: "./",
  // one self-contained dist/index.html: works from file://, any host, and
  // keeps the original single-file spirit of the editor
  plugins: [viteSingleFile()],
});
