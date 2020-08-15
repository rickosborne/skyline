import * as console from "console";
import * as fs from "fs";
import {compileFromFile} from "json-schema-to-typescript";
import * as path from "path";
import {ARenderer} from "../ARenderer";

export class SchemaRenderer extends ARenderer {
	getScanExtension(): string {
		return ".schema.json";
	}

	async typescript(
		sourceDir: string,
		fileName: string,
		targetDir: string,
		block: (
			originalTypescript: string,
			updatedTypescript: string,
			sourcePath: string,
			targetPath: string,
		) => void = this.writeIfNeeded,
	) {
		const sourcePath = path.join(sourceDir, fileName);
		const targetName = fileName.replace(this.getScanExtension(), ".ts");
		const targetPath = path.join(targetDir, targetName);
		const originalTypescript = fs.existsSync(targetPath) ? fs.readFileSync(targetPath, {encoding: "utf8"}) : "";
		const updatedTypescript = await compileFromFile(sourcePath, {
			cwd: sourceDir,
			bannerComment: `/* tslint:disable */
				/**
				 * DO NOT MODIFY THIS FILE BY HAND.
				 * Original source: ${fileName}
				 */
			`,
			style: {
				bracketSpacing: false,
				printWidth: 120,
				semi: true,
				singleQuote: true,
				tabWidth: 2,
				trailingComma: "es5",
				useTabs: false
			},
		});
		block(originalTypescript, updatedTypescript, sourcePath, targetPath);
	}

	public writeIfNeeded(
		originalTypescript: string,
		updatedTypescript: string,
		sourcePath: string,
		targetPath: string
	) {
		if (originalTypescript !== updatedTypescript) {
			console.log(`Updated: ${sourcePath} => ${targetPath}`);
			fs.writeFileSync(targetPath, updatedTypescript, {encoding: "utf8"});
		}
	}
}
