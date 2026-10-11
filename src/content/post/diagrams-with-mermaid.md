---
title: "Diagrams with Mermaid"
publishDate: 2026-02-15
description: "Flowcharts, sequence diagrams, state machines and more, written as text in a mermaid code fence and drawn in the browser."
tags: [ guide, writing, diagrams ]
---

Write a diagram as text in a code fence labelled `mermaid`, in any `.md` or `.mdx` post. No import, no component, no
build step. The diagram is drawn in the browser, in the site's colours, and redrawn when you switch between light and
dark.

````markdown
```mermaid
flowchart LR
    accTitle: Publishing a post
    accDescr: Write a draft, preview it locally, then publish it.
    A[Draft] --> B[Preview] --> C[Publish]
```
````

```mermaid
flowchart LR
    accTitle: Publishing a post
    accDescr: Write a draft, preview it locally, then publish it.
    A[Draft] --> B[Preview] --> C[Publish]
```

## Flowcharts

Use `TD` for top-down and `LR` for left-to-right. Square brackets make boxes, curly braces make decisions, and text
between pipes labels an edge.

```mermaid
flowchart TD
    accTitle: Deciding where a change goes
    accDescr: A change that touches the theme goes upstream; anything else stays in the fork.
    A[Make a change] --> B{Theme or content?}
    B -->|Theme| C[Open a PR upstream]
    B -->|Content| D[Commit to your fork]
    C --> E[Pull the update into your fork]
    D --> F[Deploy]
    E --> F
```

## Sequence diagrams

Good for requests, handshakes and anything else that happens in order between a few parties.

```mermaid
sequenceDiagram
    accTitle: Loading a post with a diagram
    accDescr: The browser loads the page, then fetches Mermaid only when a diagram scrolls near the viewport.
    participant Browser
    participant Site
    Browser->>Site: Request post
    Site-->>Browser: HTML
    Note over Browser: Diagram in view
    Browser->>Site: Request Mermaid
    Site-->>Browser: Mermaid
    Note over Browser: Draw diagram
```

## State diagrams

```mermaid
stateDiagram-v2
    accTitle: Lifecycle of a post
    accDescr: A post starts as a draft, gets published, and can be updated any number of times.
    [*] --> Draft
    Draft --> Published: publish
    Published --> Updated: edit
    Updated --> Updated: edit
```

## Entity relationships

```mermaid
erDiagram
    accTitle: How posts and tags relate
    accDescr: A post has many tags, and each tag has an archive page listing its posts.
    POST }o--o{ TAG : "tagged with"
    TAG ||--|| ARCHIVE : "lists posts on"
    POST {
        string title
        date publishDate
        date updatedDate
    }
    TAG {
        string name
    }
```

Mermaid supports more diagram types than these, including class diagrams, Gantt charts, pie charts, mind maps and
git graphs. See the [Mermaid documentation](https://mermaid.js.org/intro/) for the full syntax.

## How it loads

- Only posts that contain a diagram include the loader script. Other posts ship no diagram code at all.
- Mermaid itself is downloaded from the site's own assets when the first diagram comes within 200px of the viewport,
  so a diagram at the bottom of a long post costs nothing until the reader gets near it.
- Diagram source is excluded from site search, so the search index only holds the prose around it.

## Writing good diagrams

- Add `accTitle` and `accDescr` to every diagram. Screen readers read them in place of the drawing.
- Keep diagrams narrow. Small diagrams shrink to fit a phone screen; wide ones scroll sideways inside their frame.
- Without JavaScript, or if the syntax is invalid, the source text stays on the page, so it should read sensibly on its
  own. Errors are logged to the browser console.
