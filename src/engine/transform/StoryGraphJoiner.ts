import * as path from "path";
import {Story, StoryGraphPlantUml} from "../../template/StoryGraphPlantUml";
import {MarkdownFileList, MarkdownFileListType} from "../type/MarkdownFile";
import {
	StoryGraphFiles,
	StoryGraphFilesType,
	StoryGraphTemplateBlock,
	StoryGraphTemplateBlockType
} from "../type/StoryGraph";
import {ROOT_PATH} from "../util/RootPath";
import {BiTransformer} from "./Transformer";

export class StoryGraphJoiner extends BiTransformer<MarkdownFileList, StoryGraphTemplateBlock, StoryGraphFiles> {
	private readonly renderer = new StoryGraphPlantUml();

	constructor() {
		super(MarkdownFileListType, StoryGraphTemplateBlockType, StoryGraphFilesType);
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
			title: allEntries.find(e => e.title != null)?.title || "",
		};
		this.notify({
			markdownFileList,
			story,
			templateBlock,
		});
	}
}
