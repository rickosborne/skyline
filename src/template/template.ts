import {TemplateRenderer} from './TemplateRenderer';

const templateRenderer = new TemplateRenderer();

const sourceDirs = [
	'adapter',
	'story/iaso'
];

sourceDirs.forEach(sourceDir => {
	templateRenderer.scan(sourceDir, (dir, name) => {
		templateRenderer.markdown(dir, name);
	});
});
