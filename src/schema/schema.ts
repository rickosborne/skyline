import {SchemaRenderer} from './SchemaRenderer';

const schemaRenderer = new SchemaRenderer();

interface Targets {
	target: string;
	files: string[];
}

const dirs: Record<string, Targets> = {
	'data/schema': {
		target: __dirname,
		files: [
			'book.schema.json',
			'machine.schema.json'
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
