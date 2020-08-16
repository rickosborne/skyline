import * as console from "console";
import * as fs from "fs";
import * as path from "path";
import * as process from "process";
import {SchemaRenderer} from "./SchemaRenderer";

const schemaRenderer = new SchemaRenderer();

interface Targets {
	target: string;
}

const dirs: Record<string, Targets> = {
	"data/schema": {
		target: __dirname,
	}
};

Object.keys(dirs).forEach(sourceDir => {
	const targets = dirs[sourceDir];
	schemaRenderer.scan(sourceDir, (dir, name) => {
		schemaRenderer.typescript(dir, name, targets.target).catch(err => {
			console.error(`Error rendering from ${sourceDir}/${name} to ${targets.target}`, err);
		});
	});
});

if (process.argv.includes("--watch")) {
	const rootPath = path.normalize(path.join(__dirname, "..", ".."));
	Object.entries(dirs).forEach(([dir, targets]) => {
		const targetRelative = targets.target.replace(rootPath, "");
		fs.watch(dir, (eventType, fileName) => {
			if (eventType !== "change") {
				console.error(`Unhandled change type: ${eventType}`);
				return;
			}
			if (fileName == null || fileName === "") {
				console.error(`No file given for change in ${dir}`);
				return;
			}
			const sourcePath = path.join(dir, fileName);
			try {
				schemaRenderer
					.typescript(dir, fileName, targets.target)
					.catch(err => console.error(`Failed to render ${sourcePath} to ${targetRelative}`, err));
			} catch (e) {
				console.error(`Failed to render ${sourcePath}: ${JSON.stringify(e)}`);
			}
		});
		console.log(`Watching: ${dir}`);
	});
}
