import {EngineConfig} from "../EngineConfig";
import {HasTemplateBlock, RenderedTemplateBlock, RenderedTemplateBlockType, TemplateBlock} from "../type/TemplateBlock";
import {Transformer} from "./Transformer";
import * as diff from "diff";
import * as fs from "fs";

export class RenderedTemplateSaver extends Transformer<RenderedTemplateBlock<any>, undefined> {
	constructor(config: Partial<EngineConfig> = {}) {
		super(RenderedTemplateBlockType, undefined, config);
	}

	onInput(input: RenderedTemplateBlock<HasTemplateBlock<TemplateBlock>>): void {
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
		if (replacement.trim() === "") {
			throw new Error(`Empty replacement`);
		}
		if (templateBlock.entireBlock !== replacement) {
			const patch = diff.createPatch(RenderedTemplateBlockType.identify(input) || "", templateBlock.entireBlock, replacement, undefined, undefined, {newlineIsToken: true});
			this.logger.debug(patch);
			const updatedFile = templateBlock.markdownFile.fileText.text.replace(templateBlock.entireBlock, replacement);
			if (updatedFile !== templateBlock.markdownFile.fileText.text) {
				this.logger.debug(`Update ${templateBlock.markdownFile.fileText.file.pathFromRoot} because ${templateBlock.dataType} + ${templateBlock.templateId}`);
				if (this.config.write) {
					fs.writeFile(templateBlock.markdownFile.fileText.file.fullPath, updatedFile, {encoding: "utf8"}, () => {
						this.logger.debug(`Wrote ${templateBlock.markdownFile.fileText.file.pathFromRoot}`);
					});
				}
			} else {
				this.logger.error(`Failed to replace ${templateBlock.markdownFile.fileText.file.pathFromRoot}`);
			}
		} else {
			this.logger.debug(`No change: ${templateBlock.markdownFile.fileText.file.pathFromRoot}`);
		}
	}
}
