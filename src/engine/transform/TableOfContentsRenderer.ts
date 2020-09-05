import * as diff from "diff";
import {WebTableOfContents} from "../../template/WebTableOfContents";
import {EngineConfig} from "../EngineConfig";
import {
	RenderedTableOfContentsTemplateBlockType,
	TableOfContentsBlock,
	TableOfContentsBlockType
} from "../type/TableOfContents";
import {RenderedTemplateBlock} from "../type/TemplateBlock";
import {Transformer} from "./Transformer";

export class TableOfContentsRenderer extends Transformer<TableOfContentsBlock, RenderedTemplateBlock<TableOfContentsBlock>> {
	protected readonly webTableOfContents: WebTableOfContents = new WebTableOfContents();

	constructor(config: Partial<EngineConfig> = {}) {
		super(TableOfContentsBlockType, RenderedTableOfContentsTemplateBlockType, config);
	}

	onInput(source: TableOfContentsBlock): void {
		if (!this.hasChanged(source)) {
			return;
		}
		const renderedText = this.webTableOfContents.render({
			items: source.items.contentItems,
		}, source.templateBlock.keyValue, source.templateBlock.body);
		if (renderedText.trim() !== source.templateBlock.body.trim()) {
			this.logger.debug(diff.createPatch(TableOfContentsBlockType.identify(source) || "", source.templateBlock.body, renderedText, undefined, undefined, {ignoreWhitespace: true}));
			this.notify({
				renderedText,
				source,
			});
		}
	}
}
