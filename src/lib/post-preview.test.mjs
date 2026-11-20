import assert from "node:assert/strict";
import { test } from "node:test";
import { renderPostPreview } from "./post-preview.mjs";

test("excerpts omit footnotes but resolve reference links defined after the cutoff", async () => {
  const { html, truncated } = await renderPostPreview("Intro[^note] with [a link][target].\n\n## Body\n\nHidden.\n\n[^note]: Secret footnote.\n\n    Second paragraph.\n\n[target]: https://example.com");
  assert.equal(truncated, true);
  assert.match(html, /href="https:\/\/example.com"/);
  assert.doesNotMatch(html, /Secret|Second|Hidden|footnote|\[\^/);
});

test("short posts omit multiline note definitions without dropping their body", async () => {
  const { html, truncated } = await renderPostPreview("A short post[^note].\n\n[^note]: Hidden note.\n\n    More hidden.\n\nStill part of the post.");
  assert.equal(truncated, false);
  assert.match(html, /A short post\./);
  assert.match(html, /Still part of the post/);
  assert.doesNotMatch(html, /Hidden|hidden|footnote/);
});

test("footnote and heading syntax in code examples stays literal", async () => {
  const { html, truncated } = await renderPostPreview("Literal `[^note]`.\n\n```text\n[^note]: Keep this.\n## Also keep this\n```");
  assert.equal(truncated, false);
  assert.match(html, /Keep this/);
  assert.match(html, /Also keep this/);
  assert.match(html, /\[\^note\]/);
});

test("explicit excerpt markers take precedence over headings", async () => {
  const { html, truncated } = await renderPostPreview("First.\n\n## Earlier heading\n\nStill included.\n\n<!--more-->\n\nHidden.");
  assert.equal(truncated, true);
  assert.match(html, /Still included/);
  assert.doesNotMatch(html, /Hidden/);
});
