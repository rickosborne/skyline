import * as fs from "fs";
import * as path from "path";
import * as YAML from "yaml";
import {ATemplate} from "./ATemplate";
import {FrontMatter} from "./FrontMatter";

export interface RenderFileRequest<C> {
	context: C | undefined;
	dataName: string;
	fileName: string;
	modulePath: string;
	params: Record<string, string>;
}

export interface RenderFileResult<F, C> {
	context: C;
	file: F | undefined;
}

export interface Hyperlink {
	classNames?: string[];
	href: string;
	title: string;
}

export abstract class AFilesTemplate<T extends object, F, C> extends ATemplate<T> {
	public readonly ROOT_PATH = path.normalize(path.join(__dirname, "..", ".."));

	abstract get DATA_TYPE(): string;

	abstract get TEMPLATE_ID(): string;

	canRender(dataType: string, templateId: string, params: Record<string, string>): boolean {
		return dataType == this.DATA_TYPE && templateId === this.TEMPLATE_ID;
	}

	getData(dataType: string, dataName: string, params: Record<string, string>): T | undefined {
		if (dataType !== this.DATA_TYPE) {
			return undefined;
		}
		const modulePath = path.normalize(path.join(this.ROOT_PATH, dataName));
		if (!fs.existsSync(modulePath)) {
			throw new Error(`Unknown module path: ${dataName} (via ${this.ROOT_PATH})`);
		}
		let context = this.initialRenderFileContext();
		return this.renderData(dataName, params, fs.readdirSync(modulePath, {encoding: "utf8", withFileTypes: true})
			.filter(file => file.isFile() && file.name.endsWith(".md"))
			.map(file => file.name)
			.filter(fileName => this.isPrintable(fileName))
			.sort()
			.map(fileName => {
				const renderFileResult = this.renderFile({
					context,
					dataName,
					fileName,
					modulePath,
					params
				});
				context = renderFileResult.context;
				return renderFileResult.file as F;
			})
			.filter(f => f != null));
	}

	initialRenderFileContext(): C | undefined {
		return undefined;
	}

	public isPrintable(fileName: string): boolean {
		return !!fileName.match(/^\d+-/);
	}

	readModuleFile(request: RenderFileRequest<any>): string {
		return fs.readFileSync(path.join(request.modulePath, request.fileName), {encoding: "utf8"});
	}

	abstract renderData(dataName: string, params: Record<string, string>, files: F[]): T;

	abstract renderFile(request: RenderFileRequest<C>): RenderFileResult<F, C>;
}
