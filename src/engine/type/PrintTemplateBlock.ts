import {PRINT_DATA_TYPE, PRINT_TEMPLATE_ID} from "../../template/PrintModuleTemplate";
import {
	HasTemplateBlock,
	hasTemplateBlockSubtype,
	renderedTemplateBlockSubtype,
	TemplateBlock,
	TemplateBlockType
} from "./TemplateBlock";
import {Type} from "./Type";

export interface PrintTemplateBlock extends TemplateBlock {
	dataType: typeof PRINT_DATA_TYPE;
	templateId: typeof PRINT_TEMPLATE_ID;
}

export const PrintTemplateBlockType = TemplateBlockType.toBuilder<PrintTemplateBlock>()
	.withFixed("dataType", PRINT_DATA_TYPE)
	.withFixed("templateId", PRINT_TEMPLATE_ID)
	.withName("PrintTemplateBlock");

export interface PrintDataBlock extends HasTemplateBlock<PrintTemplateBlock> {
	fileBaseNames: string[];
}

export const PrintDataBlockType = hasTemplateBlockSubtype<PrintTemplateBlock, PrintDataBlock>(PrintTemplateBlockType)
	.withScalarField("fileBaseNames", Type.isArray)
	.withName("PrintDataBlock");

export const RenderedPrintTemplateBlockType = renderedTemplateBlockSubtype(PrintDataBlockType).withName("RenderedPrint");
