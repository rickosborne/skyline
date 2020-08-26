import * as childProcess from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as YAML from "yaml";
import {CypherStat} from "../schema/book";

export function ifLines<S extends string | undefined | null | string[]>(
	obj: S | S[],
	lineDelim: string = "\n",
	suffix: string = "",
): string {
	if (obj == null) {
		return "";
	} else if (typeof obj === "string") {
		return obj;
	} else if (!Array.isArray(obj)) {
		throw new Error(`Unexpected type: ${typeof obj}`);
	}
	const parts: string[] = (obj as S[])
		.map((item: S) => ifLines(item, lineDelim, suffix))
		.filter(part => part !== "");
	if (parts.length == 0) {
		return "";
	}
	return parts.join(lineDelim) + suffix;
}

export function ifPresent<T>(obj: T | null | undefined, block: (obj: T) => string): string {
	return obj == null ? "" : block(obj);
}

export function toWords(text: string): string {
	return text.split(/\s+/g)
		.map(w => `<span class="word" markdown="1">${w}</span>`)
		.join(" ");
}

export function svgFromPlantUml(
	plantUml: string,
	removeXmlHeader: boolean = true,
	removeSize: boolean = true,
): string {
	let svg = childProcess
		.execSync(`plantuml -tsvg -nometadata -p`, {
			input: plantUml,
			encoding: "utf8"
		});
	if (removeXmlHeader) {
		svg = svg.replace(/<\?xml.*?\?>/s, "");
	}
	if (removeSize) {
		svg = svg.replace(/<svg.*?>/s, svg => svg
			.replace(/\s+(width|height|style)="[^"]*"/g, "")
		);
	}
	return svg.replace(/<!--.+?-->/gs, "")
}

export interface Lookups {
	cypher: {
		hazardFromHZD: Record<string, string>;
		range: Array<{
			mAway: number;
			ftAway: number;
			name: string;
		}>;
	};
	dnd5e: {
		damageTypeFromHZD: Record<string, string>;
		sizeFromHZD: Record<string, string>;
		acMod: Record<string, number>;
		skill: Array<{
			title: string;
			modifies: string;
		}>;
	};
}

export function getLookups(): Lookups {
	return YAML.parse(fs.readFileSync(path.join(__dirname, "..", "..", "data", "lookups.yaml"), {encoding: "utf8"}));
}

export const DND5E_STAT_TITLES: Record<string, string> = {
	STR: "Strength",
	DEX: "Dexterity",
	CON: "Constitution",
	INT: "Intelligence",
	WIS: "Wisdom",
	CHA: "Charisma"
};

export const DND5E_STAT_ATTR = Object.keys(DND5E_STAT_TITLES);

export const DND5E_STATS: Array<{ attr: string; title: string }> = DND5E_STAT_ATTR.map(attr => ({
	attr,
	title: DND5E_STAT_TITLES[attr],
}));

export interface DND5ESense {
	modifies: string;
	title: string;
}

export const DND5E_SENSES: DND5ESense[] = [
	{title: "Perception", modifies: "WIS"},
	{title: "Investigation", modifies: "INT"},
	{title: "Insight", modifies: "WIS"},
];

export const LOOKUPS = getLookups();

export const CYPHER_STAT_TITLES: Record<keyof CypherStat, string> = {
	Might: "Might",
	Speed: "Speed",
	Intellect: "Intellect",
};

export const CYPHER_STAT_ATTR = Object.keys(CYPHER_STAT_TITLES);

export const CYPHER_STATS: Array<{ attr: string; title: string }> = Object.entries(CYPHER_STAT_TITLES)
	.map(([attr, title]) => ({
		attr,
		title,
	}));
