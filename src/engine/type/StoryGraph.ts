import {Story, STORY_GRAPH_DATA_TYPE, STORY_GRAPH_TEMPLATE_ID} from "../../template/StoryGraphPlantUml";
import {MarkdownFileList, MarkdownFileListType} from "./MarkdownFile";
import {
	HasTemplateBlock,
	hasTemplateBlockSubtype,
	renderedTemplateBlockSubtype,
	TemplateBlock,
	TemplateBlockType
} from "./TemplateBlock";
import {Type} from "./Type";

export interface StoryGraphTemplateBlock extends TemplateBlock {
	dataType: typeof STORY_GRAPH_DATA_TYPE;
	templateId: typeof STORY_GRAPH_TEMPLATE_ID;
}

export const StoryGraphTemplateBlockType = TemplateBlockType.toBuilder<StoryGraphTemplateBlock>()
	.withFixed("dataType", STORY_GRAPH_DATA_TYPE)
	.withFixed("templateId", STORY_GRAPH_TEMPLATE_ID)
	.withParent(TemplateBlockType)
	.withName("StoryGraphTemplateBlock");

export interface StoryGraphFiles extends HasTemplateBlock<any> {
	markdownFileList: MarkdownFileList;
	story: Story;
}

export const StoryGraphFilesType = hasTemplateBlockSubtype<StoryGraphTemplateBlock, StoryGraphFiles>(StoryGraphTemplateBlockType)
	.withTypedField("markdownFileList", MarkdownFileListType)
	.withScalarField("story", true, Type.isNotNull, (a: Story, b: Story) => a.modulePath === b.modulePath, Type.deepNotEquals)
	.withName("StoryGraphFiles")
;

export const RenderedStoryGraphFilesType = renderedTemplateBlockSubtype(StoryGraphFilesType).withName("RenderedStoryGraph");
