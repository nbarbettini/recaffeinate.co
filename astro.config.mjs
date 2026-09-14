import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";

const site = "https://caffeinate.blog";
const isPreview = process.env.IS_PREVIEW === "true";
if (isPreview && !process.env.CF_PAGES_URL) {
  throw new Error("Preview builds require CF_PAGES_URL for sharing URLs.");
}
const sharingURL = new URL(isPreview ? process.env.CF_PAGES_URL : site);
if (sharingURL.protocol !== "https:" || sharingURL.username || sharingURL.password) {
  throw new Error("Sharing URLs require an HTTPS origin without credentials.");
}

export default defineConfig({
  site,
  vite: {
    define: {
      "import.meta.env.SHARING_ORIGIN": JSON.stringify(sharingURL.origin),
    },
  },
  output: "static",
  adapter: cloudflare({ imageService: "compile" }),
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      theme: "github-light",
    },
  },
});
