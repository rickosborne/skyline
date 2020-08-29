import 'mocha';
import {TemplateRenderer} from '../../src/template/TemplateRenderer';
import {eachMachine} from '../helper/MachineTestHelper';
import {expect} from 'chai';

const templateRenderer = new TemplateRenderer();

interface TemplateBlock {
	dataName: string;
	dataType: string;
	originalBody: string;
	templateDir: string;
	templateFileName: string;
	templateId: string;
	updatedBody: string;
}

const templateBlocks: TemplateBlock[] = [];

describe("Template Rendered", async () => {
	return new Promise(resolve => {
		templateRenderer.scan('adapter', async (dir, name) => {
			await templateRenderer.markdown(dir, name, (updatedBody, originalBody, dataType, dataName, templateId, templateDir, templateFileName) => {
				templateBlocks.push({
					updatedBody,
					originalBody,
					dataType,
					dataName,
					templateId,
					templateDir,
					templateFileName
				});
				return false;
			});

			eachMachine((machine, fileName) => {
				describe(`TemplateRendered: ${fileName}`, () => {
					const blocks = templateBlocks
						.filter(block => block.dataType === 'machine' && fileName === `${block.dataName}.machine.yaml`);

					// it('is rendered at least once', () => expect(blocks.length).is.at.least(1));

					for (let block of blocks) {
						it(`${block.templateDir}/${block.templateFileName} has updated ${block.templateId}`, () => {
							expect(block.originalBody, 'originalBody').is.not.null;
							expect(block.updatedBody, 'updatedBody').is.not.null;
							expect(block.updatedBody.trim(), 'original == updated').equals(block.originalBody.trim());
						});
					}
				});
			});

			resolve();
		});
	});
});

