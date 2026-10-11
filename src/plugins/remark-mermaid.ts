import type { Root } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

export const remarkMermaid: Plugin<[], Root> = () => (tree) => {
	visit(tree, "code", (node, index, parent) => {
		if (node.lang !== "mermaid" || !parent || index === undefined) return;
		parent.children[index] = {
			type: "paragraph",
			data: { hName: "pre", hProperties: { className: ["mermaid"] } },
			children: [{ type: "text", value: node.value }],
		};
	});
};
