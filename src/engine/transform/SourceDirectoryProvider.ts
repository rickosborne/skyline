import * as path from "path";
import {ROOT_PATH} from "../util/RootPath";
import {SourceDirectory, SourceDirectoryType} from "../type/SourceDirectory";
import {Transformer} from "./Transformer";

export class SourceDirectoryProvider extends Transformer<void, SourceDirectory> {
	private readonly directories: SourceDirectory[];

	constructor(
		...pathsFromRoot: string[]
	) {
		super(
			undefined,
			SourceDirectoryType,
		);
		this.directories = pathsFromRoot.map(pathFromRoot => {
			const fullPath = path.normalize(path.join(ROOT_PATH, pathFromRoot));
			return {
				pathFromRoot,
				fullPath,
				fileName: path.basename(fullPath),
			};
		})
	}

	onInput(input: void): void {
		throw new Error(`Unexpected call to SourceDirectoryProvider.onInput: ${JSON.stringify(input)}`);
	}

	start(): void {
		this.directories.forEach(dir => this.notify(dir));
	}
}
