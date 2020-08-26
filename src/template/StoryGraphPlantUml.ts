import * as console from "console";
import * as fs from "fs";
import * as path from "path";
import {AFilesTemplate, Hyperlink, RenderFileRequest, RenderFileResult} from "./AFilesTemplate";
import {FrontMatter, State, Tag} from "./FrontMatter";
import {svgFromPlantUml} from "./util";

export interface Entry {
	dataName: string;
	fileName: string;
	frontMatter: FrontMatter | undefined;
	links: Hyperlink[];
	modulePath: string;
	notStarted: boolean;
	num: number;
	params: Record<string, string>;
	state: string | undefined;
	tags: string[];
	title: string;
	todo: boolean;
}

export interface Story {
	entries: Entry[];
	slug: string;
	title: string;
}

export class StoryGraphPlantUml extends AFilesTemplate<Story, Entry, undefined> {
	public readonly ASSET_EXT = ".svg";
	public readonly ASSET_PATH = "assets/img/";
	public readonly DATA_TYPE = "story-graph-files";
	public readonly PUML_EXT = ".puml";
	public readonly PUML_PATH = "assets/puml/";
	public readonly TEMPLATE_ID = "story-graph-plantuml";

	convert(data: any, params: Record<string, string>): Story {
		const story = data as Story;
		if (Array.isArray(story.entries)) {
			return story;
		}
		console.error("Not a Story data structure!", data);
		throw new Error("Not a Story data structure!");
	}

	render(story: Story, params: Record<string, string>, originalBody: string): string {
		const pumlPath = path.join(this.ROOT_PATH, `${this.PUML_PATH}${story.slug}${this.PUML_EXT}`);
		const svgPath = path.join(this.ROOT_PATH, `${this.ASSET_PATH}${story.slug}${this.ASSET_EXT}`);
		const originalPuml = fs.existsSync(pumlPath) ? fs.readFileSync(pumlPath, {encoding: "utf8"}) : undefined;
		const updatedPuml = this.renderPuml(story);
		if (originalPuml !== updatedPuml || !fs.existsSync(svgPath)) {
			fs.writeFileSync(pumlPath, updatedPuml, {encoding: "utf8"});
			const svg = svgFromPlantUml(updatedPuml, false, false);
			fs.writeFileSync(svgPath, svg, {encoding: "utf8"});
		}
		return `{:.story-graph.col-span-all}\n![Story graph for the module]({{ "/${this.ASSET_PATH}${story.slug}${this.ASSET_EXT}" | relative_url }})`;
	}

	renderData(dataName: string, params: Record<string, string>, entries: Entry[]): Story {
		const slug = dataName.replace(/[^a-zA-Z0-9]+/g, "-") + "-graph";
		const storyTitle = entries.find(e => e.title != null)?.title || "";
		const storyEntries = entries.reduce((state, entry) => {
			let isStory = false;
			if (entry.frontMatter != null && entry.frontMatter.state === State.Start) {
				state.inStory = true;
				isStory = true;
			} else if (entry.frontMatter != null && entry.frontMatter.state === State.Done) {
				isStory = true;
				state.inStory = false;
			} else if (state.inStory) {
				isStory = true;
			}
			if (isStory) {
				state.entries.push(entry);
				if (entry.frontMatter == null || entry.frontMatter.tags == null || !entry.frontMatter.tags.includes(Tag.Story)) {
					throw new Error(`Entry ${entry.modulePath}/${entry.fileName} is missing a tag: ${Tag.Story}`);
				}
			}
			return state;
		}, {inStory: false, entries: []} as { inStory: boolean; entries: Entry[] }).entries;
		return {
			entries: storyEntries,
			slug,
			title: storyTitle,
		};
	}

	renderFile(request: RenderFileRequest<undefined>): RenderFileResult<Entry, undefined> {
		const file = this.readModuleFile(request);
		const frontMatter = this.getFrontMatter(file);
		const titleHeading = this.getTitle(file);
		const title = titleHeading.title || frontMatter?.title;
		if (title == null) {
			throw new Error(`No title for file: ${request.modulePath}/${request.fileName}`);
		}
		const num = Number((request.fileName.match(/^(\d+)-/) || ["", "0"])[1]);
		const links = this.readLinks(file);

		return {
			context: undefined,
			file: {
				dataName: request.dataName,
				modulePath: request.modulePath,
				fileName: request.fileName,
				frontMatter,
				links,
				notStarted: frontMatter != null && frontMatter.tags != null && frontMatter.tags.includes(Tag.NotStarted),
				num,
				params: request.params,
				state: frontMatter?.state,
				tags: frontMatter?.tags || [],
				title,
				todo: !!file.match(/\bTODO\b/),
			}
		};
	}

	protected renderPuml(story: Story): string {
		const rendered: Record<string, string> = {};

		function stereotype(entry: Entry): string {
			if (entry.notStarted) {
				return "<<NotStarted>>";
			} else if (entry.todo) {
				return "<<TODO>>";
			} else if (entry.state === State.EncounterRequired) {
				return "<<Encounter>>";
			} else if (entry.state === State.EncounterOptional) {
				return "<<OptionalEncounter>>";
			} else if (entry.state === State.Travel) {
				return "<<Travel>>";
			}
			return "";
		}

		function titleOf(entry: Entry): string {
			const existing = rendered[entry.fileName];
			if (existing != null) {
				return existing;
			}
			rendered[entry.fileName] = `e${entry.num}`;
			if (entry.frontMatter == null) {
				return `"${entry.num}" as e${entry.num} ${stereotype(entry)}`;
			}
			return `"${entry.title}" as e${entry.num} ${stereotype(entry)}`;
		}

		const entryByHref = story.entries.reduce((nbh, entry) => {
			nbh[entry.fileName] = entry;
			return nbh;
		}, {} as Record<string, Entry>);
		const startEntry = story.entries.find(e => e.frontMatter?.state === State.Start);
		const startArrow = startEntry == null ? "" : `(*) --> ${titleOf(startEntry)}`;
		const arrows = story.entries
			.flatMap(from => (from.frontMatter != null && from.frontMatter.hiddenLink != null ? from.links.concat({
				title: "",
				href: from.frontMatter.hiddenLink,
				classNames: ['story-link'],
			}) : from.links)
				.filter(l => l.classNames?.includes("story-link") && entryByHref[l.href] != null)
				.map(l => {
					const left = titleOf(from);
					const classNames = l.classNames || [];
					const arrow = classNames.includes("story-link-if") || classNames.includes("story-link-elsif") ? "-l->" : classNames.includes("story-link-continue") ? '-r->' : "-->";
					const right = titleOf(entryByHref[l.href]);
					return `${left} ${arrow} ${right}`;
				}))
			.join("\n");
		const doneEntry = story.entries.find(e => e.frontMatter?.state === State.Done);
		const endArrow = doneEntry == null ? "" : `${titleOf(doneEntry)} --> (*)`;
		return `
@startuml

' title ${story.title} Story Graph

skinparam {
	DefaultFontName Roboto Condensed
	DefaultFontSize 16
	shadowing false
	
	ArrowColor #cccccc
	BackgroundColor #ffffff
	
	ActivityBackgroundColor #C8E2F9
	ActivityBorderColor #C8E2F9

  ActivityBackgroundColor<<NotStarted>> #ffff99
  ActivityBorderColor<<NotStarted>> #ffff99
  ActivityBackgroundColor<<TODO>> #eeffcc
  ActivityBorderColor<<TODO>> #eeffcc
  ActivityBackgroundColor<<OptionalEncounter>> #F9E2C8
  ActivityBorderColor<<OptionalEncounter>> #F9E2C8
  ActivityBackgroundColor<<Encounter>> #EEAD63
  ActivityBorderColor<<Encounter>> #EEAD63
  ActivityBackgroundColor<<Travel>> #BBF395
  ActivityBorderColor<<Travel>> #BBF395
	LegendBackgroundColor transparent
	LegendBorderColor transparent
	LegendBorderThickness 0
}

${startArrow}
${arrows}
${endArrow}

legend
|= Type |= Description |
|<#C8E2F9> (Other) | Story |
|<#ffff99> Not Started | Story, needs to be written |
|<#eeffcc> TODO | Story, not finished |
|<#BBF395> Travel | Party travel |
|<#EEAD63> Encounter | Combat encounter, required |
|<#F9E2C8> Optional Encounter | Combat encounter, optional |
endlegend


@enduml
		`.trim() + "\n";
	}
}