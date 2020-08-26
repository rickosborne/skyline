export enum Tag {
	Story = "story",
	FullWidth = "full-width",
	NotStarted = "not-started",
}

export enum State {
	Start = "Start",
	Done = "Done",
	Travel = "Travel",
	EncounterRequired = "Encounter",
	EncounterOptional = "Encounter (Optional)",
}

export interface FrontMatterLink {
	href: string;
	title: string;
}

export interface FrontMatter {
	breadcrumbs?: FrontMatterLink[];
	description?: string;
	hiddenLink?: string;
	location?: string;
	next?: FrontMatterLink;
	state?: string;
	tags?: string[];
	title?: string;
}
