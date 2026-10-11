import type { Root } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

export const remarkMermaid: Plugin<[], Root> = () => (tree, file) => {
	let hasMermaid = false;
	visit(tree, "code", (node, index, parent) => {
		if (node.lang !== "mermaid" || !parent || index === undefined) return;
		hasMermaid = true;
		parent.children[index] = {
			type: "paragraph",
			data: {
				hName: "pre",
				hProperties: { className: ["mermaid"], dataPagefindIgnore: "" },
			},
			children: [{ type: "text", value: node.value }],
		};
	});
	const astro = file.data.astro as { frontmatter?: Record<string, unknown> } | undefined;
	if (hasMermaid && astro?.frontmatter) astro.frontmatter.hasMermaid = true;
};
