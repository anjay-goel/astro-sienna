import type { Root } from "mdast";
import type { Plugin } from "unified";
import { EXIT, visit } from "unist-util-visit";

export const remarkHasMath: Plugin<[], Root> = () => (tree, file) => {
	let hasMath = false;
	visit(tree, ["math", "inlineMath"], () => {
		hasMath = true;
		return EXIT;
	});
	const astro = file.data.astro as { frontmatter?: Record<string, unknown> } | undefined;
	if (hasMath && astro?.frontmatter) astro.frontmatter.hasMath = true;
};
