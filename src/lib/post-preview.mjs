import { createMarkdownProcessor } from "@astrojs/markdown-remark";

// Parse the whole post so reference links and footnotes resolve before trimming.
// Working on Markdown nodes also leaves code examples containing [^labels] intact.
function remarkExcerpt() {
  return (tree, file) => {
    const markerIndex = tree.children.findIndex((node) => node.type === "html" && node.value.includes("<!--more-->"));
    const headingIndex = tree.children.findIndex((node) => node.type === "heading" && node.depth === 2);
    const cutoff = markerIndex >= 0 ? markerIndex : headingIndex > 0 ? headingIndex : tree.children.length;
    file.data.astro.frontmatter.previewTruncated = cutoff < tree.children.length;
    tree.children = tree.children.filter((node, index) => index < cutoff || node.type === "definition");

    function removeNotes(node) {
      if (!node.children) return;
      node.children = node.children.filter((child) => child.type !== "footnoteDefinition" && child.type !== "footnoteReference");
      node.children.forEach(removeNotes);
    }
    removeNotes(tree);
  };
}

const processor = createMarkdownProcessor({
  remarkPlugins: [remarkExcerpt],
  shikiConfig: { theme: "github-light" },
});

export async function renderPostPreview(body, postimage) {
  let source = body.replace(/^---[\s\S]*?---\s*/, "");
  if (postimage) {
    const escaped = postimage.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    source = source.replace(new RegExp(`<img[^>]*src=["']${escaped}["'][^>]*>`, "g"), "");
  }
  const result = await (await processor).render(source);
  return { html: result.code, truncated: Boolean(result.metadata.frontmatter.previewTruncated) };
}
