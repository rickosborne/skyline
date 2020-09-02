import * as path from "path";
import {Story, StoryGraphPlantUml} from "../../template/StoryGraphPlantUml";
import {MarkdownFileList, MarkdownFileListType} from "../type/MarkdownFile";
import {
	StoryGraphFiles,
	StoryGraphFilesType,
	StoryGraphTemplateBlock,
	StoryGraphTemplateBlockType
} from "../type/StoryGraph";
import {
	RenderedTemplateBlock,
	RenderedTemplateBlockType,
	TemplateBlock,
	TemplateBlockType
} from "../type/TemplateBlock";
import {ROOT_PATH} from "../util/RootPath";
import {BiTransformer} from "./Transformer";

export class StoryGraphRenderer extends BiTransformer<MarkdownFileList, StoryGraphTemplateBlock, RenderedTemplateBlock<StoryGraphFiles>> {
	private readonly renderer = new StoryGraphPlantUml();

	constructor() {
		super(MarkdownFileListType, StoryGraphTemplateBlockType, RenderedTemplateBlockType(StoryGraphFilesType));
	}

	protected matchLeftRight(markdownFileList: MarkdownFileList, templateBlock: StoryGraphTemplateBlock): boolean {
		return templateBlock.dataName === markdownFileList.fileListOperation.item.sourceDirectory.pathFromRoot;
	}

	protected onInputs(markdownFileList: MarkdownFileList, templateBlock: StoryGraphTemplateBlock): void {
		const modulePath = path.join(ROOT_PATH, templateBlock.dataName);
		const allEntries = markdownFileList.markdownFiles.map(markdownFile => this.renderer.renderEntry(markdownFile.fileText.text, templateBlock.dataName, modulePath, markdownFile.fileText.file.fileName, templateBlock.keyValue));
		const entries = this.renderer.extractStoryEntries(allEntries);
		const story: Story = {
			slug: templateBlock.dataName.replace(/[^a-zA-Z0-9]+/g, "-") + "-graph",
			entries,
			modulePath,
			title: entries.find(e => e.title != null)?.title || "",
		};
		const renderedText = this.renderer.render(story, templateBlock.keyValue, templateBlock.body);
		if (renderedText.trim() !== templateBlock.body.trim()) {
			this.notify({
				renderedText,
				source: {
					markdownFileList,
					templateBlock,
					story: story
				},
			});
		}
	}
}
