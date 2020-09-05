import {EngineConfig} from "../EngineConfig";
import {HasTemplateBlock, RenderedTemplateBlock, RenderedTemplateBlockType} from "../type/TemplateBlock";
import {Transformer} from "./Transformer";
import * as diff from "diff";

export class RenderedTemplateSaver extends Transformer<RenderedTemplateBlock<any>, undefined> {
	constructor(config: Partial<EngineConfig> = {}) {
		super(RenderedTemplateBlockType, undefined, config);
	}

	onInput(input: RenderedTemplateBlock<HasTemplateBlock<any>>): void {
		if (!this.hasChanged(input)) {
			return;
		}
		// RenderedTemplateBlockType.stringify(1234 as unknown as RenderedTemplateBlock<any>);
		const templateBlock = input.source.templateBlock;
		const replacement = [
			input.startTag || templateBlock.startTag,
			input.renderedText,
			templateBlock.endTag,
		].join("\n\n");
		if (templateBlock.entireBlock !== replacement) {
			const patch = diff.createPatch(RenderedTemplateBlockType.identify(input) || "", templateBlock.entireBlock, replacement, undefined, undefined, {newlineIsToken: true});
			this.logger.debug(patch);
			const updatedFile = templateBlock.markdownFile.fileText.text.replace(templateBlock.entireBlock, replacement);
			if (updatedFile !== templateBlock.markdownFile.fileText.text) {
				this.logger.debug(`Update ${templateBlock.markdownFile.fileText.file.pathFromRoot} because ${templateBlock.dataType} + ${templateBlock.templateId}`)
			} else {
				this.logger.error(`Failed to replace ${templateBlock.markdownFile.fileText.file.pathFromRoot}`);
			}
		} else {
			this.logger.debug(`No change: ${templateBlock.markdownFile.fileText.file.pathFromRoot}`);
		}
	}
}
