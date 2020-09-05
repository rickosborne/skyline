import {PrintModuleTemplate} from "../../template/PrintModuleTemplate";
import {
	PrintDataBlock,
	PrintDataBlockType,
	PrintTemplateBlock,
	RenderedPrintTemplateBlockType
} from "../type/PrintTemplateBlock";
import {HasTemplateBlock, RenderedTemplateBlock} from "../type/TemplateBlock";
import {Transformer} from "./Transformer";

export class PrintTemplateRenderer extends Transformer<PrintDataBlock, RenderedTemplateBlock<HasTemplateBlock<PrintTemplateBlock>>> {
	private readonly printRenderer = new PrintModuleTemplate();

	constructor() {
		super(PrintDataBlockType, RenderedPrintTemplateBlockType);
	}

	onInput(printBlock: PrintDataBlock): void {
		if (!this.hasChanged(printBlock)) {
			return;
		}
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
