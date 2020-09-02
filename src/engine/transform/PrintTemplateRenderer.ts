import {PrintModuleTemplate} from "../../template/PrintModuleTemplate";
import {
	HasPrintTemplateBlock,
	HasPrintTemplateBlockType,
	PrintTemplateBlock,
	RenderedPrintTemplateBlockType
} from "../type/PrintTemplateBlock";
import {HasTemplateBlock, RenderedTemplateBlock} from "../type/TemplateBlock";
import {Transformer} from "./Transformer";

export class PrintTemplateRenderer extends Transformer<HasPrintTemplateBlock, RenderedTemplateBlock<HasTemplateBlock<PrintTemplateBlock>>> {
	private readonly printRenderer = new PrintModuleTemplate();

	constructor() {
		super(HasPrintTemplateBlockType, RenderedPrintTemplateBlockType);
	}

	onInput(printBlock: HasPrintTemplateBlock): void {
		const renderedText = this.printRenderer.render({
			dataName: printBlock.templateBlock.dataName,
			fileBaseNames: printBlock.fileBaseNames,
		}, printBlock.templateBlock.keyValue, printBlock.templateBlock.body);
		if (renderedText.trim() !== printBlock.templateBlock.body.trim()) {
			this.notify({
				source: printBlock,
				renderedText,
			});
		}
	}
}
