import {Transformer} from "./Transformer";
import {HasTemplateBlock, RenderedTemplateBlock, RenderedTemplateBlockAnyType} from "../type/TemplateBlock";

export class RenderedTemplateSaver extends Transformer<RenderedTemplateBlock<any>, undefined> {
	constructor() {
		super(RenderedTemplateBlockAnyType, undefined);
	}

	onInput(input: RenderedTemplateBlock<HasTemplateBlock>): void {
		const templateBlock = input.source.templateBlock;
		const replacement = [
			input.startTag || templateBlock.startTag,
			input.renderedText,
			templateBlock.endTag,
		].join("\n\n");
		if (templateBlock.entireBlock !== replacement) {
			const updatedFile = templateBlock.markdownFile.fileText.text.replace(templateBlock.entireBlock, replacement);
			if (updatedFile !== templateBlock.markdownFile.fileText.text) {
				console.debug(`[${this}] Update ${templateBlock.markdownFile.fileText.file.pathFromRoot} because ${templateBlock.dataType} + ${templateBlock.templateId}`)
			} else {
				console.error(`[${this}] Failed to replace ${templateBlock.markdownFile.fileText.file.pathFromRoot}`);
			}
		} else {
			console.debug(`[${this}] No change: ${templateBlock.markdownFile.fileText.file.pathFromRoot}`);
		}
	}
}
