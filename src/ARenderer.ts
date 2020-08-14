import * as fs from "fs";
import * as path from "path";

export abstract class ARenderer {
	public abstract getScanExtension(): string;

	public scan<T>(
		dir: string,
		block: (dir: string, name: string) => T,
		filterScannedFile: (fileName: string) => boolean = () => true
	): T[] {
		// console.log(`Scan: ${dir}`);
		const scanExtension = this.getScanExtension();
		const items = fs.readdirSync(dir, {withFileTypes: true});
		const results: T[] = [];
		for (const item of items) {
			if (item.isDirectory() && !item.name.startsWith(".")) {
				const partial = this.scan(path.join(dir, item.name), block);
				results.push(...partial);
			} else if (item.isFile() && item.name.endsWith(scanExtension) && filterScannedFile(item.name)) {
				const result = block(dir, item.name);
				results.push(result);
			}
		}
		return results;
	}
}
