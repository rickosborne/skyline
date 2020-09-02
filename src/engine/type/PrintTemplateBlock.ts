import {PRINT_DATA_TYPE, PRINT_TEMPLATE_ID} from "../../template/PrintModuleTemplate";
import {
	HasTemplateBlock,
	HasTemplateBlockSubtype,
	RenderedTemplateBlockType,
	TemplateBlock,
	TemplateBlockType
} from "./TemplateBlock";
import equal = require("fast-deep-equal");

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

export interface HasPrintTemplateBlock extends HasTemplateBlock<PrintTemplateBlock> {
	fileBaseNames: string[];
}

export const HasPrintTemplateBlockType = HasTemplateBlockSubtype(PrintTemplateBlockType,
	"HasPrintTemplateBlock",
	(item: any): item is HasPrintTemplateBlock => item != null && Array.isArray(item.fileBaseNames),
	(a, b) => true,
	(a, b) => !equal(a.fileBaseNames, b.fileBaseNames),
);
export const RenderedPrintTemplateBlockType = RenderedTemplateBlockType(HasPrintTemplateBlockType);
