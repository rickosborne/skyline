import {MAP_DATA_TYPE, MAP_SVG_TEMPLATE_ID} from "../../template/MapRenderer";
import {
	HasTemplateBlock,
	hasTemplateBlockSubtype,
	RenderedTemplateBlock,
	renderedTemplateBlockSubtype,
	TemplateBlock,
	TemplateBlockType
} from "./TemplateBlock";
import {Type} from "./Type";

export interface MapTemplateBlock extends TemplateBlock {
	dataType: typeof MAP_DATA_TYPE;
	templateId: typeof MAP_SVG_TEMPLATE_ID;
}

export const MapTemplateBlockType: Type<MapTemplateBlock> = TemplateBlockType.toBuilder<MapTemplateBlock>()
	.withFixed("dataType", MAP_DATA_TYPE)
	.withFixed("templateId", MAP_SVG_TEMPLATE_ID)
	.withName("MapTemplateBlock");

export interface MapDataBlock extends HasTemplateBlock<MapTemplateBlock> {
}

export const MapDataBlockType: Type<MapDataBlock> = hasTemplateBlockSubtype<MapTemplateBlock, MapDataBlock>(MapTemplateBlockType)
	.withName("MapDataBlock");

export const RenderedMapDataBlockType: Type<RenderedTemplateBlock<MapDataBlock>> = renderedTemplateBlockSubtype<MapTemplateBlock, MapDataBlock, RenderedTemplateBlock<MapDataBlock>>(MapDataBlockType)
	.withName("RenderedMapDataBlock");
