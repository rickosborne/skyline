import {Story, STORY_GRAPH_DATA_TYPE, STORY_GRAPH_TEMPLATE_ID} from "../../template/StoryGraphPlantUml";
import {MarkdownFileList, MarkdownFileListType} from "./MarkdownFile";
import {HasTemplateBlock, HasTemplateBlockType, TemplateBlock, TemplateBlockType} from "./TemplateBlock";
import {Type} from "./Type";
import equal = require("fast-deep-equal");

export interface StoryGraphTemplateBlock extends TemplateBlock {
	dataType: typeof STORY_GRAPH_DATA_TYPE;
	templateId: typeof STORY_GRAPH_TEMPLATE_ID;
}

export const StoryGraphTemplateBlockType = Type.from("StoryGraphTemplateBlock",
	(item: any): item is StoryGraphTemplateBlock => item != null &&
		item.dataType === STORY_GRAPH_DATA_TYPE &&
		item.templateId === STORY_GRAPH_TEMPLATE_ID &&
		TemplateBlockType.isInstance(item),
	(a, b) => TemplateBlockType.equals(a, b),
	(a, b) => TemplateBlockType.hasChanged(a, b),
	item => TemplateBlockType.stringify(item),
);

export interface StoryGraphFiles extends HasTemplateBlock<any> {
	markdownFileList: MarkdownFileList;
	story: Story;
}

export const StoryGraphFilesType = HasTemplateBlockType.subtype("StoryGraphFiles",
	(item: any): item is StoryGraphFiles => item != null &&
		MarkdownFileListType.isInstance(item.markdownFileList) &&
		item.story != null,
	(a, b) => MarkdownFileListType.equals(a.markdownFileList, b.markdownFileList),
	(a, b) => MarkdownFileListType.hasChanged(a.markdownFileList, b.markdownFileList) ||
		!equal(a.story, b.story),
	item => MarkdownFileListType.stringify(item.markdownFileList) + " " + HasTemplateBlockType.stringify(item),
);
