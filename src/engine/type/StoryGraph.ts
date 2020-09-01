import {Story} from "../../template/StoryGraphPlantUml";
import {MarkdownFileList, MarkdownFileListType} from "./MarkdownFile";
import {HasTemplateBlock, HasTemplateBlockType} from "./TemplateBlock";
import {Type} from "./Type";
import equal = require("fast-deep-equal");

export interface StoryGraphFiles extends HasTemplateBlock {
	markdownFileList: MarkdownFileList;
	story: Story;
}

export const StoryGraphFilesType = Type.from("StoryGraphFiles",
	(item: any): item is StoryGraphFiles => item != null &&
		MarkdownFileListType.isInstance(item.markdownFileList) &&
		item.story != null &&
		HasTemplateBlockType.isInstance(item),
	(a, b) => MarkdownFileListType.equals(a.markdownFileList, b.markdownFileList) &&
		HasTemplateBlockType.equals(a, b),
	(a, b) => MarkdownFileListType.hasChanged(a.markdownFileList, b.markdownFileList) ||
		HasTemplateBlockType.hasChanged(a, b) ||
		!equal(a.story, b.story),
	item => MarkdownFileListType.stringify(item.markdownFileList) + " " + HasTemplateBlockType.stringify(item),
);
