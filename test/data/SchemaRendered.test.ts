import {expect} from "chai";
import "mocha";
import * as path from "path";
import {SchemaRenderer} from "../../src/schema/SchemaRenderer";

const templateRenderer = new SchemaRenderer();

const targetDir = path.join(__dirname, "..", "..", "src", "schema");

/**
 * These are just placeholders for schema partials.
 */
const IGNORED = [
	'cypher.schema.json',
	'dnd5e.schema.json',
	'skyline.schema.json'
];

templateRenderer.scan("data/schema", async (sourceDir, name) => {
	await templateRenderer.typescript(sourceDir, name, targetDir, (original, updated, source, target) => {
		describe(`Schema: ${name}`, () => {
			it("has up to date TS", () => {
				expect(updated.trim(), target).equals(original.trim());
			});
		});
		return false;
	});
}, fileName => !IGNORED.includes(fileName));
