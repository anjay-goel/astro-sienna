import type { Root } from "hast";
import type { Plugin } from "unified";
import { SKIP, visit } from "unist-util-visit";

export const rehypeTableScroll: Plugin<[], Root> = () => (tree) => {
	visit(tree, "element", (node, index, parent) => {
		if (node.tagName !== "table" || !parent || index === undefined) return;
		parent.children[index] = {
			type: "element",
			tagName: "div",
			properties: { className: ["table-scroll"] },
			children: [node],
		};
		return SKIP;
	});
};
