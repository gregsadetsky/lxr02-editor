import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    assetsInlineLimit: 0,  // kits stay real .SND files in dist/assets
  },
});
