export interface FrontMatterLink {
	href: string;
	title: string;
}

export interface FrontMatter {
	breadcrumbs?: FrontMatterLink[];
	description?: string;
	location?: string;
	next?: FrontMatterLink;
	state?: string;
	tags?: string[];
	title?: string;
}
