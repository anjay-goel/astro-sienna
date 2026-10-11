import JetBrainsMono from "@/assets/fonts/jetbrainsmono-regular.ttf";
import NewsreaderItalic from "@/assets/fonts/newsreader-italic.ttf";
import NewsreaderRegular from "@/assets/fonts/newsreader-regular.ttf";
import NewsreaderSemiBold from "@/assets/fonts/newsreader-semibold.ttf";
import { getAllPosts } from "@/data/post";
import { siteConfig } from "@/site-config";
import { formatBylineDate, formatEyebrowDate } from "@/utils/date";
import { Resvg } from "@resvg/resvg-js";
import type { APIContext, InferGetStaticPropsType } from "astro";
import { render } from "astro:content";
import satori, { type SatoriOptions } from "satori";
import { html } from "satori-html";

const ogOptions: SatoriOptions = {
	fonts: [
		{ data: Buffer.from(NewsreaderRegular), name: "Newsreader", style: "normal", weight: 400 },
		{ data: Buffer.from(NewsreaderSemiBold), name: "Newsreader", style: "normal", weight: 600 },
		{ data: Buffer.from(NewsreaderItalic), name: "Newsreader", style: "italic", weight: 400 },
		{ data: Buffer.from(JetBrainsMono), name: "JetBrains Mono", style: "normal", weight: 400 },
	],
	height: 630,
	width: 1200,
};

const SEP = " · ";

const titleClass = (title: string) =>
	title.length > 80
		? "text-5xl leading-tight mb-10"
		: title.length > 55
			? "text-6xl leading-tight mb-10"
			: "text-7xl leading-tight mb-10";

const markup = (props: {
	eyebrow: string;
	title: string;
	byline: string;
	tagsLine: string;
	host: string;
}) =>
	html`<div tw="flex flex-col w-full h-full px-20 py-16" style="background-color: #1a1715; font-family: Newsreader;">
		<p tw="text-2xl mb-10 tracking-widest uppercase" style="font-family: JetBrains Mono; color: #c89761;">
			${props.eyebrow}
		</p>
		<h1 tw="${titleClass(props.title)}" style="color: #fbf6ec; font-weight: 600;">
			${props.title}
		</h1>
		<p tw="text-2xl mb-4" style="font-family: JetBrains Mono; color: #a89c8a;">
			${props.byline}
		</p>
		<p tw="text-xl tracking-wider uppercase" style="font-family: JetBrains Mono; color: #c89761;">
			${props.tagsLine}
		</p>
		<div tw="flex flex-1"></div>
		<div tw="flex justify-end w-full">
			<p tw="text-lg tracking-wide" style="font-family: JetBrains Mono; color: #6b5e4f;">
				${props.host}
			</p>
		</div>
	</div>`;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export async function GET(context: APIContext) {
	const { pubDate, title, tags, readingTime } = context.props as Props;

	const date = new Date(pubDate);
	const authorName = siteConfig.profile?.name ?? siteConfig.author;
	const bylineParts = [
		authorName ? `By ${authorName}` : null,
		formatBylineDate(date),
		readingTime,
	].filter(Boolean) as string[];

	const host = context.site ? new URL(context.site).host : siteConfig.title;

	const svg = await satori(
		markup({
			eyebrow: `Posts${SEP}${formatEyebrowDate(date)}`,
			title,
			byline: bylineParts.join(SEP),
			tagsLine: tags.join(SEP),
			host,
		}),
		ogOptions,
	);
	const png = new Resvg(svg).render().asPng();
	return new Response(new Uint8Array(png), {
		headers: {
			"Cache-Control": "public, max-age=31536000, immutable",
			"Content-Type": "image/png",
		},
	});
}

export async function getStaticPaths() {
	const posts = await getAllPosts();
	const filtered = posts.filter(({ data }) => !data.ogImage);
	const items = await Promise.all(
		filtered.map(async (post) => {
			const { remarkPluginFrontmatter } = await render(post);
			const readingTime =
				(remarkPluginFrontmatter as { minutesRead?: string })?.minutesRead ?? "";
			return {
				params: { slug: post.id },
				props: {
					pubDate: post.data.publishDate.toISOString(),
					title: post.data.title,
					tags: post.data.tags ?? [],
					readingTime,
				},
			};
		}),
	);
	return items;
}
