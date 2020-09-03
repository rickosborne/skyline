import {PRINT_DATA_TYPE, PRINT_TEMPLATE_ID} from "../../template/PrintModuleTemplate";
import {
	HasTemplateBlock,
	hasTemplateBlockSubtype,
	renderedTemplateBlockSubtype,
	TemplateBlock,
	TemplateBlockType
} from "./TemplateBlock";

export interface PrintTemplateBlock extends TemplateBlock {
	dataType: typeof PRINT_DATA_TYPE;
	templateId: typeof PRINT_TEMPLATE_ID;
}

export const PrintTemplateBlockType = TemplateBlockType.toBuilder()
	.withFixed("dataType", PRINT_DATA_TYPE)
	.withFixed("templateId", PRINT_TEMPLATE_ID)
	.withParent(TemplateBlockType)
	.withName<PrintTemplateBlock>("PrintTemplateBlock");

export interface PrintDataBlock extends HasTemplateBlock<PrintTemplateBlock> {
	fileBaseNames: string[];
}

export const PrintDataBlockType = hasTemplateBlockSubtype(PrintTemplateBlockType)
	.withScalarField<PrintDataBlock, "fileBaseNames", string[]>("fileBaseNames", (item: any): item is string[] => Array.isArray(item))
	.withName("PrintDataBlock")
;
export const RenderedPrintTemplateBlockType = renderedTemplateBlockSubtype(PrintDataBlockType).withName("RenderedPrint");
