import {WebTableOfContents} from "../../template/WebTableOfContents";
import {
	RenderedTableOfContentsTemplateBlockType,
	TableOfContentsBlock,
	TableOfContentsBlockType
} from "../type/TableOfContents";
import {RenderedTemplateBlock} from "../type/TemplateBlock";
import {Transformer} from "./Transformer";

export class TableOfContentsRenderer extends Transformer<TableOfContentsBlock, RenderedTemplateBlock<TableOfContentsBlock>> {
	protected readonly webTableOfContents: WebTableOfContents = new WebTableOfContents();

	constructor() {
		super(TableOfContentsBlockType, RenderedTableOfContentsTemplateBlockType);
	}

	onInput(source: TableOfContentsBlock): void {
		if (!this.hasChanged(source)) {
			return;
		}
		const renderedText = this.webTableOfContents.render({
			items: source.items.contentItems,
		}, source.templateBlock.keyValue, source.templateBlock.body);
		if (renderedText.trim() !== source.templateBlock.body.trim()) {
			this.notify({
				renderedText,
				source,
			});
		}
	}
}
