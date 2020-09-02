import {PrintModuleTemplate} from "../../template/PrintModuleTemplate";
import {isCreated, isReplay, isUpdated, OperationBase} from "../type/Operation";
import {PrintTemplateBlock, PrintTemplateBlockType, RenderedPrintTemplateBlockType} from "../type/PrintTemplateBlock";
import {
	SourceDirectoryFileList,
	SourceDirectoryFileListOperationType,
	SourceDirectoryType
} from "../type/SourceDirectory";
import {HasTemplateBlock, RenderedTemplateBlock} from "../type/TemplateBlock";
import {BiTransformer} from "./Transformer";

export class PrintTemplateRenderer extends BiTransformer<PrintTemplateBlock, OperationBase<SourceDirectoryFileList>, RenderedTemplateBlock<HasTemplateBlock<PrintTemplateBlock>>> {
	private readonly printRenderer = new PrintModuleTemplate();

	constructor() {
		super(PrintTemplateBlockType, SourceDirectoryFileListOperationType, RenderedPrintTemplateBlockType);
	}

	protected matchLeftRight(templateBlock: PrintTemplateBlock, fileListOperation: OperationBase<SourceDirectoryFileList>): boolean {
		return SourceDirectoryType.equals(templateBlock.markdownFile.fileText.file.directory, fileListOperation.item.sourceDirectory) &&
			(isCreated(fileListOperation) || isUpdated(fileListOperation) || isReplay(fileListOperation))
			;
	}

	protected onInputs(templateBlock: PrintTemplateBlock, fileListOperation: OperationBase<SourceDirectoryFileList>): void {
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
