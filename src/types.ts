export interface ProfileConfig {
	/** Author display name; used in bylines, schema, OG images. */
	name: string;
	/** Contact email shown in About-page socials. Omit to hide. */
	email?: string;
	/** Profile URL on GitHub. Leave empty to hide. */
	github?: string;
	/** Profile URL on LinkedIn. Leave empty to hide. */
	linkedin?: string;
	/** Twitter / X profile URL. Leave empty to hide. */
	twitter?: string;
	/** Mastodon profile URL. Leave empty to hide. */
	mastodon?: string;
	/** Schema.org Person.jobTitle. */
	jobTitle?: string;
	/** Schema.org Person.worksFor.name (current employer). */
	employer?: string;
	/** Schema.org Person.worksFor.url. */
	employerUrl?: string;
	/** Schema.org Person.alumniOf.name. */
	alumni?: string;
	/** Absolute avatar/photo URL used in schema markup. */
	avatar?: string;
}

/** Optional Giscus comment-widget config (https://giscus.app). */
export interface CommentsConfig {
	/** GitHub repository hosting the discussions, e.g. "user/repo". */
	repo: string;
	/** GitHub repo node id (data-repo-id from the giscus wizard). */
	repoId: string;
	/** Discussion category name. */
	category: string;
	/** Discussion category id. */
	categoryId: string;
}

/** Optional analytics config — each provider is opt-in. */
export interface AnalyticsConfig {
	/** Google Analytics measurement id (e.g. "G-XXXXXXX"). */
	googleAnalyticsId?: string;
	/** Goatcounter endpoint URL (e.g. "https://example.goatcounter.com/count"). */
	goatcounterUrl?: string;
}

export interface SiteConfig {
	/** Site-wide display name; fallback for profile.name. */
	author: string;
	date: {
		locale: string | string[] | undefined;
		options: Intl.DateTimeFormatOptions;
	};
	description: string;
	lang: string;
	ogLocale: string;
	sortPostsByUpdatedDate: boolean;
	title: string;
	/** Personal info for About page, schema, byline. */
	profile?: ProfileConfig;
	/** Giscus comments; skipped if absent. */
	comments?: CommentsConfig;
	/** Analytics; each provider opt-in. */
	analytics?: AnalyticsConfig;
	webmentions?: {
		link: string;
		pingback?: string;
	};
	hideThemeCredit?: boolean;
}

export interface SiteMeta {
	articleDate?: string | undefined;
	articleModified?: string | undefined;
	description?: string;
	noindex?: boolean;
	ogImage?: string | undefined;
	title: string;
}

/** Webmentions */
export interface WebmentionsFeed {
	children: WebmentionsChildren[];
	name: string;
	type: string;
}

export interface WebmentionsCache {
	children: WebmentionsChildren[];
	lastFetched: null | string;
}

export interface WebmentionsChildren {
	author: Author | null;
	content?: Content | null;
	"mention-of": string;
	name?: null | string;
	photo?: null | string[];
	published?: null | string;
	rels?: Rels | null;
	summary?: Summary | null;
	syndication?: null | string[];
	type: string;
	url: string;
	"wm-id": number;
	"wm-private": boolean;
	"wm-property": string;
	"wm-protocol": string;
	"wm-received": string;
	"wm-source": string;
	"wm-target": string;
}

export interface Author {
	name: string;
	photo: string;
	type: string;
	url: string;
}

export interface Content {
	"content-type": string;
	html: string;
	text: string;
	value: string;
}

export interface Rels {
	canonical: string;
}

export interface Summary {
	"content-type": string;
	value: string;
}

export type AdmonitionType = "tip" | "note" | "important" | "caution" | "warning";
