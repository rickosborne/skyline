import {PrintModuleTemplate} from "../../template/PrintModuleTemplate";
import {isCreated, isReplay, isUpdated, OperationBase} from "../type/Operation";
import {
	SourceDirectoryFileList,
	SourceDirectoryFileListOperationType,
	SourceDirectoryType
} from "../type/SourceDirectory";
import {
	HasTemplateBlock,
	HasTemplateBlockType,
	RenderedTemplateBlock,
	RenderedTemplateBlockType,
	TemplateBlock,
	TemplateBlockType
} from "../type/TemplateBlock";
import {BiTransformer} from "./Transformer";

export class PrintTemplateRenderer extends BiTransformer<TemplateBlock, OperationBase<SourceDirectoryFileList>, RenderedTemplateBlock<HasTemplateBlock>> {
	private readonly printRenderer = new PrintModuleTemplate();

	constructor() {
		super(TemplateBlockType, SourceDirectoryFileListOperationType, RenderedTemplateBlockType(HasTemplateBlockType));
	}

	protected matchLeftRight(templateBlock: TemplateBlock, fileListOperation: OperationBase<SourceDirectoryFileList>): boolean {
		return templateBlock.dataType === this.printRenderer.DATA_TYPE &&
			templateBlock.templateId === this.printRenderer.TEMPLATE_ID &&
			SourceDirectoryType.equals(templateBlock.markdownFile.fileText.file.directory, fileListOperation.item.sourceDirectory) &&
			(isCreated(fileListOperation) || isUpdated(fileListOperation) || isReplay(fileListOperation))
			;
	}

	protected onInputs(templateBlock: TemplateBlock, fileListOperation: OperationBase<SourceDirectoryFileList>): void {
		const renderedText = this.printRenderer.render({
			dataName: templateBlock.dataName,
			fileBaseNames: fileListOperation.item.fileList
				.map(sourceFile => sourceFile.baseName)
				.sort()
				.filter(fileName => fileName.match(/^\d+-/)),
		}, templateBlock.keyValue, templateBlock.body);
		if (renderedText.trim() !== templateBlock.body.trim()) {
			this.notify({
				source: {
					templateBlock
				},
				renderedText,
			});
		}
	}
}
