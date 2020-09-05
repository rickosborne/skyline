import {EngineConfig} from "../EngineConfig";
import {MarkdownFile, MarkdownFileType} from "../type/MarkdownFile";
import {TEMPLATE_REGEXP, TemplateBlock, TemplateBlockType} from "../type/TemplateBlock";
import {Transformer} from "./Transformer";

export class TemplateBlockReader extends Transformer<MarkdownFile, TemplateBlock> {
	constructor(config: Partial<EngineConfig> = {}) {
		super(MarkdownFileType, TemplateBlockType, config);
	}

	capture(groups: Record<string, string>, key: string): string {
		const value = groups[key];
		if (value == null) {
			this.logger.error(`Missing capture group ${key}`);
		}
		return value;
	}

	kvPairs(kv: string | undefined): Record<string, string> {
		const pairs: Record<string, string> = {};
		let match;
		const re = /\s*(\w+)=(?:"([^"]*)"|(\S+))/g;
		while ((match = re.exec(kv || ""))) {
			pairs[match[1]] = match[2] || match[3];
		}
		return pairs;
	}

	onInput(markdownFile: MarkdownFile): void {
		if (!this.hasChanged(markdownFile)) {
			return;
		}
		for (let match of markdownFile.fileText.text.matchAll(TEMPLATE_REGEXP)) {
			const groups = match.groups;
			if (groups == null) {
				this.logger.error(`Missing capture groups: ${JSON.stringify(match)}`);
				continue;
			}
			this.notify({
				markdownFile,
				body: this.capture(groups, "body"),
				dataName: this.capture(groups, "dataName"),
				dataType: this.capture(groups, "dataType"),
				endTag: this.capture(groups, "endTag"),
				entireBlock: match[0],
				keyValue: this.kvPairs(groups.keyValuePairs),
				startTag: this.capture(groups, "startTag"),
				templateId: this.capture(groups, "templateId"),
			});
		}
	}
}
