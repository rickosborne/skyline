import * as console from "console";
import * as fs from "fs";
import * as path from "path";
import * as process from "process";
import {TemplateRenderer} from "./TemplateRenderer";

const templateRenderer = new TemplateRenderer();

const ROOT_PATH = path.normalize(path.join(__dirname, "..", "..")) + "/";

const sourceDirs = [
	"adapter",
	"story/iaso",
	"CONTRIBUTING.md"
];

sourceDirs.forEach(sourceDir => {
	templateRenderer.scan(sourceDir, (dir, name) => {
		templateRenderer.markdown(dir, name);
	});
});


if (process.argv.includes("--watch")) {
	sourceDirs.forEach(dir => {
		const sourcePath = path.normalize(path.join(ROOT_PATH, dir));
		fs.watch(sourcePath, (eventType, fileName) => {
			if (eventType !== "change") {
				console.error(`Unhandled change type: ${eventType}`);
				return;
			}
			if (fileName == null || fileName == "") {
				console.error(`No file given while watching ${sourcePath}`);
				return;
			}
			let dirPart = dir;
			if (sourcePath.endsWith(fileName)) {
				dirPart = path.dirname(sourcePath);
			}
			const filePath = path.normalize(path.join(dirPart, fileName));
			if (!fs.existsSync(filePath)) {
				console.error(`No such file: ${filePath}`);
				return;
			}
			// console.info(`Changed: ${dirPart} ${fileName}`);
			try {
				templateRenderer
					.markdown(dirPart, fileName);
			} catch (e) {
				console.error(`Failed to render ${dirPart}/${fileName}: ${JSON.stringify(e)}`);
			}
		});
		console.log(`Watching: ${sourcePath}`);
	});
}
