import * as console from "console";
import * as fs from "fs";
import * as path from "path";
import * as process from "process";
import {SchemaRenderer} from "./SchemaRenderer";

const schemaRenderer = new SchemaRenderer();

interface Targets {
	files: string[];
	target: string;
}

const dirs: Record<string, Targets> = {
	"data/schema": {
		target: __dirname,
		files: [
			"book.schema.json",
			"machine.schema.json"
		]
	}
};

Object.keys(dirs).forEach(sourceDir => {
	const targets = dirs[sourceDir];
	schemaRenderer.scan(sourceDir, (dir, name) => {
		schemaRenderer.typescript(dir, name, targets.target).catch(err => {
			console.error(`Error rendering from ${sourceDir}/${name} to ${targets.target}`, err);
		});
	}, fileName => targets.files.includes(fileName));
});

if (process.argv.includes("--watch")) {
	const rootPath = path.normalize(path.join(__dirname, '..', '..'));
	Object.entries(dirs).forEach(([dir, targets]) => {
		for (let file of targets.files) {
			const sourcePath = path.join(dir, file);
			const targetRelative = targets.target.replace(rootPath, '');
			fs.watch(sourcePath, (eventType) => {
				if (eventType !== "change") {
					console.error(`Unhandled change type: ${eventType}`);
					return;
				}
				schemaRenderer
					.typescript(dir, file, targets.target)
					.catch(err => console.error(`Failed to render ${sourcePath} to ${targetRelative}`, err));
			});
			console.log(`Watching: ${sourcePath}`);
		}
	});
}
