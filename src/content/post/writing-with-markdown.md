---
title: "Writing with markdown"
publishDate: 2026-02-20
description: "A short guide to the markdown features wired into this template — cover images, code, math, footnotes, and admonitions."
tags: [ guide, writing, markdown ]
coverImage:
  src: ./_assets/cover-arcs.jpg
  alt: "Concentric earth-tone arcs rising from a horizon line, like an abstract risograph sunrise."
---

Posts live as `.md` files in `src/content/post/`. The filename becomes the URL slug. Frontmatter fields are validated by
Zod — see `src/content.config.ts` for the schema.

## Frontmatter shape

```yaml
---
title: "Your post title"
publishDate: 2026-01-12
description: "One-sentence summary used in cards, social previews, and meta tags."
tags: [ tag-one, tag-two ]
# updatedDate: 2026-02-01      # optional — shown as "Updated …" on the post
# draft: true                   # excludes the post from production builds
# coverImage:                   # optional — appears between header and body
#   src: ./_assets/cover.png
#   alt: "Description for screen readers"
---
```

`title`, `publishDate`, and `description` are required.

## What's pre-wired

- **Headings** auto-generate `id`s and a `#` anchor on hover/touch — click to copy a deep link.
- **Lazy images** in the post body fade in when they enter the viewport.
- **Reading progress bar** at the top tracks scroll position.
- **Drop cap** on the first paragraph (large italic accent letter, like the one starting this post).
- **Share buttons** at the foot: X, LinkedIn, copy-link.
- **Prev/next post navigation** at the foot, ordered by publish date.

## Images

Drop an image beside the post and reference it with a relative path. Astro runs it through its build-time pipeline —
resized, re-encoded to a modern format, and content-hashed for long-term caching — then marks body images
`loading="lazy"` so they fade in as they scroll into view instead of shipping full-resolution files up front.

![Overlapping translucent circles in warm sienna, ochre, and moss.](./_assets/overlapping-forms.jpg)

The cover image at the top of this post comes from the same pipeline via the `coverImage` frontmatter field — but it
loads eagerly with high fetch priority, since it sits above the fold.

![Soft diagonal bands of ochre, rust, and moss on a cream background.](./_assets/color-fields.jpg)

## Tables

| Feature    | Default                  | Override                                           |
|------------|--------------------------|----------------------------------------------------|
| Code theme | `min-light` / `min-dark` | `expressiveCodeOptions.themes` in `site.config.ts` |
| Body font  | Newsreader               | `--font-serif` in `global.css`                     |
| Mono font  | JetBrains Mono           | `--font-mono` in `global.css`                      |

## Diagrams

A code fence labelled `mermaid` becomes a diagram. It follows the light/dark theme, and the renderer only loads when
a diagram gets close to the viewport. Posts without diagrams don't load Mermaid.

```mermaid
flowchart LR
    accTitle: Publishing a post
    accDescr: Write a draft, preview it locally, then publish it.
    A[Draft] --> B[Preview] --> C[Publish]
```

Add `accTitle` and `accDescr` to describe the diagram for screen readers. Without JavaScript, the source stays visible.

## Custom containers

Three styled containers ship for asides:

:::note
A neutral note. Use this for clarifying context.
:::

:::tip
Tips for the reader. Use sparingly.
:::

:::caution
Heads-up — something to watch for.
:::
