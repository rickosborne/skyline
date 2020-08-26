import {AFilesTemplate, RenderFileRequest, RenderFileResult} from "./AFilesTemplate";

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
		let completionTotal = 0;
		let completionParts = 0;
		const toc = data.items
			.map(item => {
				completionTotal++;
				if (item.title.match(/^\d+/) && !item.title.startsWith('100')) {
					return undefined;
				}
				if (item.notStarted) {
					// nothing
				} else if (item.todoCount > 0) {
					completionParts += 0.5;
				} else {
					completionParts++;
				}
				return "  ".repeat(item.indentLevel - 1) +
					"* " +
					(item.startOfStory ? "_Story entry point:_ " : "") +
					(item.notStarted ? item.title : "[" + item.title + "](" + item.link + ")" + (item.titleIsSpoiler ? '{:.spoiler}' : '')) +
					(item.description == null ? '' : ` <span class="description">${item.description}</span>`) +
					(item.notStarted ? ' _(not started yet)_' : (item.todoCount > 0 ? ' _(started, unfinished)_' : ''));
			})
			.filter(l => l != null)
			.join("\n");
		return `_Estimated module completion: **~${Math.round(100.0 * completionParts / completionTotal)}%**._\n\n${toc}`;
	}

	renderData(dataName: string, params: Record<string, string>, items: ContentItem[]): TableOfContents {
		return {items};
	}

	renderFile(request: RenderFileRequest<Context>): RenderFileResult<ContentItem, Context> {
		const file = this.readModuleFile(request);
		const frontMatter = this.getFrontMatter(file);
		const titleHeading = this.getTitle(file);
		let headingLevel = request.context?.previousHeadingLevel;
		let description: string | undefined;
		let title: string | undefined;
		let titleIsSpoiler: boolean = false;
		let isStoryStart: boolean = false;
		let notStarted: boolean = false;
		if (frontMatter != null) {
			title = frontMatter.title;
			titleIsSpoiler = (frontMatter.tags || []).includes('title-is-spoiler');
			isStoryStart = (frontMatter.state || '') === 'Start';
			notStarted = (frontMatter.tags || []).includes('not-started');
			description = frontMatter.description;
		}
		headingLevel = titleHeading.headingLevel || headingLevel || 1;
		title = titleHeading.title || title;
		if (frontMatter != null && (frontMatter.tags || []).includes('full-width') && headingLevel === 1) {
			headingLevel++;    // because character sheets
		}
		if (title == null) {
			return {
				context: {
					previousHeadingLevel: headingLevel,
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
