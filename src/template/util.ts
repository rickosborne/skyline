import * as childProcess from "child_process";
import * as CSS from "csstype";
import * as fs from "fs";
import * as path from "path";
import * as Prettier from "prettier";
import * as YAML from "yaml";
import {lpad} from "../engine/EngineConfig";
import {Comparator, Consumer, IsInstance} from "../engine/type/Type";
import {CypherStat} from "../schema/book";
import {Hyperlink} from "./AFilesTemplate";
import {FrontMatter} from "./FrontMatter";

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
	format: boolean = false,
): string {
	let svg = childProcess
		.execSync(`plantuml -tsvg -nometadata -p`, {
			input: plantUml,
			encoding: "utf8"
		})
		.replace(/<!--.+?-->/gs, "")
	;
	if (removeXmlHeader) {
		svg = svg.replace(/<\?xml.*?\?>/s, "");
	}
	if (removeSize) {
		svg = svg.replace(/<svg[^>]*>/s, svg => svg
			.replace(/\s+(width|height|style)="[^"]*"/g, "")
		);
	}
	if (format) {
		// @ts-ignore
		svg = Prettier.format(svg, {parser: "xml"});
	}
	return svg;
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

export function getFrontMatter(file: string): FrontMatter | undefined {
	const frontMatterMatch = file.match(/^---\n(.+?)\n---\n/s);
	if (frontMatterMatch != null) {
		return YAML.parse(frontMatterMatch[1]) as FrontMatter;
	}
	return undefined;
}

export function getTitle(file: string): { title: string | undefined; headingLevel: number | undefined; } {
	let headingMatch: RegExpMatchArray | null;
	let title: string | undefined;
	let headingLevel: number | undefined;
	if ((headingMatch = file.match(/(?:^|\n)(#+)\s+([^\r\n]+)/s))) {
		headingLevel = headingMatch[1].length;
		title = headingMatch[2];
	} else if ((headingMatch = file.match(/<h(\d)[^>]*>(.+?)</))) {
		headingLevel = Number(headingMatch[1]);
		title = headingMatch[2];
	}
	return {headingLevel, title};
}

export function matchCount(body: string, regExp: RegExp): number {
	let count = 0;
	for (let match of body.matchAll(regExp)) {
		count++;
	}
	return count;
}

export function readLinks(file: string): Hyperlink[] {
	const links: Hyperlink[] = [];
	for (let match of file.matchAll(/\[(.+?)]\((.+?)\)(?:{:\.(.+?)})/g)) {
		links.push({
			title: match[1],
			href: match[2],
			classNames: match[3] == null ? undefined : match[3].split("."),
		});
	}
	return links;
}

export function uniqueReducer<T>(comparator: Comparator<T> = (a, b) => a === b): (prev: T[], cur: T) => T[] {
	return (prev: T[], cur: T): T[] => {
		if (prev.findIndex(t => comparator(cur, t)) < 0) {
			prev.push(cur);
		}
		return prev;
	};
}

export async function replaceAsync<F extends (...args: any[]) => (string | Promise<string>)>(text: string, regExp: RegExp, fn: F): Promise<string> {
	const promises: Promise<string>[] = [];
	text.replace(regExp, (match, ...extra) => {
		const result = fn(match, ...extra);
		promises.push(result instanceof Promise ? result : Promise.resolve(result));
		return "";
	});
	const results = await Promise.all(promises);
	return text.replace(regExp, () => results.shift() as string);
}

export function resolveAndDo<T>(value: T | Promise<T>, discriminator: IsInstance<T>, consumer: Consumer<T>): void {
	if (discriminator(value)) {
		consumer(value);
	} else {
		value.then(v => consumer(v));
	}
}

export function arrayify<T>(maybe: T | T[]): T[] {
	return Array.isArray(maybe) ? maybe : [maybe];
}

export function spinalCase(s: string): string {
	return s
		.replace(/\s+/g, "-")
		.replace(/[^-A-Za-z0-9]/g, c => lpad(c.charCodeAt(0).toString(16), 2, "0"));
}

export function scale3xText(s: string[]): string[] {
	const t = s.map(line => line.split(""));
	const result: string[] = [];
	for (let y = 0; y < s.length; y++) {
		const line = t[y];
		const lineBefore = t[y - 1] || line;
		const lineAfter = t[y + 1] || line;
		const l: string[][] = [[], [], []];
		for (let x = 0; x < line.length; x++) {
			const q = 1 + (3 * x);
			const E = line[x];
			const A = lineBefore[x - 1] || E;
			const B = lineBefore[x] || E;
			const C = lineBefore[x + 1] || E;
			const D = line[x - 1] || E;
			const F = line[x + 1] || E;
			const G = lineAfter[x - 1] || E;
			const H = lineAfter[x] || E;
			const I = lineAfter[x + 1] || E;
			const eqBD = B === D;
			const eqHD = H === D;
			const eqBF = B === F;
			const eqHF = H === F;
			const neqEG = E !== G;
			const neqEA = E !== A;
			const neqBH = B !== H;
			const neqDF = D !== F;
			const neqEC = E === C;
			const neqEI = E !== I;
			const baseline = neqBH && neqDF;
			l[0][q-1] = baseline && eqBD ? B : E; // E === B && D !== H && B !== F ? D : E;
			l[0][q] = baseline && ((eqBD && neqEC) || (eqBF && neqEA)) ? B : E; // (D === B && D !== H && B !== F && E !== C) || (B === F && B !== D && F !== H && E!=A) ? B : E;
			l[0][q+1] = baseline && eqBF ? B : E; // B === F && B !== D && F !== H ? F : E;
			l[1][q-1] = baseline && ((eqBD && neqEG) || (eqHD && neqEA)) ? D : E; // (H === D && H !== F && D !== B && E !== A) || (D === B && D !== H && B !== F && E !== G) ? D : E;
			l[1][q] = E;
			l[1][q+1] = baseline && ((eqBF && neqEI) || (eqHF && neqEC)) ? F : E; // (B === F && B !== D && F !== H && E !== I) || (F === H && F !== B && H != D && E !== C) ? F : E;
			l[2][q-1] = baseline && eqHD ? H : E; // H === D && H !== F && D !== B ? D : E;
			l[2][q] = baseline && ((eqHD && neqEI) || (eqHF && neqEG)) ? H : E; // (F === H && F !== B && H !== D && E !== G) || (H === D && H !== F && D !== B && E !== I) ? H : E;
			l[2][q+1] = baseline && eqHF ? H : E; // F === H && F !== B && H !== D ? F : E;
		}
		l.forEach(ll => result.push(ll.join("")));
	}
	return result;
}

export function renderCssRules(rules: Record<string, CSS.PropertiesHyphen>): string {
	return Object.entries(rules).map(([selector, props]) => {
		return `${selector} {${Object.entries(props).map(([key, value]) => {
			return `${key}: ${value};`;
		}).join("\n")}}`;
	}).join("\n");
}

export function notImplemented(message: string = "") {
	return () => {
		throw new Error(`Unexpected call: ${message}`);
	};
}
