import {PRINT_DATA_TYPE, PRINT_TEMPLATE_ID} from "../../template/PrintModuleTemplate";
import {HasTemplateBlockSubtype, RenderedTemplateBlockType, TemplateBlock, TemplateBlockType} from "./TemplateBlock";

export interface PrintTemplateBlock extends TemplateBlock {
	dataType: typeof PRINT_DATA_TYPE;
	templateId: typeof PRINT_TEMPLATE_ID;
}

export const PrintTemplateBlockType = TemplateBlockType.subtype("PrintTemplateBlock",
	(item: any): item is PrintTemplateBlock => item != null && item.dataType === PRINT_DATA_TYPE && item.templateId === PRINT_TEMPLATE_ID,
	(a, b) => a.dataType === b.dataType && a.templateId === b.templateId,
	(a, b) => a.dataType !== b.dataType || a.templateId !== b.templateId,
	item => TemplateBlockType.stringify(item),
);

export const HasPrintTemplateBlockType = HasTemplateBlockSubtype(PrintTemplateBlockType, "HasPrintTemplateBlock");
export const RenderedPrintTemplateBlockType = RenderedTemplateBlockType(HasPrintTemplateBlockType);
