# caffeinate.blog

An Astro site deployed on Cloudflare Pages.

## Development

Use Bun to install dependencies and run the site locally:

```sh
bun install
bun run dev
```

## Sharing previews

Posts can set `previewimage` to a public image path (for example,
`/img/post/my-post/social.webp`) and `previewimagealt` to a description of it.
Sharing images fall back to `postimage`, then the site's coffee image.
Unlike `postimage`, `previewimage` does not add an image to the index.

Local image dimensions are read at build time. Landscape images at least
300×157 pixels use `summary_large_image`; other images use `summary`.
Remote image URLs are supported, but their dimensions are not inspected and
their cards default to `summary`. Missing local images fail the build.

## Deployment

Cloudflare Pages uses the following build settings:

- Build command: `bun run build`
- Build output directory: `dist`

Use Bun for dependency management and keep `bun.lock` up to date.
