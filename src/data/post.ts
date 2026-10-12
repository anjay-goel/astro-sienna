import { type CollectionEntry, getCollection } from "astro:content";
import { siteConfig } from "@/site-config";
import { withBase } from "@/utils/path";

/** Fetch all posts. Drafts are excluded in production builds. */
export async function getAllPosts(): Promise<CollectionEntry<"post">[]> {
	return await getCollection("post", ({ data }) => {
		return import.meta.env.PROD ? !data.draft : true;
	});
}

export function getPostHref(post: CollectionEntry<"post">): string {
	return post.data.externalUrl ?? withBase(`/posts/${post.id}/`);
}

/** Date used for sorting — `updatedDate` if `siteConfig.sortPostsByUpdatedDate`, else `publishDate`. */
export function getPostSortDate(post: CollectionEntry<"post">): Date {
	return siteConfig.sortPostsByUpdatedDate && post.data.updatedDate !== undefined
		? new Date(post.data.updatedDate)
		: new Date(post.data.publishDate);
}

/** Sort by `getPostSortDate`, newest first. Mutates input. */
export function sortMDByDate(posts: CollectionEntry<"post">[]): CollectionEntry<"post">[] {
	return posts.sort((a, b) => {
		const aDate = getPostSortDate(a).valueOf();
		const bDate = getPostSortDate(b).valueOf();
		return bDate - aDate;
	});
}

/** Every tag across the given posts, including duplicates. */
export function getAllTags(posts: CollectionEntry<"post">[]): string[] {
	return posts.flatMap((post) => post.data.tags);
}

/** Unique tags across the given posts, sorted alphabetically. */
export function getUniqueTags(posts: CollectionEntry<"post">[]): string[] {
	return [...new Set(getAllTags(posts))].sort((a, b) => a.localeCompare(b));
}

/** Unique tags with their post counts, sorted by count (desc) then tag (asc). */
export function getUniqueTagsWithCount(posts: CollectionEntry<"post">[]): [string, number][] {
	const counts = getAllTags(posts).reduce((map, tag) => {
		map.set(tag, (map.get(tag) ?? 0) + 1);
		return map;
	}, new Map<string, number>());
	return [...counts.entries()].sort(([aTag, aCount], [bTag, bCount]) =>
		bCount === aCount ? aTag.localeCompare(bTag) : bCount - aCount,
	);
}

/** Posts that carry the given tag (order preserved from the input). */
export function getPostsByTag(
	posts: CollectionEntry<"post">[],
	tag: string,
): CollectionEntry<"post">[] {
	return posts.filter((post) => post.data.tags.includes(tag));
}
