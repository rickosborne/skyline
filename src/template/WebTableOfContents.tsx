import * as fs from "fs";
import * as path from "path";
import {h} from "preact";
import * as YAML from 'yaml';
import {AFilesTemplate, RenderFileRequest, RenderFileResult} from "./AFilesTemplate";
import {FrontMatter} from "./FrontMatter";

export interface ContentItem {
	description: string | undefined;
	indentLevel: number;
	link: string;
	notStarted: boolean;
	startOfStory: boolean;
	title: string;
	titleIsSpoiler: boolean;
	todoCount: number;
}

export interface TableOfContents {
	items: ContentItem[];
}

export interface Context {
	previousHeadingLevel: number;
}

export class WebTableOfContents extends AFilesTemplate<TableOfContents, ContentItem, Context> {
	public readonly DATA_TYPE = 'files';
	public readonly TEMPLATE_ID = 'web-table-of-contents';

	convert(data: any, params: Record<string, string>): TableOfContents {
		const toc = data as TableOfContents;
		if (Array.isArray(toc.items)) {
			return toc;
		}
		throw new Error('Not a Table of Contents data structure.');
	}

	render(data: TableOfContents, params: Record<string, string>, originalBody: string): string {
		return data.items.map(item => {
			if (item.title.match(/^\d+/) && !item.title.startsWith('100')) {
				return undefined;
			}
			return "  ".repeat(item.indentLevel - 1) +
				"* " +
				(item.startOfStory ? "Story entry point: " : "") +
				"[" + item.title + "](" + item.link + ")" +
				(item.titleIsSpoiler ? '{:.spoiler}' : '') +
				(item.description == null ? '' : ` <span class="description">${item.description}</span>`) +
				(item.notStarted ? ' (not started yet)' : (item.todoCount > 0 ? ' (started, unfinished)' : ''));
		}).filter(l => l != null).join("\n");
	}

	renderData(dataName: string, params: Record<string, string>, items: ContentItem[]): TableOfContents {
		return {items};
	}

	renderFile(request: RenderFileRequest<Context>): RenderFileResult<ContentItem, Context> {
		const file = fs.readFileSync(path.join(request.modulePath, request.fileName), {encoding: "utf8"});
		let headingMatch: RegExpMatchArray | null;
		let headingLevel = request.context?.previousHeadingLevel || 1;
		let description: string | undefined;
		let title: string | undefined;
		let frontMatter: FrontMatter | undefined;
		let titleIsSpoiler: boolean = false;
		let isStoryStart: boolean = false;
		let notStarted: boolean = false;
		if ((headingMatch = file.match(/(?:^|\n)(#+)\s+([^\r\n]+)/s))) {
			headingLevel = headingMatch[1].length;
			title = headingMatch[2];
		} else if ((headingMatch = file.match(/<h(\d)[^>]*>(.+?)</))) {
			headingLevel = Number(headingMatch[1]);
			title = headingMatch[2];
		}
		const frontMatterMatch = file.match(/^---\n(.+?)\n---\n/s);
		if (frontMatterMatch != null) {
			frontMatter = YAML.parse(frontMatterMatch[1]) as FrontMatter;
			if (frontMatter != null) {
				titleIsSpoiler = (frontMatter.tags || []).includes('title-is-spoiler');
				isStoryStart = (frontMatter.state || '') === 'Start';
				notStarted = (frontMatter.tags || []).includes('not-started');
				if ((frontMatter.tags || []).includes('full-width') && headingLevel === 1) {
					headingLevel++;    // because character sheets
				}
				description = frontMatter.description;
				if (title == null) {
					title = frontMatter.title;
				}
			}
		}
		if (title == null) {
			return {
				context: {
					previousHeadingLevel: headingLevel
				},
				file: undefined,
			};
		}
		if (isStoryStart) {
			headingLevel = 1;
		}
		let todoCount = 0;
		const todoMatches = file.matchAll(/\bTODO\b/s);
		for (let todoMatch of todoMatches) {
			todoCount++;
		}
		return {
			file: {
				description,
				indentLevel: headingLevel,
				link: request.fileName,
				notStarted,
				startOfStory: isStoryStart,
				title,
				titleIsSpoiler,
				todoCount,
			},
			context: {
				previousHeadingLevel: headingLevel
			}
		};
	}
}
