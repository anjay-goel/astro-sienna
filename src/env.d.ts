/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />
/// <reference types="mdast-util-to-hast" />

interface ImportMetaEnv {
	readonly WEBMENTION_API_KEY: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
