import assert from "node:assert/strict";
import { test } from "node:test";
import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import { remarkMermaid } from "../src/plugins/remark-mermaid.ts";

test("Mermaid fences preserve escaped source for the browser renderer", async () => {
	const renderer = await createMarkdownProcessor({ remarkPlugins: [remarkMermaid] });
	const { code } = await renderer.render(
		'```mermaid\nflowchart LR\n A["<script>alert(1)</script> & text"] --> B\n```',
	);
	assert.match(code, /<pre class="mermaid">/);
	assert.match(code, /&#x3C;script>|&lt;script>/);
	assert.ok(!code.includes("<script>"));
	assert.ok(!code.includes("astro-code"));
});

test("Ordinary code fences and prose keep their existing rendering", async () => {
	const source = 'Plain text.\n\n```js\nconst example = "mermaid";\n```';
	const baseline = await createMarkdownProcessor();
	const renderer = await createMarkdownProcessor({ remarkPlugins: [remarkMermaid] });
	assert.equal((await renderer.render(source)).code, (await baseline.render(source)).code);
});
