import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseFrontmatter } from "@astrojs/markdown-remark";
import { slug } from "github-slugger";

const POST_DIR = fileURLToPath(new URL("../content/post/", import.meta.url));

function toDate(value: unknown): Date | undefined {
	if (!(value instanceof Date) && typeof value !== "string") return undefined;
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? undefined : date;
}

export function getPostLastModified(): Map<string, Date> {
	const dates = new Map<string, Date>();
	for (const file of fs.readdirSync(POST_DIR, { encoding: "utf8", recursive: true })) {
		if (!/\.mdx?$/.test(file)) continue;
		const { frontmatter } = parseFrontmatter(fs.readFileSync(path.join(POST_DIR, file), "utf8"));
		const date = toDate(frontmatter.updatedDate) ?? toDate(frontmatter.publishDate);
		if (!date) continue;
		const id =
			typeof frontmatter.slug === "string"
				? frontmatter.slug
				: file
						.replace(/\.mdx?$/, "")
						.split(path.sep)
						.map((segment) => slug(segment))
						.join("/")
						.replace(/\/index$/, "");
		dates.set(id, date);
	}
	return dates;
}
